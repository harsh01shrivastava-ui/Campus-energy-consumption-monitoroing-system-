import React, { useState, useEffect } from 'react';
import { Room } from '../../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  QrCode, 
  CheckSquare, 
  Square, 
  Building2, 
  Lightbulb, 
  Fan, 
  Wind, 
  Tv, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Zap,
  PowerOff
} from 'lucide-react';

interface QRChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  targetRoomId: string;
  onSubmitCompliance: (roomId: string, items: {
    lights: boolean;
    fans: boolean;
    ac: boolean;
    projector: boolean;
    doors: boolean;
  }) => void;
}

export const QRChecklistModal: React.FC<QRChecklistModalProps> = ({
  isOpen,
  onClose,
  rooms,
  targetRoomId,
  onSubmitCompliance,
}) => {
  if (!isOpen) return null;

  const activeRoom = rooms.find((r) => r.id === targetRoomId) || rooms[0];

  const [checks, setChecks] = useState({
    lights: true,
    fans: true,
    ac: true,
    projector: true,
    doors: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset checks whenever a new room is scanned
  useEffect(() => {
    setChecks({
      lights: true,
      fans: true,
      ac: true,
      projector: true,
      doors: true,
    });
    setIsSubmitted(false);
  }, [targetRoomId]);

  const toggleCheck = (k: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const total = 5;
  const countChecked = Object.values(checks).filter(Boolean).length;
  const compliancePct = Math.round((countChecked / total) * 100);

  const activeWattsWasted = (
    (activeRoom.appliances.lights ? activeRoom.wattageRatings.lights : 0) +
    (activeRoom.appliances.fans ? activeRoom.wattageRatings.fans : 0) +
    (activeRoom.appliances.ac ? activeRoom.wattageRatings.ac : 0) +
    (activeRoom.appliances.projector ? activeRoom.wattageRatings.projector : 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#059669', '#a7f3d0'],
      });
    } catch {
      // fallback
    }

    onSubmitCompliance(activeRoom.id, checks);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  QR Plaque Verified
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeRoom.code}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeRoom.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close ExitCheck Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Info & Live Status Banner */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600">{activeRoom.building} • {activeRoom.floor}</span>
          </div>

          <div className="text-right">
            {activeWattsWasted > 0 ? (
              <span className="inline-flex items-center gap-1 font-bold text-rose-600 font-mono">
                <Zap className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                {(activeWattsWasted / 1000).toFixed(2)} kW to be saved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Room in Standby
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 bg-emerald-50/40 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900">
                Exit Protocol Successfully Logged!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Room <strong className="text-slate-900">{activeRoom.code}</strong> appliances powered down. Status updated to <strong className="text-emerald-700">Green Normal</strong> across the campus grid.
              </p>
            </div>

            {/* Points Awarded Capsule */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>+15 Class Eco-Points Credited</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Return to Portal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Compliance Progress Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Step 2: Walkthrough Check
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Toggle Off Appliances Upon Leaving
                </h4>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Adherence</span>
                <div className="text-base font-mono font-bold text-emerald-700">
                  {compliancePct}%
                </div>
              </div>
            </div>

            {/* Checklist Checkboxes */}
            <div className="space-y-2.5">
              
              {/* Question 1: Lights */}
              <div
                onClick={() => toggleCheck('lights')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  checks.lights ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${checks.lights ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      All ceiling lights switched OFF
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Zone A & B front and rear arrays ({activeRoom.wattageRatings.lights}W)
                    </span>
                  </div>
                </div>
                {checks.lights ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-slate-300" />}
              </div>

              {/* Question 2: Fans */}
              <div
                onClick={() => toggleCheck('fans')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  checks.fans ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${checks.fans ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    <Fan className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Ceiling fans & ventilation regulators OFF
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Step regulator set to 0 ({activeRoom.wattageRatings.fans}W)
                    </span>
                  </div>
                </div>
                {checks.fans ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-slate-300" />}
              </div>

              {/* Question 3: AC */}
              <div
                onClick={() => toggleCheck('ac')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  checks.ac ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${checks.ac ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Air Conditioning (AC) powered down
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Thermostat off / isolated ({activeRoom.wattageRatings.ac}W)
                    </span>
                  </div>
                </div>
                {checks.ac ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-slate-300" />}
              </div>

              {/* Question 4: Projector */}
              <div
                onClick={() => toggleCheck('projector')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  checks.projector ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${checks.projector ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Interactive smart screen & projector OFF
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Podium master button dark ({activeRoom.wattageRatings.projector}W)
                    </span>
                  </div>
                </div>
                {checks.projector ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-slate-300" />}
              </div>

              {/* Question 5: Doors */}
              <div
                onClick={() => toggleCheck('doors')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  checks.doors ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${checks.doors ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Windows latched & exit door secured
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Prevents thermal air drafts & external energy loss
                    </span>
                  </div>
                </div>
                {checks.doors ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-slate-300" />}
              </div>

            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Turns off checked breakers in room
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Compliance</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
