import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FaceScannerAnimation from '@/components/FaceScannerAnimation';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login logic
    if (email.includes('student')) {
      navigate('/student/dashboard');
      toast.success('Welcome back, Student!');
    } else if (email.includes('teacher')) {
      navigate('/teacher/dashboard');
      toast.success('Welcome back, Teacher!');
    } else if (email.includes('admin')) {
      navigate('/admin/dashboard');
      toast.success('Welcome back, Admin!');
    } else {
      navigate('/student/dashboard');
      toast.success('Login successful!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl flex items-center justify-center gap-12 relative z-10">
        {/* Scanner Animation */}
        <div className="hidden lg:block animate-float">
          <FaceScannerAnimation size={300} />
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border glow-border-blue">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Attendance System
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-blue">
                Login
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                New user?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-sm text-muted-foreground">
        AI Attendance System © 2025
      </div>
    </div>
  );
};

export default Login;
