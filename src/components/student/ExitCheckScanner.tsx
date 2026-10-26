import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Room } from '../../types';
import { 
  Camera, 
  CameraOff, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Laptop
} from 'lucide-react';

interface ExitCheckScannerProps {
  rooms: Room[];
  onRoomScanned: (roomId: string) => void;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ExitCheckScanner: React.FC<ExitCheckScannerProps> = ({
  rooms,
  onRoomScanned,
  onShowToast,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [selectedFallbackRoomId, setSelectedFallbackRoomId] = useState(rooms[0]?.id || 'lab-101');
  const [camerasList, setCamerasList] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);

  // Helper to resolve scanned text to a Room ID
  const resolveRoomFromText = (text: string): Room | undefined => {
    const clean = text.trim().toLowerCase();
    
    // 1. Direct match with ID
    const byId = rooms.find((r) => r.id.toLowerCase() === clean);
    if (byId) return byId;

    // 2. Direct match with Code (e.g. SC-101, AB-204)
    const byCode = rooms.find((r) => r.code.toLowerCase() === clean);
    if (byCode) return byCode;

    // 3. Substring match or common patterns (e.g. "Lab-101" -> "lab-101")
    const sanitizedClean = clean.replace(/[^a-z0-9]/g, '');
    const bySanitized = rooms.find((r) => {
      const sanId = r.id.replace(/[^a-z0-9]/g, '');
      const sanCode = r.code.replace(/[^a-z0-9]/g, '');
      const sanName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return sanitizedClean.includes(sanId) || 
             sanitizedClean.includes(sanCode) || 
             sanId.includes(sanizedClean) ||
             sanCode.includes(sanitizedClean) ||
             sanName.includes(sanitizedClean);
    });

    if (bySanitized) return bySanitized;

    // Fallback: look for room number numbers (e.g. "101", "204", "304", "2")
    const matchNumber = clean.match(/\d+/);
    if (matchNumber) {
      const num = matchNumber[0];
      const byNum = rooms.find((r) => r.code.includes(num) || r.name.includes(num) || r.id.includes(num));
      if (byNum) return byNum;
    }

    return undefined;
  };

  // Handle successful QR detection
  const handleScanSuccess = (decodedText: string) => {
    setScannedText(decodedText);
    const matched = resolveRoomFromText(decodedText);

    if (matched) {
      // Stop scanner upon successful detection
      stopScanner();
      
      if (onShowToast) {
        onShowToast(
          'QR Code Recognized!',
          `Verified: ${matched.name} (${matched.code}). Opening exit checklist...`,
          'success'
        );
      }

      // Automatically open the interactive checklist modal for that specific room
      setTimeout(() => {
        onRoomScanned(matched.id);
      }, 400);
    } else {
      if (onShowToast) {
        onShowToast(
          'Unrecognized QR Code',
          `Scanned "${decodedText}", but no matching campus room was found.`,
          'warning'
        );
      }
    }
  };

  // Start the real webcam scanner via html5-qrcode
  const startScanner = async () => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setCameraError(null);
    setScannedText(null);

    const elementId = 'html5-qrcode-reader';
    const container = document.getElementById(elementId);
    if (!container) {
      isStartingRef.current = false;
      return;
    }

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(elementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
      }

      const qrScanner = html5QrCodeRef.current;

      // Get available cameras
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCamerasList(devices.map(d => ({ id: d.id, label: d.label || `Camera ${d.id}` })));
          if (!selectedCameraId) {
            setSelectedCameraId(devices[0].id);
          }
        }
      } catch {
        // Camera enumeration might be restricted, fallback to facingMode
      }

      const cameraConfig = selectedCameraId 
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: 'environment' };

      await qrScanner.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Frame parse error (silently ignore as normal during scan cycle)
        }
      );

      setIsScanning(true);
      isStartingRef.current = false;
    } catch (err: any) {
      isStartingRef.current = false;
      setIsScanning(false);
      const errMsg = err?.message || 'Unable to access webcam. Please check browser permissions or use the simulation fallback.';
      setCameraError(errMsg);
      if (onShowToast) {
        onShowToast('Webcam Not Available', 'Permission denied or no webcam detected. You can use the Simulate Scan fallback below.', 'info');
      }
    }
  };

  // Stop the scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch {
        // ignore clean-up errors
      }
    }
    setIsScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().then(() => {
            html5QrCodeRef.current?.clear();
          }).catch(() => {});
        } else {
          try {
            html5QrCodeRef.current.clear();
          } catch {}
        }
      }
    };
  }, []);

  // Trigger manual simulation fallback for a room
  const handleSimulateScan = (roomId: string) => {
    const target = rooms.find((r) => r.id === roomId) || rooms[0];
    setScannedText(`${target.code} • ${target.name}`);

    if (onShowToast) {
      onShowToast(
        'Simulated QR Scan Detected',
        `Recognized plaque for ${target.name}. Launching exit checklist...`,
        'success'
      );
    }

    setTimeout(() => {
      onRoomScanned(target.id);
    }, 350);
  };

  // Handle manual text code submission (e.g. student types "Lab-101")
  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;

    const matched = resolveRoomFromText(manualCodeInput);
    if (matched) {
      handleSimulateScan(matched.id);
      setManualCodeInput('');
    } else {
      if (onShowToast) {
        onShowToast(
          'Code Not Found',
          `Could not match "${manualCodeInput}" with any campus room code (e.g. Lab-101, SC-101).`,
          'error'
        );
      }
    }
  };

  const wastingRooms = rooms.filter(
    (r) => r.occupancy === 0 && (r.appliances.lights || r.appliances.ac || r.appliances.fans)
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6 p-5 sm:p-7">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-2">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            Live Hardware Scanner (`html5-qrcode`)
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ExitCheck: Classroom Doorway QR Scanner
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Scan the printed QR code plaque at the classroom doorway using your webcam, or use the simulation fallback.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isScanning ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Webcam Feed Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
              <CameraOff className="w-3.5 h-3.5 text-slate-400" />
              Scanner Standby
            </span>
          )}
        </div>
      </div>

      {/* WEBCAM SCANNER DISPLAY AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Cols: Video Stream Container */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col justify-between relative shadow-inner border border-slate-800">
          
          {/* Top Bar inside Camera view */}
          <div className="flex items-center justify-between z-10 mb-3 text-white">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-wide">Optical Target Viewport</span>
            </div>

            {camerasList.length > 1 && isScanning && (
              <select
                value={selectedCameraId}
                onChange={(e) => {
                  setSelectedCameraId(e.target.value);
                  stopScanner().then(() => startScanner());
                }}
                className="bg-slate-800 text-white text-[11px] px-2 py-1 rounded-lg border border-slate-700"
              >
                {camerasList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Video Stream Element for html5-qrcode */}
          <div className="relative min-h-[260px] sm:min-h-[300px] w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
            
            {/* The DOM element targeted by html5-qrcode */}
            <div 
              id="html5-qrcode-reader" 
              className="w-full h-full flex items-center justify-center overflow-hidden [&_video]:rounded-xl [&_video]:object-cover [&_video]:w-full [&_video]:max-h-[320px]"
            />

            {/* Standby Placeholder overlay when camera is not running */}
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/95 z-20">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center mb-3 shadow-lg">
                  <Camera className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  Webcam Scanner is Off
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Click below to turn on your device camera and scan physical classroom plaques.
                </p>

                {cameraError && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs text-left max-w-sm">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Camera Access Note</span>
                    </div>
                    <span className="text-[11px] leading-tight block">{cameraError}</span>
                    <span className="text-[10px] text-rose-400 mt-1 block">
                      &rarr; Use the manual simulation buttons on the right to test!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Viewfinder Target Graphic (when scanning) */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400" />
                  
                  {/* Sweeping optical line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-md shadow-emerald-400 animate-scan-sweep" />
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 z-10">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-detects QR codes in real time</span>
            </span>

            <div className="flex items-center gap-2">
              {isScanning ? (
                <button
                  type="button"
                  onClick={stopScanner}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CameraOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Stop Camera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startScanner}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Start Webcam Scanner</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Fallback & Simulated QR Testing Center */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Fallback Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-emerald-600" />
                <span>Simulate Scan (Webcam Fallback)</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                1-Click Testing
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              If your laptop or workstation doesn't have a camera active, select any room below to simulate scanning its door plaque.
            </p>

            {/* Quick Room Dropdown Simulator */}
            <div className="space-y-2 pt-1">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Choose Classroom to Simulate:
              </label>
              
              <div className="flex gap-2">
                <select
                  value={selectedFallbackRoomId}
                  onChange={(e) => setSelectedFallbackRoomId(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                >
                  {rooms.map((r) => {
                    const isWasting = r.occupancy === 0 && (r.appliances.lights || r.appliances.ac || r.appliances.fans);
                    return (
                      <option key={r.id} value={r.id}>
                        {r.code} • {r.name} {isWasting ? '⚠️ (Wasting)' : ''}
                      </option>
                    );
                  })}
                </select>

                <button
                  type="button"
                  onClick={() => handleSimulateScan(selectedFallbackRoomId)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Simulate
                </button>
              </div>
            </div>
          </div>

          {/* Quick Click Flagged Wasting Rooms */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block flex items-center justify-between">
              <span>Rooms Currently Wasting Power ({wastingRooms.length})</span>
              <span className="text-[11px] text-rose-600 font-bold">Needs Shutdown</span>
            </span>

            <div className="space-y-1.5">
              {wastingRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleSimulateScan(room.id)}
                  className="w-full text-left p-2.5 rounded-xl border border-rose-200/80 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 block truncate group-hover:text-rose-900">
                      {room.code} • {room.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {room.building} • Empty with appliances ON
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-white px-2 py-1 rounded-lg border border-rose-200 shadow-2xs shrink-0">
                    <span>Scan Door</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              ))}

              {wastingRooms.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  All rooms currently shut down cleanly!
                </div>
              )}
            </div>
          </div>

          {/* Manual Text Code Input */}
          <form onSubmit={handleManualCodeSubmit} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
            <input
              type="text"
              value={manualCodeInput}
              onChange={(e) => setManualCodeInput(e.target.value)}
              placeholder="Or type code (e.g. Lab-101)..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden text-xs"
            />
            <button
              type="submit"
              disabled={!manualCodeInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Scan
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
