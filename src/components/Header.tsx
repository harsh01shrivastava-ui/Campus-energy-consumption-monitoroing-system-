import React, { useState, useRef, useEffect } from 'react';
import { NavPath } from './Sidebar';

interface HeaderProps {
  currentPath: NavPath;
  onNavigate: (path: NavPath) => void;
  onOpenMobileSidebar: () => void;
  onSelectRoom?: (roomId: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenMobileSidebar,
  onSelectRoom,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('Administrator');
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([
    {
      id: 'n1',
      title: 'Post-Hours Baseline Overdraw',
      desc: 'Engineering Block B Room 204 drawing 4.8 kW without occupancy.',
      time: '12m ago',
      urgent: true,
    },
    {
      id: 'n2',
      title: 'Scheduled Load Shedding in 45m',
      desc: 'Automated evening load shedding set to trigger for Science Wing.',
      time: '34m ago',
      urgent: false,
    },
    {
      id: 'n3',
      title: 'Exit Checklist Verified',
      desc: 'CR Alex R. submitted Lecture Hall 204 exit protocol with photo.',
      time: '1h ago',
      urgent: false,
    },
  ]);

  const searchRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    'Administrator',
    'Facilities Director',
    'Class Representative (CR)',
    'Sustainability Officer',
  ];

  const searchableNodes = [
    { name: 'Lab 304 • Chemistry Lab', code: 'Science Wing F3', roomId: '304', path: 'campus-map-rooms' as NavPath },
    { name: 'Lecture Hall 101', code: 'Science Wing F1', roomId: '101', path: 'campus-map-rooms' as NavPath },
    { name: 'Lecture Hall 204', code: 'Engineering Block A', roomId: '204', path: 'checklists-reports' as NavPath },
    { name: 'Computer Lab 2', code: 'East Wing F2', roomId: 'complab2', path: 'campus-map-rooms' as NavPath },
    { name: 'Physics Lab 1', code: 'Science Wing F2', roomId: 'physics1', path: 'campus-map-rooms' as NavPath },
    { name: 'Faculty Lounge 2B', code: 'South Wing F2', roomId: 'faculty2b', path: 'campus-map-rooms' as NavPath },
    { name: 'Engineering Block B Anomaly', code: 'HVAC Zone B4', roomId: '304', path: 'analytics-anomalies' as NavPath },
    { name: 'Solar Array B-4 Submeter', code: 'Microgrid Gateway', roomId: 'solar', path: 'overview-dashboard' as NavPath },
  ];

  const filteredNodes = searchQuery.trim()
    ? searchableNodes.filter(
        (n) =>
          n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchableNodes.slice(0, 4);

  const getBreadcrumbName = (path: NavPath) => {
    switch (path) {
      case 'overview-dashboard':
        return 'Campus Energy Overview';
      case 'campus-map-rooms':
        return 'Campus Map & Room Grid';
      case 'checklists-reports':
        return 'Exit Checklists & EcoBot';
      case 'analytics-anomalies':
        return 'Analytics & Anomaly Detection';
      case 'leaderboard':
        return 'Sustainability Leaderboard';
      default:
        return 'Main Campus Telemetry';
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-md lg:px-space-lg border-b border-outline-variant/30">
      {/* Left side: Hamburger, Breadcrumbs & Search */}
      <div className="flex items-center gap-space-sm lg:gap-space-lg">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors lg:hidden"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <span
            onClick={() => onNavigate('overview-dashboard')}
            className="hover:text-primary transition-colors cursor-pointer font-medium"
          >
            EcoTrack
          </span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-label-md text-label-md font-semibold">
            {getBreadcrumbName(currentPath)}
          </span>
        </div>

        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative flex items-center" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant pointer-events-none">
            search
          </span>
          <input
            className="w-48 sm:w-64 lg:w-80 h-9 pl-9 pr-8 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/30 shadow-xs"
            placeholder="Search rooms, sub-meters, sensors..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2 text-on-surface-variant hover:text-on-surface"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-11 left-0 w-80 max-w-[90vw] bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50">
              <div className="px-3 py-1 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                {searchQuery ? 'Matching Telemetry Nodes' : 'Quick Access Nodes'}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredNodes.length > 0 ? (
                  filteredNodes.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onNavigate(item.path);
                        if (onSelectRoom && item.roomId) {
                          onSelectRoom(item.roomId);
                        }
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        onShowToast(`Navigated to ${item.name}`, `Loaded telemetry from ${item.code}`, 'info');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-surface-container-low flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-medium text-sm text-on-surface">{item.name}</div>
                        <div className="text-xs text-on-surface-variant">{item.code}</div>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        arrow_forward
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-xs text-center text-on-surface-variant">
                    No matching sub-meters found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Live badge, Role Switcher, Notifications & Profile */}
      <div className="flex items-center gap-space-xs sm:gap-space-sm lg:gap-space-md">
        {/* Live Data Badge */}
        <div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Live Data • Updated 2m ago
          </span>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center bg-surface-container-lowest px-space-sm py-1.5 rounded-lg shadow-xs border border-outline-variant/30 hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="font-label-sm text-label-sm text-on-surface-variant mr-space-xs hidden sm:inline">
              Role:
            </span>
            <span className="font-label-sm text-label-sm text-primary font-bold mr-space-xs max-w-[90px] sm:max-w-none truncate">
              {currentRole}
            </span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              expand_more
            </span>
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 top-11 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Switch Operational View
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setCurrentRole(r);
                    setIsRoleOpen(false);
                    onShowToast(`Switched active role to ${r}`, 'Permissions updated for current shift.', 'success');
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                    currentRole === r ? 'font-bold text-primary bg-secondary-container/20' : 'text-on-surface'
                  }`}
                >
                  <span>{r}</span>
                  {currentRole === r && (
                    <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-space-md z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">Campus Alerts</span>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-xs font-semibold">
                    {unreadNotifications.length} Active
                  </span>
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      setUnreadNotifications([]);
                      onShowToast('All notifications marked as read');
                    }}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-1 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-on-surface flex items-center gap-1.5">
                          {notif.urgent && <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>}
                          {notif.title}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">{notif.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{notif.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-on-surface-variant">
                    No unread notifications. All campus systems nominal.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Console */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-space-sm pl-space-xs text-left cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold leading-none">
                Admin Console
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">
                Facilities Div.
              </span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-11 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-space-md z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  FC
                </div>
                <div>
                  <div className="font-bold text-sm text-on-surface">Facilities Ops Console</div>
                  <div className="text-xs text-on-surface-variant">facilities-core@campus.edu</div>
                </div>
              </div>
              <div className="py-2 flex flex-col gap-1 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('checklists-reports');
                  }}
                  className="px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-left text-on-surface flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">qr_code_2</span>
                  <span>Station Scanner Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onShowToast('Sensor health audit complete', '99.8% of sub-meters responding correctly.', 'success');
                  }}
                  className="px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-left text-on-surface flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">sensors</span>
                  <span>Check Node Diagnostics</span>
                </button>
              </div>
              <div className="pt-2 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                <span>Campus Core v2.4</span>
                <span className="text-secondary font-semibold">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
