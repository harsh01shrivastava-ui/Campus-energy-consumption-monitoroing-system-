import React, { useState } from 'react';
import { Room } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Building2, 
  Flame, 
  CheckCircle2, 
  PowerOff, 
  SlidersHorizontal, 
  Zap, 
  Users,
  Eye,
  EyeOff
} from 'lucide-react';

interface FieldMapProps {
  rooms: Room[];
  onSelectRoomForOverride: (roomId: string) => void;
  onQuickShutoffRoom: (roomId: string) => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({
  rooms,
  onSelectRoomForOverride,
  onQuickShutoffRoom,
}) => {
  const [showOnlyWasting, setShowOnlyWasting] = useState(true);

  const wastingRooms = rooms.filter(
    (r) => r.occupancy === 0 && (r.appliances.lights || r.appliances.fans || r.appliances.ac || r.appliances.projector)
  );

  const displayedRooms = showOnlyWasting ? wastingRooms : rooms;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      
      {/* Field Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Field-Focused Campus Map
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
              {showOnlyWasting ? `${wastingRooms.length} Needing Attention` : `${rooms.length} Total Rooms`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Minimalist field view filtering out quiet rooms to prevent visual noise for workers on the move.
          </p>
        </div>

        {/* Toggle between Wasting Only and All */}
        <button
          onClick={() => setShowOnlyWasting(!showOnlyWasting)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            showOnlyWasting
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          {showOnlyWasting ? <Eye className="w-3.5 h-3.5 text-rose-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>{showOnlyWasting ? 'Showing Flagged Only' : 'Showing All Campus Rooms'}</span>
        </button>
      </div>

      {/* Grid of Field Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedRooms.map((room) => {
          const isWasting = room.occupancy === 0 && (room.appliances.lights || room.appliances.fans || room.appliances.ac || room.appliances.projector);
          
          const totalWatts = (
            (room.appliances.lights ? room.wattageRatings.lights : 0) +
            (room.appliances.fans ? room.wattageRatings.fans : 0) +
            (room.appliances.ac ? room.wattageRatings.ac : 0) +
            (room.appliances.projector ? room.wattageRatings.projector : 0) +
            room.wattageRatings.standby
          );

          return (
            <div
              key={room.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isWasting
                  ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {room.code}
                  </span>
                  <StatusBadge status={isWasting ? 'wasting' : 'normal'} size="sm" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {room.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {room.building} • {room.floor}
                </p>

                {/* Live Draw & Occupancy */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{room.occupancy === 0 ? 'Empty (0)' : `${room.occupancy} inside`}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    {(totalWatts / 1000).toFixed(2)} kW
                  </span>
                </div>

                {/* Active Appliances Chips */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {room.appliances.lights && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      Lights
                    </span>
                  )}
                  {room.appliances.fans && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                      Fans
                    </span>
                  )}
                  {room.appliances.ac && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                      AC
                    </span>
                  )}
                  {room.appliances.projector && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                      Projector
                    </span>
                  )}
                  {!room.appliances.lights && !room.appliances.fans && !room.appliances.ac && !room.appliances.projector && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                      All Breakers Standby
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectRoomForOverride(room.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Override Breakers
                </button>

                {isWasting && (
                  <button
                    onClick={() => onQuickShutoffRoom(room.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs transition-colors"
                    title="Shut off all appliances in this room"
                  >
                    <PowerOff className="w-3 h-3" />
                    <span>Cut Load</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayedRooms.length === 0 && (
        <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 mt-2">Zero Rooms Flagged for Wastage!</h4>
          <p className="text-xs text-slate-500 mt-1">All monitored rooms currently adhering to eco-targets.</p>
        </div>
      )}

    </div>
  );
};
