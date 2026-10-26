import React, { useState, useMemo } from 'react';
import { 
  UserRole, 
  Room, 
  MaintenanceTicket, 
  ShiftNote, 
  StudentClassProfile, 
  DepartmentRanking, 
  ForecastDataPoint, 
  AIInsight, 
  SystemSettingsConfig, 
  ToastMessage 
} from './types';
import { 
  INITIAL_ROOMS, 
  INITIAL_TICKETS, 
  INITIAL_SHIFT_NOTES, 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_DEPARTMENTS, 
  INITIAL_FORECAST_DATA, 
  INITIAL_AI_INSIGHTS, 
  INITIAL_SYSTEM_SETTINGS 
} from './data/mockData';

import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { StudentDashboard } from './components/student/StudentDashboard';
import { MaintenanceDashboard } from './components/maintenance/MaintenanceDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  // Global Role Routing: 'student' | 'maintenance' | 'admin'
  const [currentRole, setCurrentRole] = useState<UserRole>('student');

  // Centralized Shared Mock State
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [shiftNotes, setShiftNotes] = useState<ShiftNote[]>(INITIAL_SHIFT_NOTES);
  const [studentProfile, setStudentProfile] = useState<StudentClassProfile>(INITIAL_STUDENT_PROFILE);
  const [departments, setDepartments] = useState<DepartmentRanking[]>(INITIAL_DEPARTMENTS);
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>(INITIAL_FORECAST_DATA);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [settings, setSettings] = useState<SystemSettingsConfig>(INITIAL_SYSTEM_SETTINGS);
  const [energySavedKwh, setEnergySavedKwh] = useState<number>(142.8);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Notification Dispatcher
  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // DYNAMIC COMPUTED VALUES (Cross-portal synchronization)
  const { activeWastageKw, wastingRoomsCount } = useMemo(() => {
    let totalWastageWatts = 0;
    let count = 0;

    rooms.forEach((room) => {
      const isWasting = room.occupancy === 0 && (
        room.appliances.lights || room.appliances.fans || room.appliances.ac || room.appliances.projector
      );

      if (isWasting) {
        count += 1;
        const wasteWatts = (
          (room.appliances.lights ? room.wattageRatings.lights : 0) +
          (room.appliances.fans ? room.wattageRatings.fans : 0) +
          (room.appliances.ac ? room.wattageRatings.ac : 0) +
          (room.appliances.projector ? room.wattageRatings.projector : 0)
        );
        totalWastageWatts += wasteWatts;
      }
    });

    return {
      activeWastageKw: totalWastageWatts / 1000,
      wastingRoomsCount: count,
    };
  }, [rooms]);

  const complianceRate = useMemo(() => {
    if (rooms.length === 0) return 100;
    const sum = rooms.reduce((acc, r) => acc + r.complianceScore, 0);
    return sum / rooms.length;
  }, [rooms]);

  const openTicketsCount = useMemo(() => {
    return tickets.filter((t) => t.status !== 'Resolved').length;
  }, [tickets]);

  // ACTION HANDLERS

  // 1. Student Portal: Submit QR Compliance
  const handleSubmitCompliance = (
    roomId: string,
    items: { lights: boolean; fans: boolean; ac: boolean; projector: boolean; doors: boolean }
  ) => {
    const targetRoom = rooms.find((r) => r.id === roomId);
    let wattsTurnedOff = 0;

    // Shut down verified appliances in room
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;

        if (items.lights && r.appliances.lights) wattsTurnedOff += r.wattageRatings.lights;
        if (items.fans && r.appliances.fans) wattsTurnedOff += r.wattageRatings.fans;
        if (items.ac && r.appliances.ac) wattsTurnedOff += r.wattageRatings.ac;
        if (items.projector && r.appliances.projector) wattsTurnedOff += r.wattageRatings.projector;

        return {
          ...r,
          occupancy: 0,
          appliances: {
            lights: items.lights ? false : r.appliances.lights,
            fans: items.fans ? false : r.appliances.fans,
            ac: items.ac ? false : r.appliances.ac,
            projector: items.projector ? false : r.appliances.projector,
          },
          complianceScore: 100,
          lastExitChecklist: {
            submittedBy: studentProfile.className,
            timestamp: 'Just now',
            score: 100,
          },
        };
      })
    );

    // Increment energy saved
    const kwhGain = +(wattsTurnedOff / 1000 + 1.2).toFixed(2);
    setEnergySavedKwh((prev) => +(prev + kwhGain).toFixed(2));

    // Award class eco-points
    const earnedPoints = Math.round(15 * (settings.activeChallenge.enabled ? settings.activeChallenge.multiplier : 1));
    setStudentProfile((prev) => ({
      ...prev,
      ecoPoints: prev.ecoPoints + earnedPoints,
      checklistsCompleted: prev.checklistsCompleted + 1,
      streakDays: prev.streakDays + 1,
    }));

    // Update leaderboard class points
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.className === (targetRoom?.assignedClass || studentProfile.className)) {
          return {
            ...d,
            sustainabilityScore: Math.min(100, d.sustainabilityScore + 3),
            checklistsLogged: d.checklistsLogged + 1,
            energySavedKwh: +(d.energySavedKwh + kwhGain).toFixed(1),
            trendPoints: d.trendPoints + 3,
          };
        }
        return d;
      })
    );

    // Auto-resolve any open tickets for this room
    setTickets((prev) =>
      prev.map((t) => {
        if (t.roomId === roomId && t.status !== 'Resolved') {
          return { ...t, status: 'Resolved' };
        }
        return t;
      })
    );

    // Append to shift notes
    const newNote: ShiftNote = {
      id: `sn-${Date.now()}`,
      technician: 'System Telemetry',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shift: 'Evening',
      note: `Verified student QR exit protocol logged for ${targetRoom?.name}. Overdraw resolved, appliances standby.`,
      roomId,
      type: 'inspection',
    };
    setShiftNotes((prev) => [newNote, ...prev]);

    showToast(
      'Exit Compliance Verified!',
      `${targetRoom?.name} turned off. +${earnedPoints} Eco-Points awarded to ${studentProfile.className}.`,
      'success'
    );
  };

  // 2. Student Portal: Report Incident via EcoBot
  const handleReportIncident = (
    text: string,
    parsedRoomId: string,
    urgency: 'Critical' | 'High' | 'Normal'
  ): string => {
    const targetRoom = rooms.find((r) => r.id === parsedRoomId) || rooms[0];
    const ticketId = `T-${100 + tickets.length + 1}`;

    const newTicket: MaintenanceTicket = {
      id: ticketId,
      roomId: targetRoom.id,
      roomName: targetRoom.name,
      roomCode: targetRoom.code,
      building: targetRoom.building,
      issue: text,
      urgency,
      status: 'Open',
      assignedTo: 'Unassigned',
      reportedAt: 'Just now',
      reportedBy: `${studentProfile.className} (EcoBot)`,
      wattsWasted: 2800,
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Award bonus points for reporting
    setStudentProfile((prev) => ({
      ...prev,
      ecoPoints: prev.ecoPoints + 5,
    }));

    showToast(
      'EcoBot Incident Dispatched',
      `Ticket #${ticketId} created for ${targetRoom.name} and routed to Maintenance queue.`,
      'warning'
    );

    return ticketId;
  };

  // 3. Maintenance Portal: Mark Ticket Inspected
  const handleMarkInspected = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Inspected' } : t))
    );
    showToast('Ticket Marked Inspected', `Field technician dispatched for ticket #${ticketId}.`, 'info');
  };

  // 4. Maintenance Portal: Resolve & Close Ticket
  const handleResolveTicket = (ticketId: string) => {
    const targetTicket = tickets.find((t) => t.id === ticketId);
    if (!targetTicket) return;

    // Shut down room appliances
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== targetTicket.roomId) return r;
        return {
          ...r,
          appliances: { lights: false, fans: false, ac: false, projector: false },
          complianceScore: 98,
        };
      })
    );

    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );

    const savedWatts = targetTicket.wattsWasted || 2500;
    setEnergySavedKwh((prev) => +(prev + savedWatts / 1000).toFixed(2));

    // Append shift note
    const note: ShiftNote = {
      id: `sn-${Date.now()}`,
      technician: 'Maintenance Field Crew',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shift: 'Evening',
      note: `Ticket #${ticketId} resolved: Breakers inspected and isolated for ${targetTicket.roomName}.`,
      roomId: targetTicket.roomId,
      type: 'override',
    };
    setShiftNotes((prev) => [note, ...prev]);

    showToast(
      'Ticket Resolved & Closed',
      `${targetTicket.roomName} overdraw eliminated. Telemetry reset to optimal.`,
      'success'
    );
  };

  // 5. Maintenance Portal: Assign Staff
  const handleAssignStaff = (ticketId: string, staffName: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignedTo: staffName } : t))
    );
    showToast('Staff Assigned', `Assigned ${staffName} to ticket #${ticketId}.`, 'info');
  };

  // 6. Maintenance Portal: Toggle Appliance
  const handleToggleAppliance = (roomId: string, appliance: 'lights' | 'fans' | 'ac' | 'projector') => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const willBeOn = !r.appliances[appliance];
        const newAppliances = { ...r.appliances, [appliance]: willBeOn };

        if (!willBeOn) {
          const w = r.wattageRatings[appliance];
          setEnergySavedKwh((k) => +(k + w / 1000).toFixed(2));
        }

        const willBeWasting = r.occupancy === 0 && (
          newAppliances.lights || newAppliances.fans || newAppliances.ac || newAppliances.projector
        );

        return {
          ...r,
          appliances: newAppliances,
          complianceScore: willBeWasting ? Math.max(50, r.complianceScore - 5) : 98,
        };
      })
    );

    const targetRoom = rooms.find((r) => r.id === roomId);
    showToast(
      `Breaker Overridden`,
      `${targetRoom?.name}: ${appliance.toUpperCase()} circuit toggled.`,
      'info'
    );
  };

  // 7. Maintenance Portal: Shut Off All in Single Room
  const handleShutOffAllInRoom = (roomId: string) => {
    let savedWatts = 0;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        savedWatts = (
          (r.appliances.lights ? r.wattageRatings.lights : 0) +
          (r.appliances.fans ? r.wattageRatings.fans : 0) +
          (r.appliances.ac ? r.wattageRatings.ac : 0) +
          (r.appliances.projector ? r.wattageRatings.projector : 0)
        );
        return {
          ...r,
          appliances: { lights: false, fans: false, ac: false, projector: false },
          complianceScore: 98,
        };
      })
    );

    setEnergySavedKwh((k) => +(k + savedWatts / 1000).toFixed(2));
    const targetRoom = rooms.find((r) => r.id === roomId);
    showToast('Room Breakers Isolated', `${targetRoom?.name} turned off completely.`, 'success');
  };

  // 8. Maintenance Portal: Bulk Shut Off All Wasted Rooms
  const handleBulkShutOffAllWasted = () => {
    let totalSaved = 0;
    let count = 0;

    setRooms((prev) =>
      prev.map((r) => {
        const isWasting = r.occupancy === 0 && (r.appliances.lights || r.appliances.fans || r.appliances.ac || r.appliances.projector);
        if (!isWasting) return r;

        count += 1;
        totalSaved += (
          (r.appliances.lights ? r.wattageRatings.lights : 0) +
          (r.appliances.fans ? r.wattageRatings.fans : 0) +
          (r.appliances.ac ? r.wattageRatings.ac : 0) +
          (r.appliances.projector ? r.wattageRatings.projector : 0)
        );

        return {
          ...r,
          appliances: { lights: false, fans: false, ac: false, projector: false },
          complianceScore: 98,
        };
      })
    );

    setEnergySavedKwh((k) => +(k + totalSaved / 1000).toFixed(2));

    // Auto-resolve open tickets
    setTickets((prev) => prev.map((t) => ({ ...t, status: 'Resolved' })));

    showToast(
      'Bulk Shutdown Executed',
      `Shut down ${count} empty rooms. Saved ${(totalSaved / 1000).toFixed(2)} kW instantly!`,
      'success'
    );
  };

  // 9. Maintenance Portal: Add Shift Note
  const handleAddShiftNote = (
    technician: string,
    note: string,
    shift: 'Morning' | 'Evening' | 'Night' = 'Evening',
    roomId?: string
  ) => {
    const newNote: ShiftNote = {
      id: `sn-${Date.now()}`,
      technician,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shift,
      note,
      roomId,
      type: roomId ? 'override' : 'handover',
    };

    setShiftNotes((prev) => [newNote, ...prev]);
    showToast('Shift Note Recorded', `Logged entry for ${technician}.`, 'info');
  };

  // 10. Admin Portal: Apply AI Insight Policy
  const handleApplyInsight = (id: string) => {
    setAiInsights((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, isApplied: true } : ins))
    );
    setEnergySavedKwh((k) => +(k + 18.5).toFixed(1));
    showToast('AI Recommendation Applied', 'Policy automated across designated campus submeters.', 'success');
  };

  // 11. Admin Portal: Toggle Energy Challenge
  const handleToggleChallenge = () => {
    setSettings((prev) => {
      const isNowEnabled = !prev.activeChallenge.enabled;
      showToast(
        isNowEnabled ? 'Energy Challenge Activated!' : 'Energy Challenge Concluded',
        isNowEnabled ? '2x Eco-Points multiplier active campus-wide.' : 'Standard point multiplier restored.',
        isNowEnabled ? 'success' : 'info'
      );
      return {
        ...prev,
        activeChallenge: {
          ...prev.activeChallenge,
          enabled: isNowEnabled,
        },
      };
    });
  };

  // 12. Admin Portal: Export Monthly Report (CSV)
  const handleExportReport = () => {
    const csvContent = [
      ['Metric', 'Value', 'Unit', 'Notes'].join(','),
      ['Campus Overall Compliance', `${complianceRate.toFixed(1)}%`, '%', 'Verified exit walkthroughs'],
      ['Active Wastage Load', `${activeWastageKw.toFixed(2)}`, 'kW', `${wastingRoomsCount} rooms running unoccupied`],
      ['Total kWh Conserved', `${energySavedKwh.toFixed(1)}`, 'kWh', 'Grassroots and breaker interventions'],
      ['Active Maintenance Tickets', `${openTicketsCount}`, 'Tickets', 'Unresolved field tasks'],
      ['Campus Top Class Cohort', `"${studentProfile.className}"`, 'Cohort', `${studentProfile.ecoPoints} points`],
      [],
      ['Room Code', 'Room Name', 'Building', 'Occupancy', 'Lights', 'Fans', 'AC', 'Projector', 'Compliance Score'].join(','),
      ...rooms.map((r) => [
        `"${r.code}"`,
        `"${r.name}"`,
        `"${r.building}"`,
        r.occupancy,
        r.appliances.lights ? 'ON' : 'OFF',
        r.appliances.fans ? 'ON' : 'OFF',
        r.appliances.ac ? 'ON' : 'OFF',
        r.appliances.projector ? 'ON' : 'OFF',
        `${r.complianceScore}%`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `campus-energy-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Export Complete', 'Campus sustainability audit downloaded in CSV format.', 'success');
  };

  // 13. Admin Portal: Update Settings
  const handleUpdateSettings = (newSettings: Partial<SystemSettingsConfig>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleToggleCurrency = () => {
    setSettings((prev) => ({
      ...prev,
      currency: prev.currency === 'USD' ? 'INR' : 'USD',
    }));
    showToast(
      'Currency Switched',
      `Financial figures now displayed in ${settings.currency === 'USD' ? 'INR (₹)' : 'USD ($)'}.`,
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* GLOBAL TOP NAVIGATION WITH ROLE SWITCHER */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          const roleTitle = 
            role === 'student' ? 'Student / Class Rep Portal' :
            role === 'maintenance' ? 'Maintenance Field Operations' : 'Campus Administrator Portal';
          showToast(`Switched to ${roleTitle}`, 'Interface and permissions updated.', 'info');
        }}
        activeWastageKw={activeWastageKw}
        wastingRoomsCount={wastingRoomsCount}
        openTicketsCount={openTicketsCount}
        currency={settings.currency}
        onToggleCurrency={handleToggleCurrency}
      />

      {/* CONDITIONAL PORTAL VIEW ROUTING */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* PORTAL 1: STUDENT / CLASS REP PORTAL (Grassroots Interface) */}
        {currentRole === 'student' && (
          <StudentDashboard
            rooms={rooms}
            profile={studentProfile}
            onSubmitCompliance={handleSubmitCompliance}
            onReportIncident={handleReportIncident}
            onShowToast={showToast}
          />
        )}

        {/* PORTAL 2: MAINTENANCE PORTAL (Field & Task Queue Interface) */}
        {currentRole === 'maintenance' && (
          <MaintenanceDashboard
            rooms={rooms}
            tickets={tickets}
            shiftNotes={shiftNotes}
            activeWastageKw={activeWastageKw}
            onMarkInspected={handleMarkInspected}
            onResolveTicket={handleResolveTicket}
            onAssignStaff={handleAssignStaff}
            onToggleAppliance={handleToggleAppliance}
            onShutOffAllInRoom={handleShutOffAllInRoom}
            onBulkShutOffAllWasted={handleBulkShutOffAllWasted}
            onAddShiftNote={handleAddShiftNote}
          />
        )}

        {/* PORTAL 3: ADMINISTRATOR PORTAL (Executive & Analytical Interface) */}
        {currentRole === 'admin' && (
          <AdminDashboard
            activeWastageKw={activeWastageKw}
            energySavedKwh={energySavedKwh}
            complianceRate={complianceRate}
            forecastData={forecastData}
            insights={aiInsights}
            departments={departments}
            settings={settings}
            onApplyInsight={handleApplyInsight}
            onToggleChallenge={handleToggleChallenge}
            onExportReport={handleExportReport}
            onUpdateSettings={handleUpdateSettings}
            onShowToast={showToast}
          />
        )}

      </main>

      {/* FLOATING TOAST STACK */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* CLEAN MINIMAL FOOTER */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Campus Energy Consumption Monitoring System</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700">Centralized Reactive Telemetry</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Active Role: <strong className="text-slate-700 uppercase">{currentRole}</strong> • Mode: Cross-Portal Sync
          </div>
        </div>
      </footer>

    </div>
  );
}
