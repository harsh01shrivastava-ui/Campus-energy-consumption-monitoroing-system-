import React from 'react';
import { UserRole } from '../../types';
import { RoleSwitcher } from './RoleSwitcher';
import { Zap, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeWastageKw: number;
  wastingRoomsCount: number;
  openTicketsCount: number;
  currency: 'USD' | 'INR';
  onToggleCurrency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeWastageKw,
  wastingRoomsCount,
  openTicketsCount,
  currency,
  onToggleCurrency,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Project Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 shrink-0">
            <Zap className="w-5 h-5 fill-white/20" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight truncate">
                Campus Energy Consumption Monitoring System
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Grid
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden md:inline">Multi-Role Telemetry Platform</span>
              <span className="hidden md:inline">•</span>
              <span className="text-emerald-700 font-semibold capitalize">
                {currentRole === 'student' && 'Student / Class Rep Portal'}
                {currentRole === 'maintenance' && 'Maintenance Field Operations'}
                {currentRole === 'admin' && 'Executive Administration & Forecast'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-mono font-semibold text-slate-700 transition-colors"
            title="Toggle Currency ($ USD / ₹ INR)"
          >
            <span>{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
          </button>

          {/* Wastage Status Capsule */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border bg-slate-50 border-slate-200 text-slate-700">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>Grid Load:</span>
            {wastingRoomsCount > 0 ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                {activeWastageKw.toFixed(2)} kW Wasted
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                0 kW Wasted
              </span>
            )}
          </div>

          {/* Role Switcher Component */}
          <RoleSwitcher
            currentRole={currentRole}
            onRoleChange={onRoleChange}
            openTicketsCount={openTicketsCount}
            wastingRoomsCount={wastingRoomsCount}
          />
        </div>

      </div>
    </header>
  );
};
