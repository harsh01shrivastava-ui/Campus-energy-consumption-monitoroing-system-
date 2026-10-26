export type UserRole = 'student' | 'maintenance' | 'admin';

export interface ApplianceState {
  lights: boolean;
  fans: boolean;
  ac: boolean;
  projector: boolean;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  occupancy: number; // 0 = empty
  appliances: ApplianceState;
  wattageRatings: {
    lights: number;    // watts
    fans: number;      // watts
    ac: number;        // watts
    projector: number; // watts
    standby: number;   // baseline idle watts
  };
  complianceScore: number; // 0 - 100
  assignedClass: string;
  lastExitChecklist?: {
    submittedBy: string;
    timestamp: string;
    score: number;
  };
  isOverrideLocked?: boolean;
}

export interface MaintenanceTicket {
  id: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  building: string;
  issue: string;
  urgency: 'Critical' | 'High' | 'Normal';
  status: 'Open' | 'Inspected' | 'Resolved';
  assignedTo: string;
  reportedAt: string;
  reportedBy: string;
  wattsWasted: number;
}

export interface ShiftNote {
  id: string;
  technician: string;
  timestamp: string;
  shift: 'Morning' | 'Evening' | 'Night';
  note: string;
  roomId?: string;
  type: 'override' | 'inspection' | 'handover';
}

export interface EcoBotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  ticketId?: string;
}

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  color: string;
}

export interface StudentClassProfile {
  className: string;
  section: string;
  department: string;
  ecoPoints: number;
  streakDays: number;
  checklistsCompleted: number;
  rank: number;
  badges: StudentBadge[];
}

export interface DepartmentRanking {
  id: string;
  department: string;
  className: string;
  sustainabilityScore: number;
  checklistsLogged: number;
  energySavedKwh: number;
  trend: 'up' | 'down' | 'steady';
  trendPoints: number;
  isMostImproved?: boolean;
}

export interface ForecastDataPoint {
  dayOrHour: string;
  actualKwh: number;
  baselineKwh: number;
  unoccupiedSpikeKwh: number;
  isWeekendOrHoliday?: boolean;
}

export interface AIInsight {
  id: string;
  title: string;
  zone: string;
  severity: 'high' | 'medium' | 'info';
  description: string;
  recommendation: string;
  potentialMonthlySaving: string;
  isApplied?: boolean;
}

export interface SystemSettingsConfig {
  autoCutoffEnabled: boolean;
  autoCutoffTime: string;
  reminderMinutesBeforeExit: number;
  targetCompliance: number;
  currency: 'USD' | 'INR';
  currencyRate: number; // conversion from USD
  activeChallenge: {
    enabled: boolean;
    title: string;
    description: string;
    multiplier: number;
    endsInDays: number;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
