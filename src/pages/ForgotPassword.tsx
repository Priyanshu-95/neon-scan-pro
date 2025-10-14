import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Password reset link sent to your email!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border glow-border-purple">
        {!submitted ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input border-border focus:border-secondary"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground glow-purple">
                  Send Reset Link
                </Button>
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </form>
            </CardContent>
          </>
        ) : (
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center glow-purple">
              <Mail className="w-8 h-8 text-secondary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Check Your Email</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="mt-4">
                Return to Login
              </Button>
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
