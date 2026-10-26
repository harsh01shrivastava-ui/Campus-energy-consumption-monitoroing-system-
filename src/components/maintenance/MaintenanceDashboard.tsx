import React, { useState } from 'react';
import { Room, MaintenanceTicket, ShiftNote } from '../../types';
import { MaintenanceQueue } from './MaintenanceQueue';
import { FieldMap } from './FieldMap';
import { ShiftNotes } from './ShiftNotes';
import { ApplianceOverrideDrawer } from './ApplianceOverrideDrawer';
import { 
  Wrench, 
  PowerOff, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  SlidersHorizontal,
  ClipboardList,
  Sparkles
} from 'lucide-react';

interface MaintenanceDashboardProps {
  rooms: Room[];
  tickets: MaintenanceTicket[];
  shiftNotes: ShiftNote[];
  activeWastageKw: number;
  onMarkInspected: (ticketId: string) => void;
  onResolveTicket: (ticketId: string) => void;
  onAssignStaff: (ticketId: string, staffName: string) => void;
  onToggleAppliance: (roomId: string, appliance: 'lights' | 'fans' | 'ac' | 'projector') => void;
  onShutOffAllInRoom: (roomId: string) => void;
  onBulkShutOffAllWasted: () => void;
  onAddShiftNote: (technician: string, note: string, shift?: 'Morning' | 'Evening' | 'Night', roomId?: string) => void;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({
  rooms,
  tickets,
  shiftNotes,
  activeWastageKw,
  onMarkInspected,
  onResolveTicket,
  onAssignStaff,
  onToggleAppliance,
  onShutOffAllInRoom,
  onBulkShutOffAllWasted,
  onAddShiftNote,
}) => {
  const [selectedRoomIdForDrawer, setSelectedRoomIdForDrawer] = useState<string | null>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomIdForDrawer) || null;
  const openTickets = tickets.filter((t) => t.status !== 'Resolved');
  const criticalCount = openTickets.filter((t) => t.urgency === 'Critical').length;
  const wastingRooms = rooms.filter(
    (r) => r.occupancy === 0 && (r.appliances.lights || r.appliances.fans || r.appliances.ac || r.appliances.projector)
  );

  return (
    <div className="space-y-6">
      
      {/* Maintenance Operations Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2.5">
              <Wrench className="w-3.5 h-3.5" />
              Field Technician & Dispatch Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Rapid Response Telemetry & Smart Breakers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect anomalous power draws, clear grassroots EcoBot alerts, and execute remote breaker overrides across campus wings.
            </p>
          </div>

          {/* Quick Metrics & Emergency Bulk Cutoff */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Active Queue
              </span>
              <span className="text-2xl font-extrabold font-mono text-amber-400">
                {openTickets.length}
              </span>
              <span className="text-[10px] text-rose-400 block font-semibold">
                {criticalCount} Critical
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Wasting Power
              </span>
              <span className="text-2xl font-extrabold font-mono text-rose-400">
                {activeWastageKw.toFixed(2)} kW
              </span>
              <span className="text-[10px] text-slate-400 block">
                {wastingRooms.length} Empty Rooms
              </span>
            </div>

            {wastingRooms.length > 0 && (
              <button
                onClick={onBulkShutOffAllWasted}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-all cursor-pointer shrink-0"
                title="Immediately power down appliances in all unoccupied rooms"
              >
                <PowerOff className="w-4 h-4" />
                <span>1-Tap Shutoff ({wastingRooms.length} Rooms)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Priority Action Queue (Live Ticket Feed) */}
      <MaintenanceQueue
        tickets={tickets}
        onMarkInspected={onMarkInspected}
        onResolveTicket={onResolveTicket}
        onAssignStaff={onAssignStaff}
        onSelectRoomForOverride={(roomId) => setSelectedRoomIdForDrawer(roomId)}
      />

      {/* 2. Field-Focused Campus Map */}
      <FieldMap
        rooms={rooms}
        onSelectRoomForOverride={(roomId) => setSelectedRoomIdForDrawer(roomId)}
        onQuickShutoffRoom={onShutOffAllInRoom}
      />

      {/* 3. Running Shift Handover Log */}
      <ShiftNotes
        notes={shiftNotes}
        onAddNote={(tech, note, s) => onAddShiftNote(tech, note, s)}
      />

      {/* Detail Slide-Over: Appliance Override Drawer */}
      <ApplianceOverrideDrawer
        room={selectedRoom}
        onClose={() => setSelectedRoomIdForDrawer(null)}
        onToggleAppliance={onToggleAppliance}
        onShutOffAll={onShutOffAllInRoom}
        onAddShiftNote={(tech, note, rId) => {
          onAddShiftNote(tech, note, 'Evening', rId);
        }}
      />

    </div>
  );
};
