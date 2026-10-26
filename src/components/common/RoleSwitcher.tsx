import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Wrench, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  openTicketsCount: number;
  wastingRoomsCount: number;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  openTicketsCount,
  wastingRoomsCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student / Class Rep Portal',
      shortTitle: 'Student / CR',
      badge: 'Grassroots',
      desc: 'ExitCheck QR simulator, EcoBot quick reports, class scorecard',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      accentBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'maintenance' as UserRole,
      title: 'Maintenance Portal',
      shortTitle: 'Maintenance Staff',
      badge: openTicketsCount > 0 ? `${openTicketsCount} Tickets` : 'Operational',
      badgeColor: openTicketsCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
      desc: 'Priority queue, field map, appliance overrides & shift notes',
      icon: <Wrench className="w-4 h-4 text-amber-600" />,
      accentBg: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrator Portal',
      shortTitle: 'Campus Admin',
      badge: wastingRoomsCount > 0 ? `${wastingRoomsCount} Alerts` : 'Optimal',
      badgeColor: wastingRoomsCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800',
      desc: 'Executive KPI bar, EnergyPredict AI forecast, policy controls',
      icon: <ShieldCheck className="w-4 h-4 text-slate-800" />,
      accentBg: 'bg-slate-100 text-slate-800',
    },
  ];

  const activeRoleData = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <div className="relative" ref={containerRef}>
      
      {/* Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-slate-100 text-slate-700 shrink-0">
            {activeRoleData.icon}
          </span>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
              Portal View
            </span>
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {activeRoleData.shortTitle}
            </span>
          </div>
        </div>

        {activeRoleData.id === 'maintenance' && openTicketsCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
            {openTicketsCount}
          </span>
        )}

        {activeRoleData.id === 'admin' && wastingRoomsCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
            {wastingRoomsCount}
          </span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Switch Operational Interface
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                3 completely customized multi-role experiences
              </p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          <div className="p-1.5 space-y-1">
            {roles.map((r) => {
              const isSelected = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    onRoleChange(r.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {r.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {r.title}
                      </span>
                      {r.badge && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : (r.badgeColor || 'bg-slate-100 text-slate-600')
                        }`}>
                          {r.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-1 leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {r.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-4 pt-2.5 pb-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Centralized Mock State</span>
            <span className="text-emerald-700 font-semibold">Instant Cross-Portal Sync</span>
          </div>
        </div>
      )}

    </div>
  );
};
