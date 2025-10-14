import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FaceScannerAnimation from '@/components/FaceScannerAnimation';
import { toast } from 'sonner';
import { Camera, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    enrollmentNo: '',
    class: '',
    department: '',
    email: '',
    password: '',
  });

  const handleScanFace = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success('Face data captured successfully!');
      setStep(2);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => {
      toast.success('Registration completed successfully!');
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-xl border-border glow-border-blue">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            New User Registration
          </CardTitle>
          <CardDescription>Step {step} of 3 - {step === 1 ? 'Face Scan' : step === 2 ? 'Personal Details' : 'Confirmation'}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <FaceScannerAnimation size={250} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Scan Your Face</h3>
                <p className="text-muted-foreground">
                  Position your face in the center and click the button below
                </p>
              </div>
              <Button 
                onClick={handleScanFace} 
                disabled={scanning}
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue"
              >
                <Camera className="mr-2 h-4 w-4" />
                {scanning ? 'Scanning...' : 'Scan & Save Face Data'}
              </Button>
              <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground">
                Already have an account? Login
              </Link>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNo">Enrollment Number</Label>
                  <Input
                    id="enrollmentNo"
                    placeholder="ENR2025001"
                    value={formData.enrollmentNo}
                    onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, class: value })} required>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="freshman">Freshman</SelectItem>
                      <SelectItem value="sophomore">Sophomore</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, department: value })} required>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                      <SelectItem value="ce">Civil Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-input border-border"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 glow-blue">
                  Complete Registration
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 py-8">
              <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center glow-blue animate-pulse-glow">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Registration Successful!</h3>
                <p className="text-muted-foreground">
                  Your account has been created. Redirecting to login...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
