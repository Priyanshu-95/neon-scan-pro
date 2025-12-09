import { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FaceCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  capturedImage?: string | null;
  size?: number;
}

const FaceCapture = ({ onCapture, capturedImage, size = 280 }: FaceCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localCapturedImage, setLocalCapturedImage] = useState<string | null>(capturedImage || null);

  useEffect(() => {
    if (!localCapturedImage) {
      startCamera();
    }
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setLocalCapturedImage(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw mirrored image
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setLocalCapturedImage(imageUrl);
        stopCamera();
        onCapture(blob);
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setLocalCapturedImage(null);
    startCamera();
  };

  if (error) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-muted/50 rounded-xl border border-border"
        style={{ width: size, height: size }}
      >
        <CameraOff className="w-12 h-12 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground text-center px-4">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={startCamera}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (localCapturedImage) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative rounded-xl overflow-hidden border-2 border-green-500 glow-blue"
          style={{ width: size, height: size }}
        >
          <img 
            src={localCapturedImage} 
            alt="Captured face" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
        <Button variant="outline" onClick={retakePhoto} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retake Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-xl border-2 border-primary glow-blue"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {/* Face guide overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
          {/* Oval face guide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="border-2 border-dashed border-primary/50 rounded-full"
              style={{ width: '60%', height: '75%' }}
            />
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Position your face within the oval guide
      </p>

      <Button 
        onClick={capturePhoto} 
        disabled={isCapturing || !stream}
        className="gap-2 glow-blue"
      >
        <Camera className="w-4 h-4" />
        {isCapturing ? 'Capturing...' : 'Capture Photo'}
      </Button>
    </div>
  );
};

export default FaceCapture;
