import React, { useState } from 'react';
import { Room } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  X, 
  Lightbulb, 
  Fan, 
  Wind, 
  Tv, 
  PowerOff, 
  Lock, 
  Unlock, 
  FileEdit, 
  Send,
  Zap,
  Building2,
  AlertTriangle
} from 'lucide-react';

interface ApplianceOverrideDrawerProps {
  room: Room | null;
  onClose: () => void;
  onToggleAppliance: (roomId: string, appliance: 'lights' | 'fans' | 'ac' | 'projector') => void;
  onShutOffAll: (roomId: string) => void;
  onAddShiftNote: (technician: string, note: string, roomId?: string) => void;
}

export const ApplianceOverrideDrawer: React.FC<ApplianceOverrideDrawerProps> = ({
  room,
  onClose,
  onToggleAppliance,
  onShutOffAll,
  onAddShiftNote,
}) => {
  if (!room) return null;

  const [techName, setTechName] = useState('Dave K. (Shift Lead)');
  const [noteText, setNoteText] = useState('');
  const [isLocked, setIsLocked] = useState(room.isOverrideLocked || false);

  const isWasting = room.occupancy === 0 && (room.appliances.lights || room.appliances.fans || room.appliances.ac);

  const totalWatts = (
    (room.appliances.lights ? room.wattageRatings.lights : 0) +
    (room.appliances.fans ? room.wattageRatings.fans : 0) +
    (room.appliances.ac ? room.wattageRatings.ac : 0) +
    (room.appliances.projector ? room.wattageRatings.projector : 0) +
    room.wattageRatings.standby
  );

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    onAddShiftNote(techName, noteText, room.id);
    setNoteText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-105 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
              {room.code}
            </span>
            <span className="text-xs text-slate-400">
              {room.building} • {room.floor}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mt-1">
            {room.name}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close Override Drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Live Load & Status Strip */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Status:</span>
          <StatusBadge status={isWasting ? 'wasting' : 'normal'} size="sm" />
        </div>

        <div className="text-right">
          <span className="text-slate-500">Metered Draw:</span>{' '}
          <strong className="font-mono font-bold text-slate-900">
            {(totalWatts / 1000).toFixed(2)} kW
          </strong>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Manual Appliance Controls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Manual Breaker Overrides
            </span>
            <span className="text-[11px] text-slate-400">Smart Gateway #02</span>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'lights' as const, label: 'Ceiling Lighting Array', watts: room.wattageRatings.lights, isOn: room.appliances.lights, icon: <Lightbulb className="w-4 h-4" /> },
              { key: 'fans' as const, label: 'Ceiling & Exhaust Fans', watts: room.wattageRatings.fans, isOn: room.appliances.fans, icon: <Fan className="w-4 h-4" /> },
              { key: 'ac' as const, label: 'HVAC Chiller / Air Conditioner', watts: room.wattageRatings.ac, isOn: room.appliances.ac, icon: <Wind className="w-4 h-4" /> },
              { key: 'projector' as const, label: 'Interactive Projector & AV Screen', watts: room.wattageRatings.projector, isOn: room.appliances.projector, icon: <Tv className="w-4 h-4" /> },
            ].map((app) => (
              <div
                key={app.key}
                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${app.isOn ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {app.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {app.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Rated: {app.watts}W • State: {app.isOn ? 'ENERGIZED' : 'STANDBY'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleAppliance(room.id, app.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    app.isOn
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {app.isOn ? 'Kill Power' : 'Turn On'}
                </button>
              </div>
            ))}
          </div>

          {/* Quick Isolate Button */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onShutOffAll(room.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs transition-colors"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Emergency Isolate All Breakers</span>
            </button>

            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                isLocked
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Lock/unlock breakers"
            >
              {isLocked ? <Lock className="w-4 h-4 text-amber-700" /> : <Unlock className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Log Maintenance Note Form */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileEdit className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Technician Shift Note</span>
            </span>
            <span className="text-[11px] text-slate-400">Append to handover</span>
          </div>

          <form onSubmit={handleSaveNote} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Technician
              </label>
              <input
                type="text"
                value={techName}
                onChange={(e) => setTechName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Observation / Remedial Action Taken
              </label>
              <textarea
                rows={3}
                required
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Inspected thermostat relay; reset scheduled evening setback timer."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Shift Handover Note</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
