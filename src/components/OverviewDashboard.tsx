import React, { useState } from 'react';
import { NavPath } from './Sidebar';

interface OverviewDashboardProps {
  onNavigate: (path: NavPath) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onSelectRoom: (roomId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onShowToast,
  onSelectRoom,
}) => {
  const [selectedRange, setSelectedRange] = useState<'today' | 'week' | 'month' | 'term'>('today');
  const [chartMetric, setChartMetric] = useState<'kwh' | 'cost'>('kwh');
  const [urgentAnomalies, setUrgentAnomalies] = useState([
    {
      id: 'lab-304',
      name: 'Lab 304 - Chemistry',
      location: 'Engineering Block B',
      badge: '2h 15m active',
      badgeType: 'error',
      desc: 'After-hours overhead lighting and 2 multi-split AC units running at 19°C without scheduled classes or verified occupancy.',
      roomId: '304',
    },
    {
      id: 'lh-12',
      name: 'Lecture Hall 12',
      location: 'Humanities Central',
      badge: 'Standby Leak',
      badgeType: 'standby',
      desc: 'Main high-lumen 4K projector left in active standby mode drawing 450W continuously. Flagged by EcoBot telemetry at 18:20.',
      roomId: '101',
    },
  ]);
  const [activeTipApplied, setActiveTipApplied] = useState(false);
  const [activeDayHover, setActiveDayHover] = useState<string | null>(null);

  const handleRemoteCut = (id: string, name: string) => {
    setUrgentAnomalies((prev) => prev.filter((a) => a.id !== id));
    onShowToast(`Remote Cut Power Executed: ${name}`, 'Switched breaker to safety standby mode. 4.8 kW eliminated.', 'success');
  };

  const handleNotifyCR = (name: string) => {
    onShowToast(`Dispatched Nudge to Class Rep`, `Sent mobile alert for ${name} to verify room closure.`, 'info');
  };

  const handleApplyTip = () => {
    setActiveTipApplied(true);
    onShowToast('Thermostat Delta (+1°C) Applied Campuswide', 'Setpoints updated across 14 campus zones. Est. 6% cooling savings active.', 'success');
  };

  const handleExport = () => {
    const csvContent =
      'Date,Zone,Actual kW,Baseline kW,Status\n' +
      '2026-10-19,Campus Cluster A,135,180,Optimal\n' +
      '2026-10-20,Campus Cluster A,116,195,Optimal\n' +
      '2026-10-21,Campus Cluster A,85,190,Optimal\n' +
      '2026-10-22,Campus Cluster A,224.2,210,Peak Demand\n' +
      '2026-10-23,Campus Cluster A,110,185,Optimal\n' +
      '2026-10-24,Campus Cluster A,185,130,Weekend Standby\n' +
      '2026-10-25,Campus Cluster A,218,120,Overdraw Alert\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecotrack_campus_energy_${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Export Report Generated', `Downloaded CSV telemetry dataset for ${selectedRange.toUpperCase()}`, 'success');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header Section with Typographic Hierarchy & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
              Institutional Telemetry
            </span>
            <span className="text-outline-variant font-label-sm text-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Zone Cluster A &amp; B</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Campus Energy Overview
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Live building-level telemetry &amp; real-time efficiency metrics across 14 campus zones.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          {/* Range Filter */}
          <div className="inline-flex p-1 bg-surface-container rounded-lg shadow-sm" id="date-range-filter">
            {(['today', 'week', 'month', 'term'] as const).map((range) => {
              const labels = {
                today: 'Today',
                week: 'This Week',
                month: 'This Month',
                term: 'Academic Term',
              };
              const isSelected = selectedRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setSelectedRange(range);
                    onShowToast(`Filtered by ${labels[range]}`, 'Updated key aggregate telemetry figures.', 'info');
                  }}
                  className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all ${
                    isSelected
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {labels[range]}
                </button>
              );
            })}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Card 1: Wastage Alerts */}
        <div
          onClick={() => onNavigate('campus-map-rooms')}
          className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md cursor-pointer border border-outline-variant/30 group"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Active Wastage Alerts
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
              High Priority
            </span>
          </div>

          <div className="my-space-md flex flex-col">
            <span className="font-metric-xl text-metric-xl text-on-surface tracking-tight font-bold group-hover:text-primary transition-colors">
              {urgentAnomalies.length} Areas
            </span>
            <span className="font-body-sm text-body-sm text-error mt-space-xs flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Unoccupied labs HVAC active
            </span>
          </div>

          <div className="pt-space-xs bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg pb-space-sm border-t border-outline-variant/10">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Engineering Block B • Floor 2 &amp; 3
            </span>
          </div>
        </div>

        {/* Card 2: Compliance Rate */}
        <div
          onClick={() => onNavigate('leaderboard')}
          className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md cursor-pointer border border-outline-variant/30 group"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Today&apos;s Compliance
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Exceeding Target
            </span>
          </div>

          <div className="my-space-md flex flex-col">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-xl text-metric-xl text-on-surface tracking-tight font-bold group-hover:text-primary transition-colors">
                94.2%
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold inline-flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +3.8%
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-sm overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: '94.2%' }}></div>
            </div>
          </div>

          <div className="pt-space-xs bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg pb-space-sm border-t border-outline-variant/10">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Target threshold: 90% strict floor compliance
            </span>
          </div>
        </div>

        {/* Card 3: Energy Saved */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Total Energy Saved
            </span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">energy_savings_leaf</span>
            </div>
          </div>

          <div className="my-space-md flex flex-col">
            <span className="font-metric-xl text-metric-xl text-on-surface tracking-tight font-bold">
              1,420 <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">kWh</span>
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              Est. $485 saved this week
            </span>
          </div>

          <div className="pt-space-xs bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg pb-space-sm flex items-center gap-1 border-t border-outline-variant/10">
            <span className="material-symbols-outlined text-secondary text-[16px]">co2</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              980 kg CO₂ avoided institutional footprint
            </span>
          </div>
        </div>

        {/* Card 4: Current Load */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Current Campus Load
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-primary font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Live Feed
            </span>
          </div>

          <div className="my-space-md flex flex-col">
            <span className="font-metric-xl text-metric-xl text-on-surface tracking-tight font-bold">
              184.6 <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">kW</span>
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              Normal band: 170 – 220 kW
            </span>
          </div>

          <div className="pt-space-xs bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg pb-space-sm flex items-center justify-between border-t border-outline-variant/10">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Peak recorded today</span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">208.4 kW (14:15)</span>
          </div>
        </div>
      </div>

      {/* Main Grid (65% / 35% -> 8 cols / 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Weekly Trends Chart Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                    Telemetry Analytics
                  </span>
                  <span className="text-outline-variant font-label-sm text-label-sm">•</span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">Variance -8.4%</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Weekly Energy Consumption Trends
                </h2>
              </div>

              <div className="flex items-center gap-space-md">
                {/* Metric Toggle */}
                <div className="inline-flex p-0.5 bg-surface-container rounded-lg">
                  <button
                    type="button"
                    onClick={() => setChartMetric('kwh')}
                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm transition-all ${
                      chartMetric === 'kwh'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    kWh
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('cost')}
                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm transition-all ${
                      chartMetric === 'cost'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Cost ($)
                  </button>
                </div>

                {/* Chart Legend */}
                <div className="hidden md:flex items-center gap-space-sm text-body-sm">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                    <span className="w-3 h-1 rounded-full bg-primary"></span>
                    <span>Actual</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="w-3 h-0.5 border-t border-dashed border-outline-variant"></span>
                    <span>Baseline</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Line Chart Visual */}
            <div className="relative w-full h-72 pt-space-sm select-none">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 240">
                <defs>
                  <linearGradient id="primaryGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0f5238" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0f5238" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                <line stroke="#dee8ff" strokeWidth="1" x1="40" x2="740" y1="20" y2="20" />
                <text fill="#707973" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="24">
                  {chartMetric === 'kwh' ? '250 kW' : '$350'}
                </text>
                <line stroke="#dee8ff" strokeWidth="1" x1="40" x2="740" y1="75" y2="75" />
                <text fill="#707973" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="79">
                  {chartMetric === 'kwh' ? '200 kW' : '$280'}
                </text>
                <line stroke="#dee8ff" strokeWidth="1" x1="40" x2="740" y1="130" y2="130" />
                <text fill="#707973" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="134">
                  {chartMetric === 'kwh' ? '150 kW' : '$210'}
                </text>
                <line stroke="#dee8ff" strokeWidth="1" x1="40" x2="740" y1="185" y2="185" />
                <text fill="#707973" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="189">
                  {chartMetric === 'kwh' ? '100 kW' : '$140'}
                </text>

                {/* Baseline Reference Path (Dashed Slate) */}
                <path
                  d="M 60,110 C 130,95 190,98 270,102 C 340,105 400,72 470,72 C 540,72 580,100 620,155 C 660,200 700,205 720,205"
                  fill="none"
                  opacity="0.65"
                  stroke="#707973"
                  strokeDasharray="5 5"
                  strokeWidth="1.8"
                />

                {/* Area fill for actual */}
                <path
                  d="M 60,135 C 130,120 180,110 260,85 C 330,62 390,45 470,45 C 530,45 590,92 630,172 C 670,220 700,215 720,218 L 720,225 L 60,225 Z"
                  fill="url(#primaryGradient)"
                />

                {/* Actual Consumption Path (Deep Forest Green) */}
                <path
                  d="M 60,135 C 130,120 180,110 260,85 C 330,62 390,45 470,45 C 530,45 590,92 630,172 C 670,220 700,215 720,218"
                  fill="none"
                  stroke="#0f5238"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                {/* Interactive Points */}
                {[
                  { cx: 60, cy: 135, day: 'Mon', val: '135 kW' },
                  { cx: 170, cy: 116, day: 'Tue', val: '148 kW' },
                  { cx: 270, cy: 85, day: 'Wed', val: '182 kW' },
                  { cx: 370, cy: 58, day: 'Thu', val: '210 kW' },
                  { cx: 470, cy: 45, day: 'Thu Peak', val: '224.2 kW', isPeak: true },
                  { cx: 580, cy: 110, day: 'Fri', val: '154 kW' },
                  { cx: 650, cy: 185, day: 'Sat', val: '95 kW' },
                  { cx: 720, cy: 218, day: 'Sun', val: '72 kW' },
                ].map((pt) => (
                  <g key={pt.day}>
                    <circle
                      cx={pt.cx}
                      cy={pt.cy}
                      fill={pt.isPeak ? '#0f5238' : '#ffffff'}
                      r={pt.isPeak ? 6 : 3.5}
                      stroke="#0f5238"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-transform hover:scale-150"
                      onMouseEnter={() => setActiveDayHover(`${pt.day}: ${pt.val}`)}
                      onMouseLeave={() => setActiveDayHover(null)}
                    />
                    {pt.isPeak && (
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        fill="#0f5238"
                        opacity="0.2"
                        r="12"
                        className="animate-ping pointer-events-none"
                      />
                    )}
                  </g>
                ))}

                {/* Thursday Peak Highlight Reference Line */}
                <line opacity="0.4" stroke="#0f5238" strokeDasharray="3 3" strokeWidth="1.2" x1="470" x2="470" y1="45" y2="210" />

                {/* X Axis Labels */}
                <text fill="#404943" fontFamily="Plus Jakarta Sans" fontSize="11" textAnchor="middle" x="60" y="235">Mon</text>
                <text fill="#404943" fontFamily="Plus Jakarta Sans" fontSize="11" textAnchor="middle" x="170" y="235">Tue</text>
                <text fill="#404943" fontFamily="Plus Jakarta Sans" fontSize="11" textAnchor="middle" x="270" y="235">Wed</text>
                <text fill="#404943" fontFamily="Plus Jakarta Sans" fontSize="11" textAnchor="middle" x="370" y="235">Thu</text>
                <text fill="#0f5238" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="470" y="235">Thu Peak</text>
                <text fill="#404943" fontFamily="Plus Jakarta Sans" fontSize="11" textAnchor="middle" x="580" y="235">Fri</text>
                <text fill="#404943" fontFamily="Plus Jakarta Sans" fontSize="11" textAnchor="middle" x="650" y="235">Sat</text>
                <text fill="#404943" fontFamily="Plus Jakarta Sans" fontSize="11" textAnchor="middle" x="720" y="235">Sun</text>
              </svg>

              {/* Interactive Tooltip Overlay (Anchored to Thursday Peak) */}
              <div className="absolute left-1/2 md:left-[59%] top-2 -translate-x-1/2 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-lg shadow-md border border-outline-variant/30 pointer-events-none transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Thursday High Demand
                  </span>
                </div>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {chartMetric === 'kwh' ? '224.2 kW' : '$314.80'}
                  </span>
                  <span className="font-label-sm text-label-sm text-error font-medium">
                    (+14.2 kW vs base)
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  Heavy load: Chiller Plant 2 online
                </div>
              </div>

              {activeDayHover && (
                <div className="absolute top-12 left-4 bg-inverse-surface text-inverse-on-surface text-xs px-2.5 py-1 rounded-md shadow-lg pointer-events-none animate-in fade-in duration-150">
                  {activeDayHover}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg py-space-sm rounded-b-xl border-t border-outline-variant/10">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                <span>Night setback controls reduced weekend load by 38% compared to prior month.</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('campus-map-rooms')}
                className="font-label-sm text-label-sm text-primary font-semibold mt-1 sm:mt-0 cursor-pointer hover:underline"
              >
                View Load Disaggregation →
              </button>
            </div>
          </div>

          {/* Live Building Energy Distribution Horizontal Mini Bars */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                  Real-Time Submetering
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Live Building Energy Distribution
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                184.6 kW campus total
              </span>
            </div>

            <div className="flex flex-col gap-space-md">
              {/* Engineering Wing (Alert State) */}
              <div
                className="flex flex-col gap-1 cursor-pointer group"
                onClick={() => {
                  onNavigate('campus-map-rooms');
                  onSelectRoom('304');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-body-md text-body-md text-on-surface font-medium group-hover:text-primary transition-colors">
                      Engineering Wing
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                      High Anomaly
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-label-md text-label-md text-error font-bold">68.0 kW</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">(36.8%)</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: '36.8%' }}></div>
                </div>
              </div>

              {/* Science Complex */}
              <div
                className="flex flex-col gap-1 cursor-pointer group"
                onClick={() => {
                  onNavigate('campus-map-rooms');
                  onSelectRoom('101');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-body-md text-body-md text-on-surface font-medium group-hover:text-primary transition-colors">
                      Science Complex
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Labs &amp; Cleanrooms</span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">42.0 kW</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">(22.7%)</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: '22.7%' }}></div>
                </div>
              </div>

              {/* Student Center */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-body-md text-body-md text-on-surface font-medium">Student Center</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Dining &amp; Recreation</span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">31.0 kW</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">(16.8%)</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '16.8%' }}></div>
                </div>
              </div>

              {/* Humanities Hall */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-body-md text-body-md text-on-surface font-medium">Humanities Hall</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Lecture Rooms</span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">24.0 kW</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">(13.0%)</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '13.0%' }}></div>
                </div>
              </div>

              {/* Campus Library */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-body-md text-body-md text-on-surface font-medium">Main University Library</span>
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary">
                      <span className="material-symbols-outlined text-[14px]">eco</span> Optimized
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">19.6 kW</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">(10.7%)</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-secondary-fixed-dim h-full rounded-full transition-all duration-500" style={{ width: '10.7%' }}></div>
                </div>
              </div>
            </div>

            {/* Campus Substation Imagery / Spatial Context */}
            <div className="relative w-full h-36 rounded-lg overflow-hidden mt-space-xs border border-outline-variant/30">
              <img
                className="w-full h-full object-cover"
                alt="University green campus solar canopy and smart energy monitoring sub-station pavilion"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQg1AGLmv5pCvS4YmRlcBGdYgb2AEQmIHHHOfUsop9uuThLLGEm-W6UunccLhPpWIKz-dYjKN5N7fe8_NkEGfo066APjD7sqHhYLa8B699OHqKBE1R642PNitk7UcrnPCOtdL6_P4qYcTaRQx479nQS3mnJXCaIJ9UPRizATjUv5L-cRkOVZFU9hyPNY4PXVVKhQuKEEfSAd7EstrEnOm9uRnXy940p2QJuq_m6Un_pyHT7NVEfgkJ6w"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/85 via-inverse-surface/50 to-transparent flex items-center p-space-md">
                <div className="flex flex-col text-on-primary max-w-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container font-semibold">
                    Microgrid Status
                  </span>
                  <span className="font-headline-sm text-headline-sm font-bold text-white mt-0.5">
                    Rooftop Solar Array B-4 Active
                  </span>
                  <span className="font-body-sm text-body-sm opacity-90 mt-1">
                    Offsetting 38.4 kW directly to science lab loads.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Urgent Energy Anomaly Alerts */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Urgent Anomalies
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-semibold">
                {urgentAnomalies.length} Pending
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {urgentAnomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs transition-all hover:bg-surface-container border border-outline-variant/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md font-bold text-on-surface">
                        {anomaly.name}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {anomaly.location}
                      </span>
                    </div>
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold ${
                        anomaly.badgeType === 'error'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {anomaly.badge}
                    </span>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {anomaly.desc}
                  </p>

                  <div className="flex items-center gap-space-xs mt-space-xs pt-space-xs">
                    <button
                      type="button"
                      onClick={() => handleRemoteCut(anomaly.id, anomaly.name)}
                      className="flex-1 py-1.5 px-space-xs bg-primary text-on-primary rounded font-label-sm text-label-sm hover:bg-primary-container transition-colors text-center font-medium shadow-xs"
                    >
                      Remote Cut Power
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNotifyCR(anomaly.name)}
                      className="py-1.5 px-space-sm bg-surface-container-lowest text-on-surface-variant rounded font-label-sm text-label-sm hover:text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30 font-medium"
                    >
                      Notify CR
                    </button>
                  </div>
                </div>
              ))}

              {urgentAnomalies.length === 0 && (
                <div className="p-4 text-center text-xs text-secondary bg-secondary-container/20 rounded-lg font-medium">
                  ✓ All urgent deviations cleared. Telemetry within safe operating envelope.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & EcoBot Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Facilities Quick Actions
              </h3>
            </div>

            <div className="flex flex-col gap-space-xs">
              {/* Button 1: Walkthrough Checklist */}
              <button
                type="button"
                onClick={() => onNavigate('checklists-reports')}
                className="w-full flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors group text-left cursor-pointer border border-outline-variant/20"
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      Exit Walkthrough Checklist
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Evening shutdown sequence for guards
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>

              {/* Button 2: Report Energy Leak */}
              <button
                type="button"
                onClick={() => onNavigate('checklists-reports')}
                className="w-full flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors group text-left cursor-pointer border border-outline-variant/20"
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-md bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      Report Energy Leak
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Send photo or room code to EcoBot
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                  arrow_outward
                </span>
              </button>
            </div>

            {/* Ambient EcoBot Status snippet */}
            <div className="p-space-sm bg-surface-container-low/60 rounded-lg flex items-center gap-space-sm border border-outline-variant/15">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                EcoBot Scanner: Running sweep across 240 circuit nodes
              </span>
            </div>
          </div>

          {/* Daily Sustainability Tip */}
          <div className="bg-primary text-on-primary p-space-lg rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between">
            {/* Botanical decorative watermark background SVG */}
            <svg
              className="absolute -right-6 -bottom-6 w-36 h-36 text-primary-container opacity-30 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>

            <div className="relative z-10 flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-secondary-container">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Daily Facility Tip
                </span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold tracking-tight text-white mt-1">
                Thermostat Delta Optimization
              </h4>
              <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
                Adjusting classroom HVAC setpoints by +1°C during summer terms yields an estimated 6% reduction in
                central chiller cooling demand without compromising thermal comfort standards.
              </p>
            </div>

            <div className="relative z-10 pt-space-md flex items-center justify-between mt-2">
              <span className="font-label-sm text-label-sm text-secondary-container font-semibold">
                Ashrae 55-2023 Compliant
              </span>
              <button
                type="button"
                onClick={handleApplyTip}
                disabled={activeTipApplied}
                className="px-space-sm py-1.5 bg-surface-container-lowest text-primary rounded-lg font-label-sm text-label-sm font-bold hover:bg-surface-variant transition-colors shadow-xs cursor-pointer disabled:opacity-75"
              >
                {activeTipApplied ? '✓ Applied' : 'Apply Campuswide'}
              </button>
            </div>
          </div>

          {/* Campus Environmental Card with Photo Context */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/30">
            <div className="relative h-28 w-full">
              <img
                className="w-full h-full object-cover"
                alt="Sustainable architecture exterior of university campus with rooftop solar panels"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZGzDflNjIsOl6Tpcb9qRh8d77sCQR10zDIP7azo78Jy_cx-5ykgRo2bigrq_ZUx4OU0Sk67coZX9GpPSWXsUKCaM2Zn6hUtJ_ipaQH3lARa4Z8b2ZEq_uYvNA8h3sgZw6yEoQ7bnvVal6bzwVlRulrt2KXVejMuGGZoeaOol2QoIHVtyVKqo7NdlfUFw8I8b3UxAy_i-V9UE5L8w72TZzguGhLPhOfY3yYayhu5o7rC1HVKZbdeOG2g"
              />
              <div className="absolute top-2 left-2 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded text-primary font-label-sm text-label-sm font-semibold shadow-xs">
                LEED Platinum Certified
              </div>
            </div>
            <div className="p-space-md flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">
                  Campus Carbon Target
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Net Zero Milestone 2030
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                78%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
