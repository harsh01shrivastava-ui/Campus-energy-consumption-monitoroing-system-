import React, { useState } from 'react';
import { Room, EcoBotMessage } from '../../types';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  CornerDownLeft, 
  MessageSquare
} from 'lucide-react';

interface EcoBotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onReportIncident: (text: string, parsedRoomId: string, urgency: 'Critical' | 'High' | 'Normal') => string;
}

export const EcoBotDrawer: React.FC<EcoBotDrawerProps> = ({
  isOpen,
  onClose,
  rooms,
  onReportIncident,
}) => {
  const [messages, setMessages] = useState<EcoBotMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "👋 Hi! I'm EcoBot. See an appliance left running or a room wasting energy? Describe it below and I'll dispatch a live ticket directly to the Maintenance staff.",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Projector left on in Seminar Hall 2',
    'AC running in Chemistry Lab 101',
    'Exhaust fans on in Computer Lab 2',
    'Lights on in empty Lecture Hall B',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: EcoBotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Parse room from text
    const lower = text.toLowerCase();
    let matchedRoom = rooms.find((r) => 
      lower.includes(r.name.toLowerCase()) || 
      lower.includes(r.code.toLowerCase()) ||
      (lower.includes('seminar') && r.id.includes('seminar')) ||
      (lower.includes('chem') && r.id.includes('lab-101')) ||
      (lower.includes('comp') && r.id.includes('comp-lab'))
    ) || rooms[0];

    const urgency: 'Critical' | 'High' | 'Normal' = 
      lower.includes('ac') || lower.includes('chiller') ? 'Critical' :
      lower.includes('projector') || lower.includes('heater') ? 'High' : 'Normal';

    setTimeout(() => {
      const ticketId = onReportIncident(text, matchedRoom.id, urgency);

      const botReply: EcoBotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `⚡ Ticket #${ticketId} created for ${matchedRoom.name} (${urgency} Urgency). The field maintenance queue has been alerted, and you've been awarded +5 Class Eco-Points!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketId,
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              EcoBot Quick Reporter
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400">
              Grassroots Anomaly & Wastage Dispatcher
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close EcoBot Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
        {messages.map((m) => {
          const isBot = m.sender === 'bot';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isBot
                    ? 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
                    : 'bg-emerald-600 text-white font-medium shadow-xs'
                }`}
              >
                {m.text}

                {m.ticketId && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dispatched to Field Crew</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs p-2">
            <Bot className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
            <span className="text-[11px]">EcoBot is dispatching ticket...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Reports */}
      <div className="p-3 bg-white border-t border-slate-100">
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
          Tap Quick Report Suggestion:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-left transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe room or appliance issue..."
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
          title="Send Report"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
