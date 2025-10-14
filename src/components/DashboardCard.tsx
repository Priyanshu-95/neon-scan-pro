import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description?: string;
  value?: string | number;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
  children?: ReactNode;
  glowColor?: 'blue' | 'purple';
}

const DashboardCard = ({ 
  title, 
  description, 
  value, 
  icon: Icon, 
  trend,
  className = '',
  children,
  glowColor = 'blue'
}: DashboardCardProps) => {
  const glowClass = glowColor === 'blue' ? 'hover:glow-border-blue' : 'hover:glow-border-purple';
  
  return (
    <Card className={`bg-card border-border transition-all duration-300 hover:scale-[1.02] ${glowClass} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {Icon && (
            <div className={`p-2 rounded-lg ${glowColor === 'blue' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {description && (
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {value !== undefined && (
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <span className={`text-sm ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {trend}
              </span>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
