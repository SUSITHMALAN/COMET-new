import React, { useEffect } from 'react';
import { useToasts } from '../../hooks/useToast';

export default function Toast() {
  const { toasts, subscribe } = useToasts();

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`flex items-center gap-3 p-4 bg-surface-container border-2 min-w-[280px] shadow-2xl fade-in ${
            t.type === 'success' ? 'border-secondary' : 
            t.type === 'error' ? 'border-primary' : 
            'border-white'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${
            t.type === 'success' ? 'text-secondary' : 
            t.type === 'error' ? 'text-primary' : 
            'text-white'
          }`}>
            {t.type === 'success' ? 'check_circle' : 
             t.type === 'error' ? 'error' : 
             'info'}
          </span>
          <span className="text-label-caps text-white">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
