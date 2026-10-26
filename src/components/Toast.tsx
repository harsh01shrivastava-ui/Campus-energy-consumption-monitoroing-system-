import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const iconName =
          toast.type === 'success'
            ? 'check_circle'
            : toast.type === 'error'
            ? 'error'
            : toast.type === 'warning'
            ? 'warning'
            : 'info';

        const colorClasses =
          toast.type === 'success'
            ? 'bg-primary text-on-primary border-primary-container'
            : toast.type === 'error'
            ? 'bg-error text-on-error border-error-container'
            : toast.type === 'warning'
            ? 'bg-[#d97706] text-white border-amber-600'
            : 'bg-inverse-surface text-inverse-on-surface border-outline';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${colorClasses}`}
          >
            <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
              {iconName}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight">{toast.title}</div>
              {toast.description && (
                <div className="text-xs opacity-90 mt-0.5 leading-snug">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
              aria-label="Dismiss toast"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
