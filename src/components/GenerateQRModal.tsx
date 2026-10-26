import React, { useState } from 'react';

interface GenerateQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const GenerateQRModal: React.FC<GenerateQRModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [selectedRoom, setSelectedRoom] = useState('LH204');

  if (!isOpen) return null;

  const roomOptions = [
    { code: 'LH204', name: 'Lecture Hall 204 • Block A', submeter: 'Submeter #A-204', floor: 'Floor 2' },
    { code: 'LAB304', name: 'Lab 304 • Chemistry Lab', submeter: 'Submeter #SCI-304', floor: 'Science Floor 3' },
    { code: 'LH101', name: 'Lecture Hall 101 • Organic Chem', submeter: 'Submeter #SCI-101', floor: 'Science Floor 1' },
    { code: 'COMP2', name: 'Computer Lab 2 • CAD Bays', submeter: 'Submeter #ENG-202', floor: 'East Wing Floor 2' },
    { code: 'SEM-B', name: 'Seminar Room B', submeter: 'Submeter #SCI-302', floor: 'Science Floor 3' },
  ];

  const currentRoom = roomOptions.find((r) => r.code === selectedRoom) || roomOptions[0];

  const handlePrint = () => {
    onShowToast('Print dialog triggered', `Dispatched official station placard for ${currentRoom.name}`, 'success');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://ecotrack.campus.edu/verify/${currentRoom.code}`);
    onShowToast('Verification URL copied', 'PWA deep link copied to clipboard', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-outline-variant/30 flex flex-col">
        {/* Modal Header */}
        <div className="p-space-lg bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Generate Station QR
              </h3>
              <p className="text-xs text-on-surface-variant">Class Representative Walkthrough Lock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg flex flex-col gap-space-md">
          {/* Select Room */}
          <div>
            <label className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold block mb-1">
              Select Campus Facility & Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {roomOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.name} ({opt.submeter})
                </option>
              ))}
            </select>
          </div>

          {/* QR Code Placard Preview Card */}
          <div className="bg-gradient-to-br from-primary via-primary-container to-secondary p-4 rounded-xl text-on-primary shadow-md flex flex-col items-center justify-center relative overflow-hidden">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              {/* Scalable SVG representation of a clean QR Code */}
              <svg className="w-40 h-40" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background */}
                <rect width="160" height="160" fill="white" />
                {/* Corner markers */}
                <rect x="10" y="10" width="40" height="40" rx="4" fill="#0f5238" />
                <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
                <rect x="22" y="22" width="16" height="16" rx="1" fill="#0f5238" />

                <rect x="110" y="10" width="40" height="40" rx="4" fill="#0f5238" />
                <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
                <rect x="122" y="22" width="16" height="16" rx="1" fill="#0f5238" />

                <rect x="10" y="110" width="40" height="40" rx="4" fill="#0f5238" />
                <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
                <rect x="22" y="122" width="16" height="16" rx="1" fill="#0f5238" />

                {/* Data blocks */}
                <rect x="60" y="15" width="8" height="8" fill="#116c4a" />
                <rect x="75" y="15" width="8" height="8" fill="#0f5238" />
                <rect x="90" y="15" width="8" height="8" fill="#116c4a" />
                <rect x="60" y="30" width="15" height="8" fill="#0f5238" />
                <rect x="85" y="30" width="10" height="8" fill="#0f5238" />

                <rect x="15" y="60" width="10" height="10" fill="#0f5238" />
                <rect x="35" y="65" width="15" height="8" fill="#116c4a" />
                <rect x="55" y="55" width="25" height="15" fill="#0f5238" />
                <rect x="85" y="60" width="15" height="10" fill="#116c4a" />
                <rect x="115" y="60" width="12" height="12" fill="#0f5238" />
                <rect x="135" y="65" width="10" height="8" fill="#116c4a" />

                <rect x="55" y="80" width="10" height="10" fill="#0f5238" />
                <rect x="75" y="75" width="15" height="15" fill="#2d6a4f" />
                <rect x="100" y="80" width="10" height="10" fill="#0f5238" />
                <rect x="120" y="85" width="15" height="8" fill="#116c4a" />

                <rect x="60" y="110" width="10" height="15" fill="#116c4a" />
                <rect x="75" y="105" width="20" height="10" fill="#0f5238" />
                <rect x="105" y="115" width="10" height="10" fill="#116c4a" />
                <rect x="125" y="110" width="20" height="15" fill="#0f5238" />
                <rect x="60" y="135" width="15" height="10" fill="#0f5238" />
                <rect x="85" y="130" width="15" height="15" fill="#116c4a" />
                <rect x="110" y="135" width="30" height="10" fill="#0f5238" />

                {/* Central Leaf Icon */}
                <circle cx="80" cy="80" r="14" fill="#ffffff" />
                <path
                  d="M80 72 C85 76 87 81 83 85 C80 88 75 87 74 83 C73 80 76 75 80 72 Z"
                  fill="#0f5238"
                />
              </svg>
            </div>

            <div className="text-center mt-3">
              <div className="font-bold text-sm text-surface-bright">{currentRoom.name}</div>
              <div className="text-xs text-on-primary-container opacity-90 mt-0.5">
                {currentRoom.submeter} • {currentRoom.floor}
              </div>
              <div className="inline-flex items-center gap-1 mt-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>
                Instant Auth Lock Enabled
              </div>
            </div>
          </div>

          <div className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg leading-relaxed flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
              info
            </span>
            <span>
              Mount this placard next to the primary exit door. Class Representatives scan with their mobile
              browser to unlock the 5-point evening energy shutdown sequence.
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-space-md bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors shadow-xs"
          >
            Copy QR Link
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Station Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
