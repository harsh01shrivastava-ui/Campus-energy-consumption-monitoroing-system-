import React, { useState } from 'react';
import { Room, StudentClassProfile } from '../../types';
import { ClassScorecard } from './ClassScorecard';
import { QRChecklistModal } from './QRChecklistModal';
import { ExitCheckScanner } from './ExitCheckScanner';
import { EcoBotDrawer } from './EcoBotDrawer';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Camera, 
  MessageSquarePlus, 
  Sparkles, 
  Building2, 
  Trophy, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  ShieldCheck,
  QrCode
} from 'lucide-react';

interface StudentDashboardProps {
  rooms: Room[];
  profile: StudentClassProfile;
  onSubmitCompliance: (roomId: string, items: {
    lights: boolean;
    fans: boolean;
    ac: boolean;
    projector: boolean;
    doors: boolean;
  }) => void;
  onReportIncident: (text: string, parsedRoomId: string, urgency: 'Critical' | 'High' | 'Normal') => string;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  rooms,
  profile,
  onSubmitCompliance,
  onReportIncident,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'scorecard' | 'rooms'>('scanner');
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isEcoBotOpen, setIsEcoBotOpen] = useState(false);
  const [scannedRoomId, setScannedRoomId] = useState<string>(
    rooms.find(r => r.occupancy === 0 && (r.appliances.lights || r.appliances.ac))?.id || rooms[0].id
  );

  const assignedRooms = rooms.filter((r) => r.assignedClass === profile.className);
  const wastingRooms = rooms.filter((r) => r.occupancy === 0 && (r.appliances.lights || r.appliances.ac));

  // Handle room detected from real webcam QR scanner or manual simulation fallback
  const handleRoomScanned = (roomId: string) => {
    setScannedRoomId(roomId);
    setIsChecklistModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Grassroots Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-emerald-700/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-xs border border-white/20 text-emerald-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Class Representative Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Lead {profile.className} to Sustainability First Place
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Scan your classroom doorway QR plaque with your webcam when dismissing class. The system automatically opens the exit checklist to power down lights and AC.
          </p>

          {/* Quick Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
                activeTab === 'scanner'
                  ? 'bg-white text-emerald-900 shadow-black/10'
                  : 'bg-emerald-800/90 hover:bg-emerald-800 text-white border border-white/20'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Launch Webcam Scanner</span>
            </button>

            <button
              onClick={() => setIsEcoBotOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-emerald-300" />
              <span>Report Wastage via EcoBot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Internal Student Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>ExitCheck Webcam Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('scorecard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'scorecard'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Class Scorecard & Badges</span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rooms'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>Assigned Classrooms ({assignedRooms.length})</span>
        </button>
      </div>

      {/* TAB 1: WEBCAM SCANNER (REAL HTML5-QRCODE COMPONENT & SIMULATION FALLBACK) */}
      {activeTab === 'scanner' && (
        <ExitCheckScanner
          rooms={rooms}
          onRoomScanned={handleRoomScanned}
          onShowToast={onShowToast}
        />
      )}

      {/* TAB 2: CLASS SCORECARD */}
      {activeTab === 'scorecard' && (
        <ClassScorecard profile={profile} />
      )}

      {/* TAB 3: ASSIGNED CLASSROOMS */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Rooms Assigned to {profile.className}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ensure appliances are shut off upon leaving each period
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {assignedRooms.length} Active Venues
              </span>
            </div>

            <div className="space-y-3">
              {assignedRooms.map((room) => {
                const isWasting = room.occupancy === 0 && (room.appliances.lights || room.appliances.ac || room.appliances.fans);
                return (
                  <div
                    key={room.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isWasting
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-slate-50/60 border-slate-200/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{room.name}</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                          {room.code}
                        </span>
                        <StatusBadge status={isWasting ? 'wasting' : 'normal'} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {room.building} • {room.occupancy === 0 ? 'Empty (0)' : `${room.occupancy} Students inside`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <span className="text-slate-400 block text-[10px]">Compliance</span>
                        <strong className="text-slate-900 font-mono">{room.complianceScore}%</strong>
                      </div>

                      <button
                        onClick={() => handleRoomScanned(room.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-emerald-800 border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Log Exit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Empty Rooms Running Now</span>
                </h4>
                <span className="text-xs font-bold text-rose-600 font-mono">
                  {wastingRooms.length} Flagged
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {wastingRooms.map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block truncate">{r.name}</span>
                      <span className="text-[10px] text-slate-500">{r.building}</span>
                    </div>
                    <button
                      onClick={() => handleRoomScanned(r.id)}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 shrink-0 cursor-pointer"
                    >
                      Quick Fix &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
              <span className="font-bold block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                CR Weekly Challenge Active:
              </span>
              <p className="text-[11px] text-emerald-800 mt-1">
                Every verified classroom exit before 18:00 earns 2x points toward the Annual Department Green Cup!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE CHECKLIST MODAL FOR SCANNED ROOM */}
      <QRChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        rooms={rooms}
        targetRoomId={scannedRoomId}
        onSubmitCompliance={onSubmitCompliance}
      />

      {/* Floating EcoBot Drawer */}
      <EcoBotDrawer
        isOpen={isEcoBotOpen}
        onClose={() => setIsEcoBotOpen(false)}
        rooms={rooms}
        onReportIncident={onReportIncident}
      />

      {/* Floating EcoBot Trigger Pill */}
      {!isEcoBotOpen && (
        <button
          onClick={() => setIsEcoBotOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xl border border-slate-700 cursor-pointer animate-bounce duration-1000"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Report Wastage (EcoBot)</span>
        </button>
      )}

    </div>
  );
};
