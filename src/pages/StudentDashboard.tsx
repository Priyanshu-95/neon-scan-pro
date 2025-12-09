import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Clock, Camera, LogOut, User } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import CameraFeed from '@/components/CameraFeed';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AttendanceRecord {
  id: string;
  marked_at: string;
  status: string;
  face_verified: boolean;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    attendedClasses: 0,
    attendanceRate: 0,
    thisMonthRate: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAttendanceRecords();
    }
  }, [user]);

  const fetchAttendanceRecords = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', user.id)
      .order('marked_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching attendance:', error);
      return;
    }

    setAttendanceRecords(data || []);

    // Calculate stats
    const total = data?.length || 0;
    const present = data?.filter(r => r.status === 'present').length || 0;
    const rate = total > 0 ? (present / total) * 100 : 0;

    setStats({
      totalClasses: total,
      attendedClasses: present,
      attendanceRate: rate,
      thisMonthRate: rate
    });
  };

  const handleMarkAttendance = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setScanning(true);
    
    // Simulate face recognition delay
    setTimeout(async () => {
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: user.id,
          status: 'present',
          face_verified: true,
          marked_at: new Date().toISOString()
        });

      setScanning(false);

      if (error) {
        console.error('Error marking attendance:', error);
        toast.error('Failed to mark attendance');
      } else {
        toast.success('Attendance marked successfully!');
        fetchAttendanceRecords();
      }
    }, 3000);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Attendance Rate"
            value={`${stats.attendanceRate.toFixed(1)}%`}
            icon={CheckCircle2}
            trend={stats.attendanceRate > 75 ? '+' : ''}
            glowColor="blue"
          />
          <DashboardCard
            title="Classes Attended"
            value={`${stats.attendedClasses}/${stats.totalClasses}`}
            icon={Calendar}
            glowColor="purple"
          />
          <DashboardCard
            title="This Month"
            value={`${stats.thisMonthRate.toFixed(0)}%`}
            icon={Clock}
            glowColor="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mark Attendance Section */}
          <DashboardCard title="Mark Today's Attendance" glowColor="blue">
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <CameraFeed isActive={scanning} size={240} />
              </div>
              <Button 
                onClick={handleMarkAttendance} 
                disabled={scanning}
                className="w-full bg-primary hover:bg-primary/90 glow-blue"
              >
                <Camera className="mr-2 h-4 w-4" />
                {scanning ? 'Scanning Face...' : 'Mark Attendance via Face Recognition'}
              </Button>
            </div>
          </DashboardCard>

          {/* Attendance History */}
          <DashboardCard title="Recent Attendance History" glowColor="purple">
            <div className="space-y-3">
              {attendanceRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No attendance records yet. Mark your first attendance!
                </p>
              ) : (
                attendanceRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${record.status === 'present' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <div>
                        <p className="font-medium">
                          {format(new Date(record.marked_at), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(record.marked_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium capitalize ${record.status === 'present' ? 'text-green-400' : 'text-red-400'}`}>
                      {record.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
