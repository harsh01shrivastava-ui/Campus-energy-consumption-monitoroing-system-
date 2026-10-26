import React, { useState } from 'react';
import { EcoBotMessage, EcoTask } from '../types';
import { INITIAL_CHAT_MESSAGES, INITIAL_ECO_TASKS } from '../data/mockData';

interface ChecklistsReportsProps {
  onOpenQRModal: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ChecklistsReports: React.FC<ChecklistsReportsProps> = ({
  onOpenQRModal,
  onShowToast,
}) => {
  // Mobile Checklist State
  const [checklist, setChecklist] = useState([
    {
      id: 'c1',
      title: 'Ceiling & Accent Lights',
      desc: 'All dual banks powered down at main panel',
      offset: '-0.4 kW',
      checked: true,
      pendingNote: null,
    },
    {
      id: 'c2',
      title: 'Split AC / Climate Control Units',
      desc: 'Thermostats off, condenser fan stopped',
      offset: '-1.8 kW',
      checked: true,
      pendingNote: null,
    },
    {
      id: 'c3',
      title: 'Ceiling Laser Projector',
      desc: 'Cool-down cycle',
      offset: 'Pending',
      checked: false,
      pendingNote: 'Still in cool-down cycle - turning off in 2 mins',
    },
    {
      id: 'c4',
      title: 'Windows & Fire Exit Latches',
      desc: 'Preventing thermal envelope leakage',
      offset: 'Sealed',
      checked: true,
      pendingNote: null,
    },
    {
      id: 'c5',
      title: 'Lectern & Station Monitors',
      desc: 'Master podium circuit tripped',
      offset: '-0.15 kW',
      checked: true,
      pendingNote: null,
    },
  ]);

  const [hasSubmittedChecklist, setHasSubmittedChecklist] = useState(false);
  const [ecoPoints, setEcoPoints] = useState(485);
  const [photoName, setPhotoName] = useState('LH204_exit_1845.jpg');

  // EcoBot Chat & Tasks
  const [messages, setMessages] = useState<EcoBotMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [tasks, setTasks] = useState<EcoTask[]>(INITIAL_ECO_TASKS);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Compute checklist stats
  const completedCount = checklist.filter((i) => i.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newChecked = !item.checked;
          onShowToast(
            newChecked ? `Checked: ${item.title}` : `Unchecked: ${item.title}`,
            `Shift protocol updated for Lecture Hall 204.`,
            'info'
          );
          return {
            ...item,
            checked: newChecked,
            pendingNote: newChecked ? null : item.pendingNote,
          };
        }
        return item;
      })
    );
  };

  const handleSubmitChecklist = () => {
    if (completedCount < 4) {
      onShowToast('Incomplete Checklist', 'Please complete at least 4 items before final sign-off.', 'warning');
      return;
    }

    setHasSubmittedChecklist(true);
    setEcoPoints((prev) => prev + 50);
    onShowToast(
      'Exit Walkthrough Submitted! (+50 EcoPoints)',
      'Verified location lock logged. Energy abatement ledger updated.',
      'success'
    );
  };

  const handleRetakeSnap = () => {
    setPhotoName(`LH204_exit_${new Date().getMinutes()}${new Date().getSeconds()}.jpg`);
    onShowToast('New photo verification captured', 'Updated in-app lens proof token.', 'success');
  };

  const handleSendChatMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: EcoBotMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      senderName: 'CR Alex R.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarText: 'AR',
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsBotTyping(true);

    // Realistic EcoBot automatic triage
    setTimeout(() => {
      setIsBotTyping(false);
      const isAc = text.toLowerCase().includes('ac') || text.toLowerCase().includes('temp');
      const isLights = text.toLowerCase().includes('light');
      const taskId = `#ECO-${Math.floor(100 + Math.random() * 900)}`;

      const botReply: EcoBotMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        senderName: 'EcoBot Dispatch',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Understood! I've triaged your report "${text}". Real-time campus telemetry confirms an abnormal draw. Executing protocol:`,
        actionSteps: [
          `1. Created Emergency Eco Task ${taskId}.`,
          `2. Sent IoT relay override signal to ${isAc ? 'HVAC setpoint controller' : isLights ? 'smart breaker bank' : 'zone submeter'}.`,
          `3. Notified campus facilities duty team.`,
        ],
        repPoints: '+15 Community Rep',
      };

      setMessages((prev) => [...prev, botReply]);

      // Add task to tasks list
      const newTask: EcoTask = {
        id: taskId,
        title: text.length > 35 ? text.substring(0, 35) + '...' : text,
        reportedTime: 'Just now',
        savingText: 'Energy Saved: ~1.1 kWh',
        status: 'Auto-Resolved',
        statusColor: 'text-secondary bg-surface-container-lowest',
        icon: isAc ? 'ac_unit' : isLights ? 'lightbulb' : 'bolt',
      };

      setTasks((prev) => [newTask, ...prev]);
      onShowToast(`EcoBot created Task ${taskId}`, 'Auto-shutdown signal dispatched to circuit.', 'success');
    }, 1000);
  };

  const handleDownloadAuditPdf = () => {
    const reportText =
      'ECOTRACK CAMPUS CORE - WEEKLY AUDIT SUMMARY\n' +
      '==========================================\n' +
      `Date: ${new Date().toLocaleDateString()}\n` +
      'Lead Auditor: Alex Rivera (CR Lead)\n' +
      'Campus Section: Section B • Electrical Engineering\n' +
      'Room: Lecture Hall 204 • Block A (Submeter #A-204)\n\n' +
      'CHECKLIST VERIFICATIONS:\n' +
      '- Ceiling & Accent Lights: PASSED (-0.4 kW)\n' +
      '- Split AC Climate Units: PASSED (-1.8 kW)\n' +
      '- Laser Projector: CYCLE COMPLETE\n' +
      '- Windows & Fire Exit Latches: SEALED\n' +
      '- Lectern Monitors: POWERED DOWN (-0.15 kW)\n\n' +
      'Overall Compliance Score: 100%\n' +
      'Institutional CO2 Avoidance: 34.2 kWh equivalent\n';

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'EcoTrack_Weekly_Audit_LH204.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Audit Report Generated', 'Downloaded formatted compliance summary ledger.', 'success');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Context Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Active Verification Shift
            </span>
            <span className="font-label-sm text-label-sm text-outline">|</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Evening Protocols (18:00 - 21:00)</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Exit Walkthrough Checklists &amp; EcoBot Assistant
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Class Representative (CR) closing routines, instant QR validations, and natural language energy reporting.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            type="button"
            onClick={onOpenQRModal}
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-xs border border-outline-variant/30 transition-all cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">qr_code_2</span>
            <span>Generate Room QR</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadAuditPdf}
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Weekly Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Primary Asymmetric Split Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT 6 COLS: Simulated Mobile-First Card View */}
        <div className="lg:col-span-6 flex flex-col items-center w-full">
          <div className="w-full flex items-center justify-between mb-space-sm px-space-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">phone_iphone</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Mobile Field Execution
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-full border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Simulating PWA Client
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
            </div>
          </div>

          {/* Smartphone Viewport Chassis */}
          <div className="w-full max-w-[460px] bg-surface-container-lowest rounded-2xl shadow-xl p-space-md flex flex-col relative overflow-hidden border border-outline-variant/30">
            {/* Ambient Status Ribbon */}
            <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low px-space-sm py-2 rounded-xl border border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-bold text-primary">Alex Rivera (CR Lead)</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Section B • Electrical Engineering
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
                  {ecoPoints} pts
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-xs">
                  Today, 18:45
                </span>
              </div>
            </div>

            {/* Room Scanned Verification Badge Tile */}
            <div className="bg-primary-container text-on-primary-container p-space-md rounded-xl shadow-sm mb-space-md relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[110px]">qr_code_scanner</span>
              </div>
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-secondary-container uppercase tracking-wider font-bold">
                    Verified Location Lock
                  </span>
                  <span className="inline-flex items-center gap-1 bg-primary/40 text-on-primary-container px-2 py-0.5 rounded-full text-label-sm font-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-ping"></span> Live QR
                  </span>
                </div>
                <div className="font-headline-sm text-headline-sm text-white font-bold">
                  Lecture Hall 204 • Block A
                </div>
                <div className="flex items-center gap-space-sm mt-2 text-white/80 font-body-sm text-body-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">sensors</span> 4 Smart Sensors
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">bolt</span> Submeter #A-204
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist Instruction Bar */}
            <div className="flex items-center justify-between mb-space-sm px-1">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Walkthrough Protocol ({completedCount} of {checklist.length} complete)
              </span>
              <span className="font-label-sm text-label-sm text-primary font-bold">{progressPercent}% Ready</span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-space-md">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist Items Container */}
            <div className="flex flex-col gap-2.5 mb-space-md">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`flex items-start gap-space-sm p-space-sm rounded-xl transition-colors cursor-pointer border ${
                    item.checked
                      ? 'bg-surface-container-low hover:bg-surface-container border-outline-variant/15'
                      : 'bg-surface-container-high border-outline-variant/30'
                  }`}
                >
                  <input
                    checked={item.checked}
                    onChange={() => {}} // handled by div
                    className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                    type="checkbox"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        {item.title}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-label-sm font-label-sm px-1.5 py-0.5 rounded font-semibold ${
                          item.checked
                            ? 'text-secondary bg-surface-container-lowest'
                            : 'text-error bg-error-container/40'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${item.checked ? 'bg-secondary' : 'bg-error animate-pulse'}`}
                        ></span>
                        {item.offset}
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{item.desc}</p>
                    {item.pendingNote && (
                      <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-lowest/80 p-1.5 rounded">
                        <span className="material-symbols-outlined text-[14px] text-error">info</span>
                        <span>{item.pendingNote}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Photo Evidence Box */}
            <div className="bg-surface-container-low p-space-sm rounded-xl mb-space-md border border-outline-variant/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  Photo Verification (Optional)
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">1 photo attached</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-sm flex-shrink-0 bg-surface-container border border-outline-variant/30">
                  <img
                    className="w-full h-full object-cover"
                    alt="Dark contemporary university lecture hall at dusk with ceiling lights switched off"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAOKVQNnNjUTwjZMyGwdO4zJvmjoewYDWFISFtYWJUNrH2Qznfd7263Ss5gJjQJL2cEKqvUF_Cge_GzS-jtdpGrN4X0h0I2kGToUfqwMc1g9oMqWLubFvyD7MxtqQMdy1hYUI8KeGt9BhXicn0z6qwdMapj63T3s0RWRQaX96fjprfDtB7g1uWQZ4e8uIU3WD4N4VDYqmCswXpcdFK9ALzt6aYgcwZkKeJ9dE1vrgce740t9FRTxgSKA"
                  />
                  <span className="absolute top-1 right-1 bg-primary text-on-primary rounded-full p-0.5 leading-none">
                    <span className="material-symbols-outlined text-[10px]">check</span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-label-sm text-label-sm font-semibold text-on-surface truncate">
                    {photoName}
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Captured via in-app lens</div>
                  <button
                    type="button"
                    onClick={handleRetakeSnap}
                    className="mt-1 font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer"
                  >
                    Retake Snap
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Checklist CTA */}
            <button
              type="button"
              onClick={handleSubmitChecklist}
              disabled={hasSubmittedChecklist}
              className={`w-full py-3 px-space-md rounded-xl font-label-md text-label-md font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                hasSubmittedChecklist
                  ? 'bg-secondary text-white opacity-90'
                  : 'bg-primary text-on-primary hover:bg-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {hasSubmittedChecklist ? 'check_circle' : 'task_alt'}
              </span>
              <span>
                {hasSubmittedChecklist
                  ? '✓ Verified & Logged (+50 EcoPoints)'
                  : 'Submit Exit Checklist (+50 EcoPoints)'}
              </span>
            </button>

            {/* Compliance Banner Footer */}
            <div className="mt-space-md pt-space-xs text-center">
              <div className="inline-flex items-center gap-1.5 bg-secondary-container/40 text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[16px] text-secondary">workspace_premium</span>
                <span>Yesterday&apos;s compliance score: 100% across all 5 classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 6 COLS: EcoBot Conversational Energy Reporter & Automated Tasks */}
        <div className="lg:col-span-6 flex flex-col gap-space-lg w-full">
          {/* Top Card: EcoBot Conversational Chat Drawer */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col border border-outline-variant/30">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container bg-surface-container-low -mx-space-lg -mt-space-lg p-space-md rounded-t-2xl">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">smart_toy</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      EcoBot Energy Assistant
                    </span>
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Powered by Campus IoT Engine • Active Sub-meters
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-label-sm text-label-sm bg-surface-container text-on-surface px-2.5 py-1 rounded-lg font-semibold border border-outline-variant/20">
                  Telemetry Synced
                </span>
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex flex-col gap-space-md mb-space-md overflow-y-auto max-h-[340px] pr-1">
              <div className="text-center my-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant/15">
                  Session opened via Walkthrough Portal • Instant Action Mode
                </span>
              </div>

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isUser ? 'justify-end' : ''}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary flex-shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                      </div>
                    )}

                    <div
                      className={`p-space-md shadow-xs flex flex-col gap-1.5 ${
                        isUser
                          ? 'bg-primary text-on-primary rounded-2xl rounded-tr-xs max-w-[85%]'
                          : 'bg-surface-container-low text-on-surface rounded-2xl rounded-tl-xs max-w-[90%] border border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isUser ? 'text-white/90' : 'text-primary'}`}>
                          {msg.senderName}
                        </span>
                        <span className={`text-[11px] ${isUser ? 'text-white/70' : 'text-on-surface-variant'}`}>
                          {msg.time}
                        </span>
                      </div>

                      <p className="font-body-sm text-body-sm leading-relaxed">{msg.text}</p>

                      {msg.actionSteps && (
                        <div className="flex flex-col gap-1.5 my-1">
                          {msg.actionSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-lg text-body-sm font-body-sm border border-outline-variant/15"
                            >
                              <span className="material-symbols-outlined text-secondary text-[18px]">
                                {idx === 0 ? 'assignment_add' : idx === 1 ? 'forward_to_inbox' : 'timer'}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.repPoints && (
                        <div className="flex items-center justify-between pt-1 border-t border-surface-container/60 text-xs">
                          <span className="font-label-sm text-label-sm text-secondary font-bold">
                            Thank you for conserving campus power!
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                            {msg.repPoints}
                          </span>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-label-sm font-bold flex-shrink-0">
                        {msg.avatarText || 'CR'}
                      </div>
                    )}
                  </div>
                );
              })}

              {isBotTyping && (
                <div className="flex items-center gap-2 text-xs text-on-surface-variant pl-9">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-200"></span>
                  <span>EcoBot is verifying sub-meter live telemetry...</span>
                </div>
              )}
            </div>

            {/* Suggestion Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-space-sm mb-space-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0 font-medium">
                Quick report:
              </span>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Lights on in empty Hall 202')}
                className="font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface whitespace-nowrap transition-colors cursor-pointer border border-outline-variant/20 font-medium"
              >
                💡 Lights on in empty hall
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('AC temperature set below 20°C in Room 104')}
                className="font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface whitespace-nowrap transition-colors cursor-pointer border border-outline-variant/20 font-medium"
              >
                ❄️ AC temp below 20°C
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Laboratory equipment left running post-hours in Physics Wing')}
                className="font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface whitespace-nowrap transition-colors cursor-pointer border border-outline-variant/20 font-medium"
              >
                ⚡ Equipment running post-hours
              </button>
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="relative flex items-center"
            >
              <input
                className="w-full h-11 pl-4 pr-24 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/30 shadow-inner"
                placeholder='Report energy waste (e.g., "AC running in empty Room 201")...'
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Attach Photo"
                  onClick={handleRetakeSnap}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                </button>
                <button
                  type="submit"
                  aria-label="Send Report"
                  className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Card: Live Energy Tasks Generated by EcoBot */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">troubleshoot</span>
                <div className="flex flex-col">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Live Energy Tasks Generated by EcoBot
                  </h2>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Real-time status of student-flagged and AI-triaged anomalies
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-primary bg-primary-fixed px-2.5 py-1 rounded-full font-bold">
                {tasks.length} Active Dispatches
              </span>
            </div>

            {/* Task Table List */}
            <div className="flex flex-col gap-space-sm">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors gap-space-sm border border-outline-variant/15"
                >
                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">{task.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-label-md font-bold text-on-surface">{task.id}</span>
                        <span className="font-body-sm text-body-sm font-bold text-on-surface">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-label-sm text-label-sm">
                        <span>{task.reportedTime}</span>
                        <span>•</span>
                        <span className="text-secondary font-semibold">{task.savingText}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span
                      className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2.5 py-1 rounded-full shadow-xs font-bold ${
                        task.status === 'Auto-Resolved'
                          ? 'text-secondary bg-surface-container-lowest'
                          : task.status === 'Facility Team'
                          ? 'text-on-surface bg-surface-container-lowest'
                          : 'text-error bg-error-container/40'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          task.status === 'Auto-Resolved'
                            ? 'bg-secondary'
                            : task.status === 'Facility Team'
                            ? 'bg-outline'
                            : 'bg-error animate-ping'
                        }`}
                      ></span>
                      {task.status}
                    </span>
                    <button
                      type="button"
                      aria-label="Details"
                      onClick={() => onShowToast(`Task ${task.id} Details`, `${task.title} • ${task.savingText}`, 'info')}
                      className="w-7 h-7 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Metric / Summary Banner */}
            <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-xs text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">energy_savings_leaf</span>
                <span>
                  Total automated energy abatement today: <strong className="text-on-surface font-bold">34.2 kWh</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownloadAuditPdf}
                className="text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View Complete Audit Ledger</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
