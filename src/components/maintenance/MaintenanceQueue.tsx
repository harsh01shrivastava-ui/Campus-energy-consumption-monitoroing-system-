import React, { useState } from 'react';
import { MaintenanceTicket } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  PowerOff, 
  ShieldAlert, 
  Search,
  Filter,
  Flame,
  Zap
} from 'lucide-react';

interface MaintenanceQueueProps {
  tickets: MaintenanceTicket[];
  onMarkInspected: (ticketId: string) => void;
  onResolveTicket: (ticketId: string) => void;
  onAssignStaff: (ticketId: string, staffName: string) => void;
  onSelectRoomForOverride: (roomId: string) => void;
}

export const MaintenanceQueue: React.FC<MaintenanceQueueProps> = ({
  tickets,
  onMarkInspected,
  onResolveTicket,
  onAssignStaff,
  onSelectRoomForOverride,
}) => {
  const [filterUrgency, setFilterUrgency] = useState<'All' | 'Critical' | 'High' | 'Normal'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort: Open Critical first, then Open High, then Open Normal, then Inspected, then Resolved
  const sortedTickets = [...tickets].sort((a, b) => {
    const statusWeight = { Open: 0, Inspected: 1, Resolved: 2 };
    const urgencyWeight = { Critical: 0, High: 1, Normal: 2 };

    if (statusWeight[a.status] !== statusWeight[b.status]) {
      return statusWeight[a.status] - statusWeight[b.status];
    }
    return urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
  });

  const filteredTickets = sortedTickets.filter((t) => {
    if (filterUrgency !== 'All' && t.urgency !== filterUrgency) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        t.roomName.toLowerCase().includes(q) ||
        t.roomCode.toLowerCase().includes(q) ||
        t.issue.toLowerCase().includes(q) ||
        t.reportedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const staffMembers = ['Dave K.', 'Sanjay T.', 'Marcus V.', 'Elena P.'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      
      {/* Queue Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Priority Action Queue (Live Field Tickets)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800">
              {tickets.filter(t => t.status !== 'Resolved').length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-dispatched from telemetry overdraw anomalies and student EcoBot alerts.
          </p>
        </div>

        {/* Urgency Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Critical', 'High', 'Normal'] as const).map((urgency) => (
            <button
              key={urgency}
              onClick={() => setFilterUrgency(urgency)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterUrgency === urgency
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {urgency}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => {
          const isCritical = ticket.urgency === 'Critical';
          const isHigh = ticket.urgency === 'High';
          const isResolved = ticket.status === 'Resolved';
          const isInspected = ticket.status === 'Inspected';

          return (
            <div
              key={ticket.id}
              className={`p-4 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-slate-50/50 border-slate-200/60 opacity-70'
                  : isCritical
                  ? 'bg-rose-50/40 border-rose-200'
                  : isHigh
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                
                {/* Left Ticket Info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {ticket.id}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {ticket.roomName} ({ticket.roomCode})
                    </span>
                    
                    {/* Urgency Badge */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ticket.urgency} Urgency
                    </span>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInspected
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium mt-1.5">
                    {ticket.issue}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>Source: <strong className="text-slate-700">{ticket.reportedBy}</strong></span>
                    <span>•</span>
                    <span>Reported: <strong>{ticket.reportedAt}</strong></span>
                    <span>•</span>
                    <span className="text-rose-600 font-semibold font-mono">
                      ~{(ticket.wattsWasted / 1000).toFixed(2)} kW Overdraw
                    </span>
                    <span>•</span>
                    <span>Assigned: <strong className="text-slate-700">{ticket.assignedTo}</strong></span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                {!isResolved && (
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 shrink-0 self-end sm:self-center">
                    
                    {/* Assign Staff Dropdown */}
                    <select
                      value={ticket.assignedTo}
                      onChange={(e) => onAssignStaff(ticket.id, e.target.value)}
                      className="px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700"
                    >
                      <option value="Unassigned">Assign Staff</option>
                      {staffMembers.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    {/* Mark Inspected */}
                    {!isInspected && (
                      <button
                        onClick={() => onMarkInspected(ticket.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        title="Mark ticket as field inspected"
                      >
                        Mark Inspected
                      </button>
                    )}

                    {/* Override Breakers */}
                    <button
                      onClick={() => onSelectRoomForOverride(ticket.roomId)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                      title="Open Smart Breaker Control Drawer"
                    >
                      Override
                    </button>

                    {/* Resolve & Close */}
                    <button
                      onClick={() => onResolveTicket(ticket.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      Resolve & Close
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            No tickets match your filter criteria. All field alerts currently cleared!
          </div>
        )}
      </div>

    </div>
  );
};
