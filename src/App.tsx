/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, NavPath } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { CampusMapRooms } from './components/CampusMapRooms';
import { ChecklistsReports } from './components/ChecklistsReports';
import { LeaderboardAnalytics } from './components/LeaderboardAnalytics';
import { GenerateQRModal } from './components/GenerateQRModal';
import { EcoAuditModal } from './components/EcoAuditModal';
import { Toast, ToastMessage } from './components/Toast';
import { INITIAL_ROOMS } from './data/mockData';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavPath>('overview-dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('304');
  const [currentCampusLoad, setCurrentCampusLoad] = useState<number>(42.8);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isEcoAuditModalOpen, setIsEcoAuditModalOpen] = useState(false);

  const showToast = (
    title: string,
    desc?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description: desc,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectRoomFromAnywhere = (roomId: string) => {
    setSelectedRoomId(roomId);
    setCurrentPath('campus-map-rooms');
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Fixed Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentKw={currentCampusLoad}
      />

      {/* Main Content Area Pushed by Sidebar (pl-0 on mobile, pl-72 on desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          currentPath={currentPath}
          onNavigate={(path) => setCurrentPath(path)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onSelectRoom={handleSelectRoomFromAnywhere}
          onShowToast={showToast}
        />

        {/* Viewport Content */}
        <main className="relative pt-16 w-full px-space-md lg:px-space-lg py-space-lg bg-surface min-h-[calc(100vh-4rem)] flex-1">
          {currentPath === 'overview-dashboard' && (
            <OverviewDashboard
              onNavigate={(path) => setCurrentPath(path)}
              onShowToast={showToast}
              onSelectRoom={handleSelectRoomFromAnywhere}
            />
          )}

          {currentPath === 'campus-map-rooms' && (
            <CampusMapRooms
              rooms={INITIAL_ROOMS}
              selectedRoomId={selectedRoomId}
              onSelectRoom={(id) => setSelectedRoomId(id)}
              onOpenEcoAudit={() => setIsEcoAuditModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentPath === 'checklists-reports' && (
            <ChecklistsReports
              onOpenQRModal={() => setIsQRModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentPath === 'analytics-anomalies' && (
            <LeaderboardAnalytics
              onShowToast={showToast}
              initialTab="analytics"
            />
          )}

          {currentPath === 'leaderboard' && (
            <LeaderboardAnalytics
              onShowToast={showToast}
              initialTab="leaderboard"
            />
          )}
        </main>
      </div>

      {/* Floating Modals */}
      <GenerateQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onShowToast={showToast}
      />

      <EcoAuditModal
        isOpen={isEcoAuditModalOpen}
        onClose={() => setIsEcoAuditModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
