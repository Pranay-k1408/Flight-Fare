import React, { useEffect } from 'react';
import { X, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
      <div 
        className="px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold max-w-md"
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-base)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        {icons[toast.type || 'info']}
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
