import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: string;
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          {badge && (
            <span className="text-2xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
