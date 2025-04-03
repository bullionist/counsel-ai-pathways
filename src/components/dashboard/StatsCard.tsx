
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 text-counsel-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
            <span className="text-muted-foreground ml-1">from last session</span>
          </p>
        )}
        {description && (
          <CardDescription className="text-xs mt-1">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
