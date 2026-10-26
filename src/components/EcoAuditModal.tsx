import React, { useState, useEffect } from 'react';

interface EcoAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const EcoAuditModal: React.FC<EcoAuditModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [scanStep, setScanStep] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  const scanSteps = [
    'Pinging 28 sub-meter IoT telemetry gateways across Science Complex...',
    'Checking HVAC setpoint compliance vs ASHRAE 55-2023 comfort baseline...',
    'Evaluating lighting sensor daylight harvesting & occupancy PIR logs...',
    'Analyzing off-peak standby vampire loads on Smart Breaker Banks 01-14...',
    'Synthesis complete: 3 critical wastage anomalies isolated & queued for intervention.',
  ];

  useEffect(() => {
    if (!isOpen) {
      setScanStep(0);
      setIsScanning(true);
      return;
    }

    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        } else {
          setIsScanning(false);
          clearInterval(interval);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyRemediation = () => {
    onShowToast('Automated Eco Remediation Triggered', 'Shed 7.90 kW of unoccupied auxiliary load across Floor 3.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-outline-variant/30 flex flex-col">
        {/* Header */}
        <div className="p-space-lg bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">energy_savings_leaf</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Campus Neural Eco Audit
              </h3>
              <p className="text-xs text-on-surface-variant">Science Complex • Sub-Meter Cluster Zone 3</p>
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

        {/* Content */}
        <div className="p-space-lg flex flex-col gap-space-md">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-on-surface flex items-center gap-1.5">
                {isScanning && <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>}
                {isScanning ? 'Real-Time Sensor Telemetry Sweep' : 'Audit Analysis Ready'}
              </span>
              <span className="text-primary">{Math.round(((scanStep + 1) / scanSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Terminal / Status Steps Box */}
          <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-2 font-mono text-xs text-on-surface">
            {scanSteps.slice(0, scanStep + 1).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-secondary font-bold">✓</span>
                <span className={idx === scanStep && isScanning ? 'text-primary font-semibold' : 'text-on-surface-variant'}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Audit Results Summary (visible when complete) */}
          {!isScanning && (
            <div className="bg-secondary-container/30 border border-secondary/30 p-3.5 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-primary uppercase tracking-wide">
                  Identified Optimization Potential
                </span>
                <span className="font-bold text-sm text-secondary">7.90 kW Wastage</span>
              </div>
              <ul className="text-xs text-on-surface space-y-1 list-disc list-inside">
                <li>Lab 304: HVAC running at 19°C in empty room (overdraw 3.2 kW)</li>
                <li>East Wing Computer Lab 2: 18 high-wattage desktop units in sleep bypass</li>
                <li>Main Corridor: Stairwell daylight sensor can safely dim another 15%</li>
              </ul>
              <div className="text-[11px] text-on-surface-variant pt-1 border-t border-secondary/20">
                Potential financial recovery: <strong>$38.40/day</strong> ($14,016/academic year).
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-space-md bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors shadow-xs"
          >
            Close
          </button>
          {!isScanning && (
            <button
              type="button"
              onClick={handleApplyRemediation}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
              <span>Execute Automated Eco Fix</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
