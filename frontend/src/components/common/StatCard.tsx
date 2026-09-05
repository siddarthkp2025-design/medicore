import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  badge?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className, badge }: StatCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all rounded-xl p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-black tracking-tight text-slate-900 mt-1.5">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-700 group-hover:bg-primary-50 group-hover:text-primary-800 transition-colors shadow-2xs">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(trend || badge) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold text-2xs",
                trendUp === undefined
                  ? "text-slate-500"
                  : trendUp
                  ? "text-emerald-700"
                  : "text-amber-700"
              )}
            >
              {trend}
            </span>
          )}
          {badge && (
            <span className="text-2xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {badge}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
