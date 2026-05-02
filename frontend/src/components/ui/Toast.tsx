import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useToasts } from '../../hooks/useToast';

export default function Toast() {
  const { toasts, subscribe } = useToasts();

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle size={18} color="var(--success)" />}
          {t.type === 'error' && <XCircle size={18} color="var(--error)" />}
          {t.type === 'info' && <Info size={18} color="#3b82f6" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
