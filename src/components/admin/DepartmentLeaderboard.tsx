import React, { useState } from 'react';
import { DepartmentRanking, SystemSettingsConfig } from '../../types';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  Download, 
  Zap, 
  Flame, 
  Calendar,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface DepartmentLeaderboardProps {
  departments: DepartmentRanking[];
  settings: SystemSettingsConfig;
  onToggleChallenge: () => void;
  onExportReport: () => void;
}

export const DepartmentLeaderboard: React.FC<DepartmentLeaderboardProps> = ({
  departments,
  settings,
  onToggleChallenge,
  onExportReport,
}) => {
  const [selectedDept, setSelectedDept] = useState('all');

  const deptNames = ['all', ...Array.from(new Set(departments.map((d) => d.department)))];
  const mostImproved = departments.find((d) => d.isMostImproved) || departments[1];

  const filtered = departments.filter((d) => {
    if (selectedDept !== 'all' && d.department !== selectedDept) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Department Sustainability Leaderboard & Policy Controls</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked cohort compliance and campus-wide energy challenges.
          </p>
        </div>

        {/* Action Buttons: Export & Trigger Challenge */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Trigger Energy Challenge */}
          <button
            onClick={onToggleChallenge}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              settings.activeChallenge.enabled
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{settings.activeChallenge.enabled ? 'Challenge Active (2x Multiplier)' : 'Trigger Energy Challenge'}</span>
          </button>

          {/* Export Monthly Report */}
          <button
            onClick={onExportReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Compliance Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Active Challenge Alert Banner (If Enabled) */}
      {settings.activeChallenge.enabled && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-bold text-amber-950 block text-xs">
                {settings.activeChallenge.title} (Active)
              </span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {settings.activeChallenge.description} Multiplier: {settings.activeChallenge.multiplier}x points.
              </p>
            </div>
          </div>

          <span className="font-mono text-amber-900 font-bold bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200 self-start sm:self-auto">
            Ends in {settings.activeChallenge.endsInDays} days
          </span>
        </div>
      )}

      {/* Highlighted Most Improved Class Spotlight */}
      {mostImproved && (
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 block">
                Spotlight: {mostImproved.className} ({mostImproved.department})
              </span>
              <span className="text-[11px] text-emerald-800">
                Awarded Most Improved Cohort with +{mostImproved.trendPoints} sustainability score increase this cycle.
              </span>
            </div>
          </div>
          <span className="font-bold text-emerald-800 font-mono text-sm bg-white px-2 py-0.5 rounded border border-emerald-200">
            {mostImproved.sustainabilityScore}/100
          </span>
        </div>
      )}

      {/* Ranking Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 w-12 text-center">Rank</th>
              <th className="px-4 py-3">Class Cohort</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3 text-center">Verified Exits</th>
              <th className="px-4 py-3 text-right">Energy Saved</th>
              <th className="px-4 py-3">Sustainability Score</th>
              <th className="px-4 py-3 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item, idx) => {
              const rank = idx + 1;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center">
                    {rank === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black inline-flex items-center justify-center text-[11px]">
                        1
                      </span>
                    ) : rank === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold inline-flex items-center justify-center text-[11px]">
                        2
                      </span>
                    ) : rank === 3 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 font-bold inline-flex items-center justify-center text-[11px] border border-amber-200">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">#{rank}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{item.className}</span>
                      {item.isMostImproved && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Most Improved
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.department}</td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-slate-700">
                    {item.checklistsLogged}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                    {item.energySavedKwh.toFixed(1)} kWh
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 w-6">
                        {item.sustainabilityScore}
                      </span>
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${item.sustainabilityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.trend === 'up' && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                        <TrendingUp className="w-3 h-3" /> +{item.trendPoints}
                      </span>
                    )}
                    {item.trend === 'down' && (
                      <span className="inline-flex items-center gap-0.5 text-rose-500 font-semibold">
                        <TrendingDown className="w-3 h-3" /> {item.trendPoints}
                      </span>
                    )}
                    {item.trend === 'steady' && (
                      <span className="inline-flex items-center text-slate-400">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
