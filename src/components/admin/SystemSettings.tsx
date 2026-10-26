import React, { useState } from 'react';
import { SystemSettingsConfig } from '../../types';
import { 
  Settings, 
  Clock, 
  ShieldCheck, 
  Sliders, 
  DollarSign, 
  IndianRupee, 
  CheckCircle2, 
  Save, 
  BellRing
} from 'lucide-react';

interface SystemSettingsProps {
  settings: SystemSettingsConfig;
  onUpdateSettings: (newSettings: Partial<SystemSettingsConfig>) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onUpdateSettings,
  onShowToast,
}) => {
  const [autoCutoff, setAutoCutoff] = useState(settings.autoCutoffEnabled);
  const [cutoffTime, setCutoffTime] = useState(settings.autoCutoffTime);
  const [reminderMinutes, setReminderMinutes] = useState(settings.reminderMinutesBeforeExit);
  const [targetCompliance, setTargetCompliance] = useState(settings.targetCompliance);
  const [currency, setCurrency] = useState<'USD' | 'INR'>(settings.currency);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      autoCutoffEnabled: autoCutoff,
      autoCutoffTime: cutoffTime,
      reminderMinutesBeforeExit: reminderMinutes,
      targetCompliance,
      currency,
    });
    onShowToast('System Settings Saved', 'Campus telemetry threshold & reminder rules updated.', 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Campus Telemetry & Policy Configuration</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage automatic cut-offs, reminder schedules, and administrative targets.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Automated Evening Cutoff */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Automated Post-Hours Cutoff</span>
              </span>
              <input
                type="checkbox"
                checked={autoCutoff}
                onChange={(e) => setAutoCutoff(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Isolates secondary breaker circuits in empty rooms after class timetable.
            </p>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Trigger Threshold Time
              </label>
              <input
                type="time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Student Reminder Timings */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-amber-600" />
              <span>Exit Reminder Notification</span>
            </span>
            <p className="text-[11px] text-slate-500">
              Dispatches push reminder to Class Representative before lecture period expires.
            </p>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Notice Lead Time: <strong className="text-slate-900">{reminderMinutes} minutes before end</strong>
              </label>
              <input
                type="range"
                min={5}
                max={20}
                step={5}
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Target Compliance Slider */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Institutional Target Compliance</span>
            </span>
            <p className="text-[11px] text-slate-500">
              Campus KPI benchmark for green certification and department awards.
            </p>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Goal Benchmark: <strong className="text-emerald-700">{targetCompliance}%</strong>
              </label>
              <input
                type="range"
                min={75}
                max={100}
                value={targetCompliance}
                onChange={(e) => setTargetCompliance(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Currency Display Preference */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-600" />
              <span>Reporting Currency Preference</span>
            </span>
            <p className="text-[11px] text-slate-500">
              Toggle monetary display across executive KPI cards and reports.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  currency === 'USD' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  currency === 'INR' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save System Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
