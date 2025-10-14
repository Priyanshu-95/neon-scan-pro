import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Clock, Camera, LogOut, User } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import FaceScannerAnimation from '@/components/FaceScannerAnimation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

  const handleMarkAttendance = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success('Attendance marked successfully!');
    }, 3000);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <div className="flex items-center gap-4">
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
            value="87.5%"
            icon={CheckCircle2}
            trend="+2.3%"
            glowColor="blue"
          />
          <DashboardCard
            title="Classes Attended"
            value="35/40"
            icon={Calendar}
            glowColor="purple"
          />
          <DashboardCard
            title="This Month"
            value="92%"
            icon={Clock}
            trend="+5.1%"
            glowColor="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mark Attendance Section */}
          <DashboardCard title="Mark Today's Attendance" glowColor="blue">
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                {scanning ? (
                  <FaceScannerAnimation size={200} />
                ) : (
                  <div className="text-center space-y-4">
                    <Camera className="w-16 h-16 mx-auto text-primary" />
                    <p className="text-muted-foreground">Ready to scan your face</p>
                  </div>
                )}
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
              {[
                { date: 'Today, Jan 15', status: 'Present', time: '09:15 AM' },
                { date: 'Jan 14', status: 'Present', time: '09:10 AM' },
                { date: 'Jan 13', status: 'Absent', time: '-' },
                { date: 'Jan 12', status: 'Present', time: '09:20 AM' },
                { date: 'Jan 11', status: 'Present', time: '09:05 AM' },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${record.status === 'Present' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <p className="font-medium">{record.date}</p>
                      <p className="text-sm text-muted-foreground">{record.time}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${record.status === 'Present' ? 'text-green-400' : 'text-red-400'}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
