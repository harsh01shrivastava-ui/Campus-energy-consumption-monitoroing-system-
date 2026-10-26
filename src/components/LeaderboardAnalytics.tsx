import React, { useState } from 'react';
import { DepartmentCohort, AnomalyItem } from '../types';
import { INITIAL_LEADERBOARD, INITIAL_ANOMALIES } from '../data/mockData';

interface LeaderboardAnalyticsProps {
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  initialTab?: 'leaderboard' | 'analytics';
}

export const LeaderboardAnalytics: React.FC<LeaderboardAnalyticsProps> = ({
  onShowToast,
  initialTab = 'leaderboard',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'semester' | 'month' | '30days'>('semester');
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>(INITIAL_ANOMALIES);
  const [leaderboardData, setLeaderboardData] = useState<DepartmentCohort[]>(INITIAL_LEADERBOARD);
  const [sortBy, setSortBy] = useState<'ecoscore' | 'compliance' | 'kwh' | 'rank'>('ecoscore');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const unresolvedCount = anomalies.filter((a) => !a.isResolved).length;

  const handleResolveAnomaly = (id: string, issue: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: true } : a))
    );
    onShowToast(`Optimized Action Executed: ${issue}`, 'Telemetry baseline stabilized. Alert marked resolved.', 'success');
  };

  const handleExportCsv = () => {
    let csv = 'Rank,Department,Building,ComplianceRate,AvgKwhStudent,EcoScore,Award\n';
    leaderboardData.forEach((row) => {
      csv += `${row.rank},"${row.department}","${row.building}",${row.complianceRate}%,${row.avgKwhStudent} kWh,${row.ecoScore}/100,"${row.award}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecotrack_leaderboard_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('CSV Leaderboard Exported', `Downloaded cohort dataset for ${selectedPeriod}`, 'success');
  };

  const handleSort = (type: 'ecoscore' | 'compliance' | 'kwh' | 'rank') => {
    setSortBy(type);
    const sorted = [...leaderboardData].sort((a, b) => {
      if (type === 'ecoscore') return b.ecoScore - a.ecoScore;
      if (type === 'compliance') return b.complianceRate - a.complianceRate;
      if (type === 'kwh') return a.avgKwhStudent - b.avgKwhStudent;
      return a.rank - b.rank;
    });
    setLeaderboardData(sorted);
    onShowToast(`Sorted by ${type.toUpperCase()}`);
  };

  const filteredCohorts = leaderboardData.filter(
    (c) =>
      c.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.building.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Header & Filter Deck */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                insights
              </span>
            </span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
              Autonomous Surveillance &amp; Benchmarking
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Sustainability Leaderboard &amp; Energy Analytics
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Gamified departmental performance, class compliance scores, and AI anomaly detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Period Selector */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl shadow-xs border border-outline-variant/30" id="period-switch">
            {[
              { id: 'semester', label: 'Semester 2025' },
              { id: 'month', label: 'This Month' },
              { id: '30days', label: 'Past 30 Days' },
            ].map((period) => {
              const isSelected = selectedPeriod === period.id;
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(period.id as any);
                    onShowToast(`Timeline set to ${period.label}`);
                  }}
                  className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {period.label}
                </button>
              );
            })}
          </div>

          {/* Export CSV CTA */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md shadow-xs border border-outline-variant/30 transition-all cursor-pointer active:scale-[0.98] font-semibold"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
            <span>Export Data CSV</span>
          </button>
        </div>
      </section>

      {/* Key Aggregate Performance Ribbon (Data-Dense Glance) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Metric 1: Campus Energy Offset */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Campus Energy Offset
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
          </div>
          <div className="mt-space-sm">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-xl text-metric-xl text-on-surface font-bold">38.4</span>
              <span className="font-label-md text-label-md text-on-surface-variant">MWh</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-secondary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              <span>11.8% vs last baseline cycle</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        {/* Metric 2: Checklist Compliance */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Checklist Compliance
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
          </div>
          <div className="mt-space-sm">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-xl text-metric-xl text-on-surface font-bold">94.2</span>
              <span className="font-label-md text-label-md text-on-surface-variant">%</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>1,420 of 1,508 check-outs signed</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        {/* Metric 3: Live Anomaly Leakage */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Live Anomaly Leakage
            </span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="mt-space-sm">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-xl text-metric-xl text-on-surface font-bold">6.12</span>
              <span className="font-label-md text-label-md text-on-surface-variant">kW</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-error font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">priority_high</span>
              <span>{unresolvedCount} active non-critical deviations</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: '24%' }}></div>
          </div>
        </div>

        {/* Metric 4: Sustainability Grant */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Sustainability Grant
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">workspace_premium</span>
          </div>
          <div className="mt-space-sm">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-xl text-metric-xl text-on-surface font-bold">$12,500</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-secondary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">flag</span>
              <span>Targeting 500 kWh cut by Friday</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </section>

      {/* Anomaly Detection & Post-Hours Spikes Section */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Campus Anomaly Detection &amp; Post-Hours Energy Spikes
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
              {unresolvedCount} Unresolved
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Realtime Neural Telemetry Engine
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Anomaly Card 1: Engineering Block B */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow group border border-outline-variant/30">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide font-semibold">
                  Zone B4 • HVAC
                </span>
                <span className="flex items-center gap-1 text-error font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">electric_meter</span> High Severity
                </span>
              </div>

              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                  Engineering Block B
                </h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Post-Hours Baseline Spike</span>
              </div>

              {/* Micro Graphic */}
              <div className="bg-surface-container-low/60 rounded-lg p-space-sm flex flex-col gap-1 border border-outline-variant/15">
                <div className="flex items-baseline justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Overdraw Index</span>
                  <span className="font-metric-md text-metric-md text-error font-bold">+34%</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Power draw sustained between 22:00 and 04:00
                </span>

                {/* Sparkline SVG */}
                <svg className="w-full h-10 mt-1 text-error" fill="none" stroke="currentColor" viewBox="0 0 240 40">
                  <path
                    d="M0,32 Q30,30 60,33 T120,31 L140,12 L160,8 L190,10 L210,14 L240,12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,32 Q30,30 60,33 T120,31 L140,12 L160,8 L190,10 L210,14 L240,12 L240,40 L0,40 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-space-xs pt-space-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">psychology</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">Root Cause Analysis</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>HVAC scheduler override active in Room 204</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1 px-1">
                  <span>Financial Variance</span>
                  <span className="font-semibold text-error">$142 estimated weekly cost excess</span>
                </div>
              </div>
            </div>

            <div className="pt-space-md mt-space-md border-t border-outline-variant/10">
              <button
                type="button"
                onClick={() => handleResolveAnomaly('eng-b', 'Engineering Block B HVAC Overdraw')}
                disabled={anomalies.find((a) => a.id === 'eng-b')?.isResolved}
                className="w-full py-2.5 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-space-xs shadow-sm transition-all active:scale-[0.98] cursor-pointer font-semibold disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>
                  {anomalies.find((a) => a.id === 'eng-b')?.isResolved
                    ? '✓ Schedule Optimized'
                    : 'Apply Optimized Schedule'}
                </span>
              </button>
            </div>
          </div>

          {/* Anomaly Card 2: Life Sciences Wing */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow group border border-outline-variant/30">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide font-semibold">
                  Wing L2 • Cold Storage
                </span>
                <span className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">sensors</span> Medium Severity
                </span>
              </div>

              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                  Life Sciences Wing
                </h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Phantom Standby Load</span>
              </div>

              {/* Micro Graphic */}
              <div className="bg-surface-container-low/60 rounded-lg p-space-sm flex flex-col gap-1 border border-outline-variant/15">
                <div className="flex items-baseline justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Continuous Off-Peak</span>
                  <span className="font-metric-md text-metric-md text-primary font-bold">4.2 kW</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Baseline continuous standby load on Sundays
                </span>

                {/* Sparkline SVG */}
                <svg className="w-full h-10 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 240 40">
                  <path d="M0,28 L40,29 L80,27 L110,28 L150,26 L190,29 L240,28" strokeLinecap="round" strokeWidth="2" />
                  <path
                    d="M0,28 L40,29 L80,27 L110,28 L150,26 L190,29 L240,28 L240,40 L0,40 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-space-xs pt-space-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">search_check</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">Diagnosis</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  <span>Unpowered equipment banks &amp; refrigerator seal leakage in Specimen Lab</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1 px-1">
                  <span>Sensor Trust Score</span>
                  <span className="font-semibold text-secondary">99.1% Confidence</span>
                </div>
              </div>
            </div>

            <div className="pt-space-md mt-space-md border-t border-outline-variant/10">
              <button
                type="button"
                onClick={() => handleResolveAnomaly('life-sci', 'Life Sciences Audit Dispatch')}
                disabled={anomalies.find((a) => a.id === 'life-sci')?.isResolved}
                className="w-full py-2.5 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer font-semibold disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">assignment_ind</span>
                <span>
                  {anomalies.find((a) => a.id === 'life-sci')?.isResolved
                    ? '✓ Audit Dispatched'
                    : 'Dispatch Audit'}
                </span>
              </button>
            </div>
          </div>

          {/* Anomaly Card 3: Humanities Hall */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow group border border-outline-variant/30">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide font-semibold">
                  Main Floor • AV Deck
                </span>
                <span className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">power_off</span> Quick Fix
                </span>
              </div>

              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                  Humanities Hall
                </h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Vampire Electronics Draw</span>
              </div>

              {/* Micro Graphic */}
              <div className="bg-surface-container-low/60 rounded-lg p-space-sm flex flex-col gap-1 border border-outline-variant/15">
                <div className="flex items-baseline justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Ongoing Idle Burden</span>
                  <span className="font-metric-md text-metric-md text-on-surface font-bold">850 W</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Ongoing monitor &amp; podium standby power
                </span>

                {/* Sparkline SVG */}
                <svg className="w-full h-10 mt-1 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 240 40">
                  <path d="M0,20 L30,22 L70,18 L100,24 L140,20 L180,22 L210,19 L240,21" strokeLinecap="round" strokeWidth="2" />
                  <path
                    d="M0,20 L30,22 L70,18 L100,24 L140,20 L180,22 L210,19 L240,21 L240,40 L0,40 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-space-xs pt-space-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">power</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">Root Cause Analysis</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>Smart strip auto-cutoff disabled</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1 px-1">
                  <span>Potential Yield</span>
                  <span className="font-semibold text-secondary">~612 kWh / academic year</span>
                </div>
              </div>
            </div>

            <div className="pt-space-md mt-space-md border-t border-outline-variant/10">
              <button
                type="button"
                onClick={() => handleResolveAnomaly('humanities', 'Humanities Hall Vampire Cutoff')}
                disabled={anomalies.find((a) => a.id === 'humanities')?.isResolved}
                className="w-full py-2.5 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer font-semibold disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">power_settings_new</span>
                <span>
                  {anomalies.find((a) => a.id === 'humanities')?.isResolved
                    ? '✓ Cutoff Re-enabled'
                    : 'Re-enable Cutoff'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Grant Milestone Banner */}
      <section className="bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary rounded-2xl p-space-lg shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start md:items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px] text-secondary-fixed">solar_power</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-surface-bright">
                  Target Unlocked at 85%
                </span>
                <span className="font-label-sm text-label-sm text-on-primary-container font-medium">
                  Campus Collective Goal
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm font-semibold tracking-tight mt-1 text-on-primary text-white">
                Next Milestone: Reduce overall campus baseline by 500 kWh this Friday to unlock the Solar Student Lounge Grant.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            <div className="flex flex-col items-end">
              <span className="font-metric-md text-metric-md text-on-primary font-bold text-white">
                365 / 500 kWh
              </span>
              <span className="font-label-sm text-label-sm text-on-primary-container font-medium">
                73% Completed
              </span>
            </div>
            <div className="w-24 h-3 bg-white/20 rounded-full overflow-hidden hidden sm:block">
              <div className="bg-secondary-fixed h-full rounded-full transition-all duration-500" style={{ width: '73%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Department & Classroom Sustainability Leaderboard */}
      <section className="flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Inter-Department &amp; Classroom Sustainability Leaderboard
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Real-time aggregate compliance, average per-capita energy load, and ecological ranking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Live Sorting:</span>
            <button
              type="button"
              onClick={() => handleSort('ecoscore')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm shadow-xs transition-colors cursor-pointer ${
                sortBy === 'ecoscore'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-lowest text-primary hover:bg-surface-container'
              }`}
            >
              By EcoScore
            </button>
            <button
              type="button"
              onClick={() => handleSort('compliance')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm shadow-xs transition-colors cursor-pointer ${
                sortBy === 'compliance'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-lowest text-primary hover:bg-surface-container'
              }`}
            >
              By Compliance
            </button>
            <button
              type="button"
              onClick={() => handleSort('kwh')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm shadow-xs transition-colors cursor-pointer ${
                sortBy === 'kwh'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-lowest text-primary hover:bg-surface-container'
              }`}
            >
              By Lowest Avg kWh
            </button>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-surface-container">
                  <th className="py-space-md px-space-lg w-20" scope="col">Rank</th>
                  <th className="py-space-md px-space-md" scope="col">Department / Class Section</th>
                  <th className="py-space-md px-space-md hidden md:table-cell" scope="col">Building</th>
                  <th className="py-space-md px-space-md" scope="col">Checklist Compliance</th>
                  <th className="py-space-md px-space-md" scope="col">Avg kWh / Student</th>
                  <th className="py-space-md px-space-md" scope="col">EcoScore</th>
                  <th className="py-space-md px-space-lg" scope="col">Awards &amp; Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface font-body-md text-body-md">
                {filteredCohorts.map((cohort) => {
                  return (
                    <tr key={cohort.rank} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Rank Column */}
                      <td className="py-space-lg px-space-lg">
                        {cohort.rank === 1 ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF3C7] text-[#92400E] font-headline-sm text-headline-sm shadow-xs font-bold">
                            1
                          </div>
                        ) : cohort.rank === 2 ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#475569] font-headline-sm text-headline-sm shadow-xs font-bold">
                            2
                          </div>
                        ) : cohort.rank === 3 ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFEDD5] text-[#9A3412] font-headline-sm text-headline-sm shadow-xs font-bold">
                            3
                          </div>
                        ) : (
                          <span className="font-headline-sm text-headline-sm text-on-surface-variant font-bold pl-2">
                            {cohort.rank}
                          </span>
                        )}
                      </td>

                      {/* Department / Class Section */}
                      <td className="py-space-lg px-space-md">
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {cohort.department}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {cohort.section}
                          </span>
                        </div>
                      </td>

                      {/* Building */}
                      <td className="py-space-lg px-space-md hidden md:table-cell">
                        <span className="px-2.5 py-1 rounded-md bg-surface-container font-label-md text-label-md text-on-surface-variant font-semibold">
                          {cohort.building}
                        </span>
                      </td>

                      {/* Compliance */}
                      <td className="py-space-lg px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <span className="font-metric-md text-metric-md text-on-surface font-bold">
                            {cohort.complianceRate.toFixed(1)}%
                          </span>
                          <div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                cohort.complianceRate >= 95
                                  ? 'bg-primary'
                                  : cohort.complianceRate >= 90
                                  ? 'bg-primary-container'
                                  : 'bg-outline'
                              }`}
                              style={{ width: `${cohort.complianceRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Avg kWh / Student */}
                      <td className="py-space-lg px-space-md">
                        <div className="flex items-baseline gap-1">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {cohort.avgKwhStudent.toFixed(1)}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">kWh</span>
                        </div>
                      </td>

                      {/* EcoScore */}
                      <td className="py-space-lg px-space-md">
                        <div className="flex items-center gap-space-xs">
                          <span
                            className={`font-metric-md text-metric-md font-bold ${
                              cohort.ecoScore >= 90 ? 'text-primary' : 'text-on-surface'
                            }`}
                          >
                            {cohort.ecoScore}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">/ 100</span>
                        </div>
                      </td>

                      {/* Awards & Trend */}
                      <td className="py-space-lg px-space-lg">
                        {cohort.awardType === 'gold' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
                            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              eco
                            </span>
                            <span>{cohort.award}</span>
                          </span>
                        ) : cohort.awardType === 'silver' ? (
                          <div className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-bold">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span>{cohort.award}</span>
                          </div>
                        ) : cohort.awardType === 'bronze' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/70 text-on-secondary-container font-label-md text-label-md font-bold">
                            <span>🌿</span>
                            <span>{cohort.award}</span>
                          </span>
                        ) : cohort.awardType === 'warning' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-semibold">
                            <span className="material-symbols-outlined text-[15px]">notification_important</span>
                            <span>{cohort.award}</span>
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-on-surface-variant font-label-md text-label-md font-medium">
                            <span className="material-symbols-outlined text-[16px]">horizontal_rule</span>
                            <span>{cohort.award}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination / Footer Meta */}
          <div className="bg-surface-container-low px-space-lg py-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Showing 5 of 32 monitored university cohorts
            </span>
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-xs transition-all disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2 font-label-sm text-label-sm font-bold text-primary">1</span>
              <button
                type="button"
                onClick={() => {
                  onShowToast('Next Page', 'Loaded university cohorts 6 - 10.', 'info');
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-xs transition-all cursor-pointer font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
