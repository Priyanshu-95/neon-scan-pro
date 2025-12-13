import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { capturedImage } = await req.json();

    if (!capturedImage) {
      return new Response(
        JSON.stringify({ status: "failed", reason: "no_image", message: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Received face scan attendance request");

    // Initialize Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all profiles with face images
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name, enrollment_number, roll_number, face_image_url")
      .not("face_image_url", "is", null);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return new Response(
        JSON.stringify({ status: "failed", reason: "database_error", message: "Failed to fetch profiles" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ status: "failed", reason: "no_registered_faces", message: "No registered faces in the system" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${profiles.length} profiles with face images`);

    // Use Lovable AI to compare faces
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ status: "failed", reason: "config_error", message: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let matchedProfile = null;
    let highestConfidence = 0;

    // Compare captured face with each registered face
    for (const profile of profiles) {
      if (!profile.face_image_url) continue;

      try {
        console.log(`Comparing with profile: ${profile.full_name}`);
        
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are a face recognition system. Compare two face images and determine if they are the same person.
                
                Analyze facial features including:
                - Face shape and structure
                - Eye shape, size, and positioning
                - Nose shape and size
                - Mouth and lip structure
                - Overall facial proportions
                
                Account for differences in:
                - Lighting conditions
                - Camera angle
                - Image quality
                
                Respond with a JSON object containing:
                - "match": true or false
                - "confidence": a number from 0 to 100 representing how confident you are
                - "reason": brief explanation
                
                IMPORTANT: Only return the JSON object, no other text.`
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Compare these two face images and determine if they are the same person. Image 1 is the captured image, Image 2 is the registered face."
                  },
                  {
                    type: "image_url",
                    image_url: { url: capturedImage }
                  },
                  {
                    type: "image_url",
                    image_url: { url: profile.face_image_url }
                  }
                ]
              }
            ],
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI API error for profile ${profile.full_name}:`, await aiResponse.text());
          continue;
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;
        
        if (!content) {
          console.error(`No content in AI response for profile ${profile.full_name}`);
          continue;
        }

        // Parse the JSON response
        let result;
        try {
          // Handle potential markdown code blocks
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            result = JSON.parse(content);
          }
        } catch (parseError) {
          console.error(`Failed to parse AI response for profile ${profile.full_name}:`, content);
          continue;
        }

        console.log(`Match result for ${profile.full_name}:`, result);

        if (result.match && result.confidence > highestConfidence) {
          highestConfidence = result.confidence;
          matchedProfile = profile;
        }
      } catch (error) {
        console.error(`Error comparing with profile ${profile.full_name}:`, error);
        continue;
      }
    }

    // Threshold for a valid match
    const CONFIDENCE_THRESHOLD = 70;

    if (!matchedProfile || highestConfidence < CONFIDENCE_THRESHOLD) {
      // Log failed attempt
      await supabase.from("attendance_records").insert({
        user_id: "00000000-0000-0000-0000-000000000000", // Placeholder for unmatched
        status: "failed",
        method: "face_scan",
        attempt_status: "failed",
        failure_reason: matchedProfile ? "low_confidence" : "no_match",
        face_verified: false,
      });

      return new Response(
        JSON.stringify({ 
          status: "failed", 
          reason: "no_match", 
          message: "No matching face found in the database. Please try again or contact admin.",
          confidence: highestConfidence
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for duplicate attendance today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: existingAttendance } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("user_id", matchedProfile.user_id)
      .eq("status", "present")
      .gte("marked_at", today.toISOString())
      .lt("marked_at", tomorrow.toISOString())
      .single();

    if (existingAttendance) {
      return new Response(
        JSON.stringify({ 
          status: "already_marked", 
          message: "Attendance already marked for today",
          student: {
            name: matchedProfile.full_name,
            enroll: matchedProfile.enrollment_number || matchedProfile.roll_number || "N/A"
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark attendance
    const { error: insertError } = await supabase.from("attendance_records").insert({
      user_id: matchedProfile.user_id,
      status: "present",
      method: "face_scan",
      student_name: matchedProfile.full_name,
      enrollment_number: matchedProfile.enrollment_number || matchedProfile.roll_number,
      attempt_status: "success",
      face_verified: true,
    });

    if (insertError) {
      console.error("Error inserting attendance:", insertError);
      return new Response(
        JSON.stringify({ status: "failed", reason: "database_error", message: "Failed to mark attendance" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Attendance marked for ${matchedProfile.full_name} with confidence ${highestConfidence}%`);

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Attendance marked successfully",
        student: {
          name: matchedProfile.full_name,
          enroll: matchedProfile.enrollment_number || matchedProfile.roll_number || "N/A"
        },
        confidence: highestConfidence
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ status: "failed", reason: "server_error", message: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
