import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Clock, Power } from 'lucide-react';

interface StatusBadgeProps {
  status: 'normal' | 'wasting' | 'warning' | 'inspected' | 'critical' | 'resolved';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  size = 'md' 
}) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'normal':
    case 'resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs ${
          isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}>
          <CheckCircle2 className={isSm ? 'w-3 h-3 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
          <span>{label || 'Normal'}</span>
        </span>
      );

    case 'wasting':
    case 'critical':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs ${
          isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
          <span>{label || 'Wasting Energy'}</span>
        </span>
      );

    case 'warning':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs ${
          isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}>
          <AlertTriangle className={isSm ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
          <span>{label || 'Anomaly'}</span>
        </span>
      );

    case 'inspected':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs ${
          isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}>
          <Clock className={isSm ? 'w-3 h-3 text-blue-600' : 'w-3.5 h-3.5 text-blue-600'} />
          <span>{label || 'Inspected'}</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200 ${
          isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}>
          <span>{label || 'Standby'}</span>
        </span>
      );
  }
};
