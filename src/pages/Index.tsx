import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FaceScannerAnimation from '@/components/FaceScannerAnimation';
import { Camera, Users, BarChart3, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-block animate-float">
              <FaceScannerAnimation size={250} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse-glow">
              AI Attendance System
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Next-generation attendance tracking powered by advanced facial recognition and machine learning technology
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue text-lg px-8">
                  <Camera className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 glow-border-purple">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              {
                icon: Camera,
                title: 'Face Recognition',
                description: 'Advanced AI-powered facial recognition for instant attendance marking',
                color: 'blue'
              },
              {
                icon: Users,
                title: 'Multi-Role Access',
                description: 'Separate dashboards for students, teachers, and administrators',
                color: 'purple'
              },
              {
                icon: BarChart3,
                title: 'Real-time Analytics',
                description: 'Track attendance patterns and generate comprehensive reports',
                color: 'blue'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Encrypted data storage with industry-standard security protocols',
                color: 'purple'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:glow-border-${feature.color} transition-all duration-300 hover:scale-105 animate-float`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-12 h-12 rounded-lg ${feature.color === 'blue' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'} flex items-center justify-center mb-4 glow-${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-20 text-muted-foreground">
            <p>AI Attendance System © 2025 - Powered by Advanced Machine Learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
