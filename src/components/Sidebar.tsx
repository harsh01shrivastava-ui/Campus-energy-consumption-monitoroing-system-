import React from 'react';

export type NavPath =
  | 'overview-dashboard'
  | 'campus-map-rooms'
  | 'checklists-reports'
  | 'analytics-anomalies'
  | 'leaderboard';

interface SidebarProps {
  currentPath: NavPath;
  onNavigate: (path: NavPath) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentKw: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  currentKw,
}) => {
  const navItems: { path: NavPath; label: string; icon: string }[] = [
    {
      path: 'overview-dashboard',
      label: 'Overview Dashboard',
      icon: 'dashboard',
    },
    {
      path: 'campus-map-rooms',
      label: 'Campus Map & Rooms',
      icon: 'domain',
    },
    {
      path: 'checklists-reports',
      label: 'Checklists & Reports',
      icon: 'assignment_turned_in',
    },
    {
      path: 'analytics-anomalies',
      label: 'Analytics & Anomalies',
      icon: 'query_stats',
    },
    {
      path: 'leaderboard',
      label: 'Leaderboard',
      icon: 'trophy',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-space-lg px-space-md transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-space-lg">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-space-sm">
            <button
              onClick={() => {
                onNavigate('overview-dashboard');
                onCloseMobile();
              }}
              className="flex items-center gap-space-sm text-left hover:opacity-90 transition-opacity"
            >
              <img
                alt="Campus EcoTrack Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VOqayPz7h_XCZJcesT4jxVj0FsX3tfJ8dsQb7GRyfRBW0M3ZJ98UYOeOK7aPO0NSTsWlGuWlX9ZSNe1BwROc-EAmW_9OPGgd7NIJJgDn09Saq3NOziyHA7U76rXDRS4mWlrTkesMS3QyoTXI1FT2GnN3DdQZHpE7S30_vrQQ_OYfHilar4F1IGZK7SooVt3LHq_rzodQ4DL4MztiTFJlx7qg_HY2FQ7F5ILBuhdm9sqT4NZWHtFQo5TAC7"
                onError={(e) => {
                  // Fallback if image blocked
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                  EcoTrack
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Campus Core
                </span>
              </div>
            </button>

            <button
              aria-label="Close navigation"
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    onCloseMobile();
                  }}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all font-body-md text-body-md text-left w-full ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-headline-sm font-semibold rounded-lg shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-secondary-fixed' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Current Load Widget */}
        <div className="flex flex-col gap-space-sm">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">
                Current Load
              </span>
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                -14% avg
              </span>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-md text-metric-md text-on-surface font-bold">
                {currentKw.toFixed(1)}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">kW</span>
            </div>

            {/* Gauge bar */}
            <div className="w-full bg-surface-container h-1.5 rounded-full mt-space-sm overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.round((currentKw / 70) * 100))}%` }}
              />
            </div>
          </div>

          {/* Telemetry version & live beacon */}
          <div className="flex items-center justify-between px-space-sm pt-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Telemetry v2.4
            </span>
            <span className="flex h-2 w-2 relative" title="Real-time Node Telemetry Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
