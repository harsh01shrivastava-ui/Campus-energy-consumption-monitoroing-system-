import React from 'react';
import { 
  DollarSign, 
  Leaf, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  IndianRupee,
  Sparkles
} from 'lucide-react';

interface KPIBarProps {
  activeWastageKw: number;
  energySavedKwh: number;
  complianceRate: number;
  currency: 'USD' | 'INR';
  currencyRate: number;
}

export const KPIBar: React.FC<KPIBarProps> = ({
  activeWastageKw,
  energySavedKwh,
  complianceRate,
  currency,
  currencyRate,
}) => {
  // Financial calculation: Active wastage extrapolated to monthly loss if unaddressed
  const hourlyRateUsd = activeWastageKw * 0.18; // $0.18 per kWh
  const estimatedMonthlyWastedUsd = hourlyRateUsd * 24 * 30; // 30-day projection
  const estimatedMonthlyWasted = currency === 'USD' 
    ? `$${Math.round(estimatedMonthlyWastedUsd).toLocaleString()}` 
    : `₹${Math.round(estimatedMonthlyWastedUsd * currencyRate).toLocaleString()}`;

  // Total money saved
  const totalSavedUsd = energySavedKwh * 0.18;
  const totalSavedFormatted = currency === 'USD'
    ? `$${totalSavedUsd.toFixed(2)}`
    : `₹${(totalSavedUsd * currencyRate).toFixed(0)}`;

  // Carbon footprint reduction: ~0.42 kg CO2 per kWh saved
  const carbonReductionKg = energySavedKwh * 0.42;
  const carbonReductionPct = (Math.min(100, (energySavedKwh / 450) * 100)).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* KPI 1: Estimated Money Wasted This Month */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Projected Waste / Month
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            {currency === 'USD' ? <DollarSign className="w-4 h-4" /> : <IndianRupee className="w-4 h-4" />}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono tracking-tight">
            {estimatedMonthlyWasted}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Based on {activeWastageKw.toFixed(2)} kW live overdraw</span>
            <span className="font-semibold text-rose-700">Actionable</span>
          </p>
        </div>
      </div>

      {/* KPI 2: Total kWh Saved via Checklists */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total kWh Conserved
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tracking-tight">
            {energySavedKwh.toFixed(1)} <span className="text-sm font-semibold text-slate-400">kWh</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Grassroots exit protocol returns</span>
            <span className="font-semibold text-emerald-700 font-mono">+{totalSavedFormatted} saved</span>
          </p>
        </div>
      </div>

      {/* KPI 3: Campus Carbon Footprint Reduction (%) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Carbon Reduction
          </span>
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Leaf className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-teal-800 font-mono tracking-tight">
            {carbonReductionPct}% <span className="text-sm font-semibold text-teal-600">offset</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{carbonReductionKg.toFixed(1)} kg CO₂ avoided</span>
            <span className="font-semibold text-teal-700">Scope 2 Grid</span>
          </p>
        </div>
      </div>

      {/* KPI 4: Overall Campus Compliance Rate */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overall Compliance
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {complianceRate.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Target 95%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, complianceRate))}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
