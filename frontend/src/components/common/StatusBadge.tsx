import React from 'react';

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
}

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let bg = 'bg-slate-50 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';

  switch (normalized) {
    case 'SCHEDULED':
    case 'PENDING':
      bg = 'bg-sky-50 text-sky-800 border-sky-200/80';
      dot = 'bg-sky-500';
      break;
    case 'CONFIRMED':
    case 'ACTIVE':
    case 'ADMITTED':
      bg = 'bg-teal-50 text-teal-800 border-teal-200/80';
      dot = 'bg-teal-500';
      break;
    case 'COMPLETED':
    case 'PAID':
    case 'DISCHARGED':
    case 'AVAILABLE':
    case 'OK':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      dot = 'bg-emerald-500';
      break;
    case 'CANCELLED':
    case 'INACTIVE':
    case 'OCCUPIED':
    case 'EXPIRED':
      bg = 'bg-rose-50 text-rose-800 border-rose-200/80';
      dot = 'bg-rose-500';
      break;
    case 'NO_SHOW':
    case 'MAINTENANCE':
    case 'LOW_STOCK':
      bg = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dot = 'bg-amber-500';
      break;
    case 'PARTIAL':
    case 'PARTIALLY_PAID':
    case 'EXPIRING_SOON':
      bg = 'bg-orange-50 text-orange-800 border-orange-200/80';
      dot = 'bg-orange-500';
      break;
    default:
      bg = 'bg-slate-50 text-slate-700 border-slate-200';
      dot = 'bg-slate-400';
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold tracking-wide uppercase border transition-all ${bg}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dot} shrink-0`} />}
      <span>{label}</span>
    </span>
  );
}
