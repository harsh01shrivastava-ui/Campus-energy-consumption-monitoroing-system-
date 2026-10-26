import React, { useState } from 'react';
import { ForecastDataPoint, AIInsight } from '../../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Lightbulb, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface AnomalyChartsProps {
  forecastData: ForecastDataPoint[];
  insights: AIInsight[];
  onApplyInsight: (id: string) => void;
}

export const AnomalyCharts: React.FC<AnomalyChartsProps> = ({
  forecastData,
  insights,
  onApplyInsight,
}) => {
  const [viewType, setViewType] = useState<'area' | 'bar'>('area');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Forecast Header & Chart Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              WasteWatch • EnergyPredict
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Predictive Anomaly & Wastage Forecast
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Surfacing unmonitored energy spikes during weekends, holidays, and post-lecture hours.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewType('area')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewType === 'area' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Area Trend
          </button>
          <button
            onClick={() => setViewType('bar')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewType === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Variance Bars
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'area' ? (
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="spikeColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="dayOrHour" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" kWh" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="actualKwh" name="Actual Campus Load" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#actualColor)" />
              <Area type="monotone" dataKey="baselineKwh" name="Optimized Baseline Target" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fill="none" />
              <Area type="monotone" dataKey="unoccupiedSpikeKwh" name="Unoccupied Overdraw Anomaly" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#spikeColor)" />
            </AreaChart>
          ) : (
            <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="dayOrHour" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" kWh" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="baselineKwh" name="Expected Baseline (kWh)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actualKwh" name="Actual Consumption (kWh)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="unoccupiedSpikeKwh" name="Identified Wastage Spike (kWh)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* AI INSIGHT BANNERS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Energy Intelligence & Actionable Policy Insights</span>
          </span>
          <span className="text-[11px] text-slate-400">Algorithmic Correlation Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {insights.map((insight) => {
            const isHigh = insight.severity === 'high';
            const isMedium = insight.severity === 'medium';

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  insight.isApplied
                    ? 'bg-slate-50 border-slate-200/80 opacity-80'
                    : isHigh
                    ? 'bg-rose-50/40 border-rose-200'
                    : isMedium
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-emerald-50/40 border-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200/80 text-slate-700">
                      {insight.zone}
                    </span>
                    {insight.isApplied ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Applied
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {insight.severity.toUpperCase()} Priority
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-1">
                    {insight.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {insight.description}
                  </p>

                  <div className="mt-2.5 p-2 rounded-lg bg-white/80 border border-slate-200/80 text-[11px] text-slate-700">
                    <strong className="text-slate-900 block font-semibold">Recommendation:</strong>
                    {insight.recommendation}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-emerald-700">
                    Save: {insight.potentialMonthlySaving}
                  </span>

                  {!insight.isApplied && (
                    <button
                      onClick={() => onApplyInsight(insight.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Apply Policy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
