export interface RoomData {
  id: string;
  name: string;
  wing: string;
  floor: string;
  building: string;
  status: 'wastage' | 'occupied' | 'normal';
  statusLabel: string;
  occupancyText: string;
  occupancyCount: number;
  powerDrawKw: number;
  appliancesActive: string;
  appliancesDetail: string;
  percentLoad: number;
  subText: string;
  smartBreakerBank: string;
  breakers: {
    id: string;
    name: string;
    status: 'on' | 'off' | 'eco' | 'locked';
    powerWatts: number;
    detail: string;
    canToggle: boolean;
    canEco?: boolean;
  }[];
  recentAudits: {
    time: string;
    text: string;
    type: 'normal' | 'badge' | 'anomaly';
  }[];
}

export interface AnomalyItem {
  id: string;
  zone: string;
  severity: 'High' | 'Medium' | 'Quick Fix';
  building: string;
  issue: string;
  overdrawText: string;
  overdrawSubtext: string;
  rootCause: string;
  varianceText: string;
  actionText: string;
  actionIcon: string;
  isResolved: boolean;
}

export interface DepartmentCohort {
  rank: number;
  department: string;
  section: string;
  studentsCount: number;
  building: string;
  complianceRate: number;
  avgKwhStudent: number;
  ecoScore: number;
  award: string;
  trend: string;
  awardType: 'gold' | 'silver' | 'bronze' | 'steady' | 'warning';
}

export interface EcoBotMessage {
  id: string;
  sender: 'user' | 'bot';
  senderName: string;
  time: string;
  avatarText?: string;
  text: string;
  actionSteps?: string[];
  repPoints?: string;
}

export interface EcoTask {
  id: string;
  title: string;
  reportedTime: string;
  savingText: string;
  status: 'Auto-Resolved' | 'Facility Team' | 'Investigating';
  statusColor: string;
  icon: string;
}
