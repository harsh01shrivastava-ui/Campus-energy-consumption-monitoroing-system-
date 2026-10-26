import React, { useState } from 'react';
import { ShiftNote } from '../../types';
import { 
  ClipboardList, 
  Plus, 
  Send, 
  Clock, 
  UserCheck, 
  Sun, 
  Sunset, 
  Moon, 
  ShieldCheck 
} from 'lucide-react';

interface ShiftNotesProps {
  notes: ShiftNote[];
  onAddNote: (technician: string, note: string, shift: 'Morning' | 'Evening' | 'Night') => void;
}

export const ShiftNotes: React.FC<ShiftNotesProps> = ({ notes, onAddNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [techName, setTechName] = useState('Dave K. (Shift Lead)');
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Night'>('Evening');
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    onAddNote(techName, noteContent, shift);
    setNoteContent('');
    setIsAdding(false);
  };

  const getShiftIcon = (s: string) => {
    switch (s) {
      case 'Morning': return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Evening': return <Sunset className="w-3.5 h-3.5 text-orange-500" />;
      case 'Night': return <Moon className="w-3.5 h-3.5 text-indigo-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">
              Running Shift Handover Log
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-shift communications and field maintenance observations.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : 'New Handover Entry'}</span>
        </button>
      </div>

      {/* Add Entry Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Technician Name
              </label>
              <input
                type="text"
                required
                value={techName}
                onChange={(e) => setTechName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Shift Period
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 font-medium"
              >
                <option value="Morning">Morning (06:00 - 14:00)</option>
                <option value="Evening">Evening (14:00 - 22:00)</option>
                <option value="Night">Night (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Handover Note / Critical Status Summary
            </label>
            <textarea
              rows={2}
              required
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="e.g. Science Complex chillers checked. Auditorium Hall 2 breakers isolated."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Post Handover Log
            </button>
          </div>
        </form>
      )}

      {/* List of Notes */}
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-2xs transition-all flex items-start gap-3 text-xs"
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
              {getShiftIcon(note.shift)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{note.technician}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {note.shift} Shift
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {note.timestamp}
                </span>
              </div>

              <p className="text-slate-700 mt-1 leading-relaxed">
                {note.note}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
