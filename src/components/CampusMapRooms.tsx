import React, { useState } from 'react';
import { RoomData } from '../types';

interface CampusMapRoomsProps {
  rooms: RoomData[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onOpenEcoAudit: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const CampusMapRooms: React.FC<CampusMapRoomsProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onOpenEcoAudit,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'schematic'>('grid');
  const [selectedFacility, setSelectedFacility] = useState('Science Complex');
  const [selectedFloor, setSelectedFloor] = useState('Floor 3');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'occupied' | 'wastage'>('all');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Dynamic room states (breakers & wattage)
  const [roomBreakerStates, setRoomBreakerStates] = useState<Record<string, {
    lightsOff: boolean;
    hvacOff: boolean;
    hvacEco: boolean;
    totalWatts: number;
  }>>({
    '304': { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 4800 },
    '101': { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 6200 },
    'seminar-b': { lightsOff: true, hvacOff: true, hvacEco: true, totalWatts: 50 },
    'complab2': { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 3100 },
    'physics1': { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 2400 },
    'faculty2b': { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 1800 },
  });

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const activeBreakerState = roomBreakerStates[activeRoom.id] || {
    lightsOff: false,
    hvacOff: false,
    hvacEco: false,
    totalWatts: Math.round(activeRoom.powerDrawKw * 1000),
  };

  const handleToggleLights = () => {
    setRoomBreakerStates((prev) => {
      const current = prev[activeRoom.id] || { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 4800 };
      const newLightsOff = !current.lightsOff;
      const wattDiff = newLightsOff ? -640 : 640;
      const newTotal = Math.max(960, current.totalWatts + wattDiff);

      onShowToast(
        newLightsOff ? 'Ceiling Lights Deactivated' : 'Ceiling Lights Activated',
        `${activeRoom.name}: Submeter updated by ${Math.abs(wattDiff)} W`,
        newLightsOff ? 'success' : 'info'
      );

      return {
        ...prev,
        [activeRoom.id]: {
          ...current,
          lightsOff: newLightsOff,
          totalWatts: newTotal,
        },
      };
    });
  };

  const handleToggleHvac = () => {
    setRoomBreakerStates((prev) => {
      const current = prev[activeRoom.id] || { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 4800 };
      const newHvacOff = !current.hvacOff;
      const wattDiff = newHvacOff ? -3200 : 3200;
      const newTotal = Math.max(960, current.totalWatts + wattDiff);

      onShowToast(
        newHvacOff ? 'HVAC Switched to Deep Standby' : 'HVAC Resumed Active Chill',
        `${activeRoom.name}: Breaker relay changed state.`,
        newHvacOff ? 'success' : 'info'
      );

      return {
        ...prev,
        [activeRoom.id]: {
          ...current,
          hvacOff: newHvacOff,
          hvacEco: false,
          totalWatts: newTotal,
        },
      };
    });
  };

  const handleEcoHvac = () => {
    setRoomBreakerStates((prev) => {
      const current = prev[activeRoom.id] || { lightsOff: false, hvacOff: false, hvacEco: false, totalWatts: 4800 };
      if (current.hvacEco || current.hvacOff) return prev;
      const newTotal = Math.max(960, current.totalWatts - 1750);

      onShowToast(
        'Eco Setpoint (24°C) Applied',
        `Adjusted cooling delta in ${activeRoom.name}. Saved 1,750 Watts.`,
        'success'
      );

      return {
        ...prev,
        [activeRoom.id]: {
          ...current,
          hvacEco: true,
          totalWatts: newTotal,
        },
      };
    });
  };

  const handleRemoteShutdown = () => {
    setRoomBreakerStates((prev) => ({
      ...prev,
      [activeRoom.id]: {
        lightsOff: true,
        hvacOff: true,
        hvacEco: true,
        totalWatts: 960, // Safety baseline
      },
    }));

    onShowToast(
      `Remote Eco Shutdown Dispatched: ${activeRoom.name}`,
      'Room circuits reduced to essential safety baseline (960 W fume hoods).',
      'success'
    );
  };

  const handleSendMaintenanceAlert = () => {
    onShowToast(
      'Maintenance Alert Dispatched',
      `Notified Facilities & Janitorial supervisor on shift for ${activeRoom.name}.`,
      'info'
    );
  };

  const handleExecuteEveningShed = () => {
    onShowToast(
      'Automated Evening Load Shedding Initiated',
      'Remotely cut idle auxiliary circuits across 14 vacant rooms. Saved 8.4 kW instantly.',
      'success'
    );
  };

  // Filter rooms
  const filteredRooms = rooms.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Top Header & View Selector */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="inline-flex h-2 w-2 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Sub-Meter Node Telemetry • Zone 3
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Campus Map &amp; Room Energy Grid
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Real-time telemetry of classroom, lab, and hall occupancy &amp; appliance power draw
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Grid vs Schematic View Toggle */}
          <div className="bg-surface-container-high p-1 rounded-xl flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all duration-200 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('schematic')}
              className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all duration-200 cursor-pointer ${
                viewMode === 'schematic'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              <span>Schematic Floor Plan</span>
            </button>
          </div>

          {/* Run Eco Audit */}
          <button
            type="button"
            onClick={onOpenEcoAudit}
            className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all cursor-pointer font-semibold active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">energy_savings_leaf</span>
            <span>Run Eco Audit</span>
          </button>
        </div>
      </div>

      {/* Facility & Floor Filters Ribbon */}
      <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold">
              Facility
            </span>
            <div className="relative inline-block">
              <select
                value={selectedFacility}
                onChange={(e) => {
                  setSelectedFacility(e.target.value);
                  onShowToast(`Switched Facility to ${e.target.value}`);
                }}
                className="appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-space-md pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 cursor-pointer"
              >
                <option value="Science Complex">Science Complex</option>
                <option value="Engineering Block A">Engineering Block A</option>
                <option value="Engineering Block B">Engineering Block B</option>
                <option value="Library & Admin">Library &amp; Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>

            <div className="h-6 w-px bg-surface-container-highest hidden sm:block mx-1"></div>

            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
              {['Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3'].map((fl) => {
                const isActive = selectedFloor === fl;
                return (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setSelectedFloor(fl)}
                    className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {fl} {isActive ? '(Active)' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-space-xs flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-surface-container-high text-on-surface shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              All <span className="ml-1 opacity-75">28</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'normal'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Normal <span className="opacity-75">21</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('occupied')}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'occupied'
                  ? 'bg-[#fef3c7] text-[#92400e] font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
              Occupied <span className="opacity-75">4</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('wastage')}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'wastage'
                  ? 'bg-error-container text-on-error-container ring-1 ring-error/40'
                  : 'bg-error-container/70 text-on-error-container hover:bg-error-container'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              Needs Attention <span className="opacity-75">3</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Pills */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-sm pt-space-xs border-t border-surface-container">
          <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-outline-variant/15">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Floor Aggregate Load</span>
            <span className="font-label-md text-label-md text-on-surface font-bold">18.45 kW</span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-outline-variant/15">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Unoccupied Wastage</span>
            <span className="font-label-md text-label-md text-error font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">warning</span> 7.90 kW
            </span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-outline-variant/15">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Estimated Daily Loss</span>
            <span className="font-label-md text-label-md text-on-surface font-bold">$38.40 / day</span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-outline-variant/15">
            <span className="font-label-sm text-label-sm text-on-surface-variant">HVAC Thermal Sync</span>
            <span className="font-label-md text-label-md text-secondary font-bold">Eco Profile Target 23°C</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Rooms & CAD Schematic vs Right Inspector Panel */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Section (8 cols if inspector open, 12 if closed) */}
        <div
          className={`${
            isInspectorOpen ? 'lg:col-span-8' : 'lg:col-span-12'
          } flex flex-col gap-space-lg transition-all duration-300`}
        >
          {viewMode === 'grid' ? (
            /* Grid View of Room Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {filteredRooms.map((room) => {
                const isSelected = room.id === activeRoom.id;
                const state = roomBreakerStates[room.id] || {
                  lightsOff: false,
                  hvacOff: false,
                  hvacEco: false,
                  totalWatts: Math.round(room.powerDrawKw * 1000),
                };

                const isWastage = room.status === 'wastage';
                const isOccupied = room.status === 'occupied';

                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room.id);
                      setIsInspectorOpen(true);
                    }}
                    className={`cursor-pointer group bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden border ${
                      isSelected
                        ? 'ring-2 ring-primary border-primary/50'
                        : isWastage
                        ? 'ring-1 ring-error/30 border-error/30'
                        : 'border-outline-variant/30'
                    }`}
                  >
                    {isWastage && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-error-container/30 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8"></div>
                    )}

                    {/* Room Header */}
                    <div className="flex items-start justify-between mb-space-sm relative z-10">
                      <div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-mono uppercase tracking-wider">
                          {room.wing} • {room.floor}
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mt-0.5 font-bold">
                          {room.name}
                        </h3>
                      </div>

                      {/* Status Chip */}
                      {isWastage && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                          {room.statusLabel}
                        </span>
                      )}
                      {isOccupied && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e] font-label-sm text-label-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
                          {room.statusLabel}
                        </span>
                      )}
                      {!isWastage && !isOccupied && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          {room.statusLabel}
                        </span>
                      )}
                    </div>

                    {/* Occupancy & Live Power Draw */}
                    <div className="grid grid-cols-2 gap-space-sm py-space-sm my-space-xs bg-surface-container-low rounded-lg p-space-sm border border-outline-variant/15">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Occupancy</span>
                        <span
                          className={`font-body-md text-body-md font-semibold flex items-center gap-1 mt-0.5 ${
                            isWastage ? 'text-error' : isOccupied ? 'text-on-surface' : 'text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {room.occupancyCount > 0 ? 'groups' : 'person_off'}
                          </span>
                          {room.occupancyText}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Live Power Draw</span>
                        <span className="font-metric-md text-metric-md text-on-surface font-bold tracking-tight">
                          {(state.totalWatts / 1000).toFixed(2)}{' '}
                          <span className="font-label-md text-label-md text-on-surface-variant font-normal">kW</span>
                        </span>
                      </div>
                    </div>

                    {/* Appliance Summary & Progress Bar */}
                    <div className="flex flex-col gap-space-xs mt-space-sm text-body-sm text-body-sm text-on-surface-variant">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              isWastage ? 'text-error' : 'text-secondary'
                            }`}
                          >
                            toggle_on
                          </span>
                          <span>{room.appliancesActive}</span>
                        </span>
                        <span
                          className={`font-label-sm text-label-sm font-medium ${
                            isWastage ? 'text-error' : 'text-on-surface-variant'
                          }`}
                        >
                          {room.appliancesDetail}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWastage ? 'bg-error' : 'bg-secondary'
                          }`}
                          style={{ width: `${room.percentLoad}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Footer Call to Action */}
                    <div className="flex items-center justify-between pt-space-md mt-space-sm border-t border-outline-variant/10">
                      <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                        <span>{room.subText}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Schematic Floor Plan CAD View */
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Architectural Zone Schematic (Floor 3)
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Spatial placement of sub-meters, smart circuit breakers, and thermal sensors
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-label-sm text-label-sm text-error">
                    <span className="w-2.5 h-2.5 rounded bg-error/30 border border-error inline-block"></span> High Drain
                  </span>
                  <span className="flex items-center gap-1 font-label-sm text-label-sm text-[#92400e]">
                    <span className="w-2.5 h-2.5 rounded bg-[#fef3c7] border border-amber-400 inline-block"></span> Moderate
                  </span>
                  <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary">
                    <span className="w-2.5 h-2.5 rounded bg-secondary-container border border-secondary inline-block"></span> Idle
                  </span>
                </div>
              </div>

              {/* CAD Grid Map Frame */}
              <div className="w-full h-80 bg-surface-container-low rounded-xl relative p-4 overflow-hidden flex flex-col justify-between border border-outline-variant/40">
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="30" id="cad-grid" patternUnits="userSpaceOnUse" width="30">
                      <path className="text-outline-variant" d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect fill="url(#cad-grid)" height="100%" width="100%" />
                </svg>

                <div className="relative z-10 grid grid-cols-12 gap-3 h-full">
                  {/* LAB 304 - Red Wastage zone */}
                  <div
                    onClick={() => {
                      onSelectRoom('304');
                      setIsInspectorOpen(true);
                    }}
                    className="col-span-5 bg-error-container/40 border-2 border-dashed border-error p-3 rounded-lg flex flex-col justify-between cursor-pointer hover:bg-error-container/60 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md font-bold text-on-error-container">
                        LAB 304 • Chemistry
                      </span>
                      <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                    </div>
                    <div className="text-center my-2">
                      <span className="font-metric-md text-metric-md font-bold text-error">
                        {(roomBreakerStates['304']?.totalWatts || 4800) / 1000} kW
                      </span>
                      <p className="font-label-sm text-label-sm text-on-error-container">
                        Empty / Full HVAC Draw
                      </p>
                    </div>
                    <span className="font-label-sm text-label-sm text-error text-right font-medium">
                      Click to isolate →
                    </span>
                  </div>

                  {/* Center Column */}
                  <div className="col-span-4 flex flex-col gap-3">
                    {/* Seminar B */}
                    <div
                      onClick={() => {
                        onSelectRoom('seminar-b');
                        setIsInspectorOpen(true);
                      }}
                      className="flex-1 bg-secondary-container/40 border border-dashed border-secondary p-2.5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-secondary-container/60 transition-colors"
                    >
                      <div>
                        <span className="font-label-sm text-label-sm font-bold text-on-surface">SEMINAR B</span>
                        <p className="font-label-sm text-label-sm text-secondary">0.05 kW • Standby</p>
                      </div>
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                    </div>

                    {/* Faculty Office 312 */}
                    <div
                      onClick={() => {
                        onShowToast('Faculty Office 312 Telemetry', 'Submeter reading: 0.42 kW (Within normal office baseline).', 'info');
                      }}
                      className="flex-1 bg-surface-container-high/60 border border-dashed border-outline-variant p-2.5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-surface-container-high"
                    >
                      <div>
                        <span className="font-label-sm text-label-sm font-bold text-on-surface">FACULTY OFFICE 312</span>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">0.42 kW • Normal</p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">meeting_room</span>
                    </div>
                  </div>

                  {/* Right Zone: Corridor & Lighting Sensor */}
                  <div className="col-span-3 bg-surface-container-high/40 border border-dashed border-outline-variant p-3 rounded-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">
                        CORRIDOR &amp; STAIRWELL
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">lightbulb</span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      PIR Daylight Sensor: Dimmed to 30%
                    </p>
                    <span className="font-label-sm text-label-sm text-secondary font-semibold">0.18 kW</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Automated Evening Load Shedding Banner */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">energy_program_saving</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Automated Evening Load Shedding
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Scheduled policy will remotely cut idle auxiliary circuits across 14 vacant rooms in 45 minutes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <button
                type="button"
                onClick={() => {
                  onShowToast('Schedule Adjustment Panel', 'Evening load shed configured for 21:00 nightly.', 'info');
                }}
                className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors font-medium shadow-xs"
              >
                Adjust Schedule
              </button>
              <button
                type="button"
                onClick={handleExecuteEveningShed}
                className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-colors font-semibold"
              >
                Execute Now
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Device Diagnostic Drawer (4 cols) */}
        {isInspectorOpen ? (
          <div
            className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-lg relative flex flex-col gap-space-lg border border-outline-variant/30 animate-in fade-in duration-200"
            id="inspectorPanel"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase font-mono text-on-surface-variant tracking-wider">
                  Device Diagnostic Drawer
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">
                  {activeRoom.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-2">
                  {activeRoom.status === 'wastage' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                      Unoccupied Wastage Detected
                    </span>
                  ) : activeRoom.status === 'occupied' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                      Active In-Session Occupancy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Eco Profile Verified
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                aria-label="Minimize Inspector"
                onClick={() => setIsInspectorOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Cumulative Power Draw Box */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-outline-variant/15">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-medium">
                  Cumulative Power Draw
                </span>
                <span className="font-metric-xl text-metric-xl font-bold text-on-surface tracking-tight">
                  {activeBreakerState.totalWatts.toLocaleString()}{' '}
                  <span className="text-headline-sm font-normal text-on-surface-variant">Watts</span>
                </span>
              </div>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  activeBreakerState.totalWatts > 2000
                    ? 'bg-error-container text-error'
                    : 'bg-secondary-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">bolt</span>
              </div>
            </div>

            {/* Appliance Telemetry & Breaker Controls */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">
                  Appliance Telemetry &amp; Controls
                </span>
                <span className="font-label-sm text-label-sm text-primary font-medium">
                  {activeRoom.smartBreakerBank}
                </span>
              </div>

              {/* Control Row 1: Ceiling Lights */}
              <div className="bg-surface-container-low/70 p-space-sm rounded-lg flex items-center justify-between gap-space-sm border border-outline-variant/15 transition-all">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                  </div>
                  <div>
                    <h5 className="font-label-md text-label-md text-on-surface font-semibold">
                      Ceiling Lights (Zone A &amp; B)
                    </h5>
                    <span
                      className={`font-label-sm text-label-sm font-semibold ${
                        activeBreakerState.lightsOff ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {activeBreakerState.lightsOff ? '0 Watts • Turned Off' : '640 Watts • Unnecessary'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleLights}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-medium shadow-xs transition-all cursor-pointer ${
                    activeBreakerState.lightsOff
                      ? 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      : 'bg-error text-on-error hover:opacity-90'
                  }`}
                >
                  {activeBreakerState.lightsOff ? 'Turn On' : 'Turn Off'}
                </button>
              </div>

              {/* Control Row 2: HVAC / Climate */}
              <div className="bg-surface-container-low/70 p-space-sm rounded-lg flex flex-col gap-2 border border-outline-variant/15 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-[20px]">ac_unit</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface font-semibold">
                        HVAC / Air Conditioning
                      </h5>
                      <span
                        className={`font-label-sm text-label-sm font-semibold ${
                          activeBreakerState.hvacOff
                            ? 'text-secondary'
                            : activeBreakerState.hvacEco
                            ? 'text-secondary'
                            : 'text-error'
                        }`}
                      >
                        {activeBreakerState.hvacOff
                          ? '0 Watts • Fan Standby'
                          : activeBreakerState.hvacEco
                          ? '1,450 Watts • Eco Setpoint (24°C)'
                          : '3,200 Watts • Set to 19°C'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pl-11">
                  <button
                    type="button"
                    onClick={handleEcoHvac}
                    disabled={activeBreakerState.hvacEco || activeBreakerState.hvacOff}
                    className="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-medium hover:bg-primary transition-colors flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[14px]">eco</span>
                    <span>{activeBreakerState.hvacEco ? '✓ Saved 1.75 kW' : 'Eco Adjust (24°C)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleHvac}
                    className="px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    {activeBreakerState.hvacOff ? 'Turn On' : 'Turn Off'}
                  </button>
                </div>
              </div>

              {/* Control Row 3: Interactive Smart Board */}
              <div className="bg-surface-container-low/70 p-space-sm rounded-lg flex items-center justify-between gap-space-sm border border-outline-variant/15 transition-all">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">co_present</span>
                  </div>
                  <div>
                    <h5 className="font-label-md text-label-md text-on-surface font-semibold">
                      Interactive Smart Board &amp; Projector
                    </h5>
                    <span className="font-label-sm text-label-sm text-secondary font-semibold">
                      0 Watts • In Standby
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant px-2 py-0.5 rounded bg-surface-container font-semibold">
                  OFF
                </span>
              </div>

              {/* Control Row 4: Fume Hoods & Lab Safety Mandate */}
              <div className="bg-surface-container-low/70 p-space-sm rounded-lg flex items-center justify-between gap-space-sm border border-outline-variant/15 transition-all">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">mode_fan</span>
                  </div>
                  <div>
                    <h5 className="font-label-md text-label-md text-on-surface font-semibold">
                      Ventilation &amp; Fume Hoods
                    </h5>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      960 Watts • Lab Safety Mandate
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-bold px-2 py-0.5 rounded bg-surface-container">
                  Locked
                </span>
              </div>
            </div>

            {/* Recent Activity Audit */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2 border border-outline-variant/15">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-bold uppercase text-on-surface-variant">
                  Recent Activity Audit
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">history</span>
              </div>
              <div className="relative pl-4 flex flex-col gap-2 text-body-sm text-body-sm text-on-surface-variant">
                {activeRoom.recentAudits.map((item, i) => (
                  <div
                    key={i}
                    className={`relative before:absolute before:-left-3 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full ${
                      item.type === 'anomaly' ? 'before:bg-error text-error font-medium' : 'before:bg-outline-variant'
                    }`}
                  >
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                type="button"
                onClick={handleRemoteShutdown}
                className="w-full py-2.5 px-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
                <span>Remote Eco Shutdown</span>
              </button>
              <button
                type="button"
                onClick={handleSendMaintenanceAlert}
                className="w-full py-2 px-space-md rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container-high flex items-center justify-center gap-2 transition-colors cursor-pointer border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                <span>Send Maintenance Alert</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-12 flex justify-end">
            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm text-primary font-semibold hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Open Device Diagnostic Drawer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
