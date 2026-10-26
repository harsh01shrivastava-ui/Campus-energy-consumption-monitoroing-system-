import React from 'react';
import { 
  ForecastDataPoint, 
  AIInsight, 
  DepartmentRanking, 
  SystemSettingsConfig 
} from '../../types';
import { KPIBar } from './KPIBar';
import { AnomalyCharts } from './AnomalyCharts';
import { DepartmentLeaderboard } from './DepartmentLeaderboard';
import { SystemSettings } from './SystemSettings';
import { ShieldCheck, Download, Sparkles, Sliders } from 'lucide-react';

interface AdminDashboardProps {
  activeWastageKw: number;
  energySavedKwh: number;
  complianceRate: number;
  forecastData: ForecastDataPoint[];
  insights: AIInsight[];
  departments: DepartmentRanking[];
  settings: SystemSettingsConfig;
  onApplyInsight: (id: string) => void;
  onToggleChallenge: () => void;
  onExportReport: () => void;
  onUpdateSettings: (newSettings: Partial<SystemSettingsConfig>) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeWastageKw,
  energySavedKwh,
  complianceRate,
  forecastData,
  insights,
  departments,
  settings,
  onApplyInsight,
  onToggleChallenge,
  onExportReport,
  onUpdateSettings,
  onShowToast,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Executive Policy & Financial Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Campus Energy & Carbon Oversight Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Synthesizing grassroots checklist adherence, submeter telemetry, predictive anomaly forecasts, and institutional sustainability targets.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onExportReport}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Monthly Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary KPI Bar */}
      <KPIBar
        activeWastageKw={activeWastageKw}
        energySavedKwh={energySavedKwh}
        complianceRate={complianceRate}
        currency={settings.currency}
        currencyRate={settings.currencyRate}
      />

      {/* 2. Predictive Anomaly & Wastage Forecast (WasteWatch / EnergyPredict) */}
      <AnomalyCharts
        forecastData={forecastData}
        insights={insights}
        onApplyInsight={onApplyInsight}
      />

      {/* 3. Department Leaderboard & Policy Controls */}
      <DepartmentLeaderboard
        departments={departments}
        settings={settings}
        onToggleChallenge={onToggleChallenge}
        onExportReport={onExportReport}
      />

      {/* 4. System Settings Configuration Panel */}
      <SystemSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onShowToast={onShowToast}
      />

    </div>
  );
};
