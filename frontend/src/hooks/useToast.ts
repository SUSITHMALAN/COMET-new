import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach(l => l([...currentToasts]));
}

export function showToast(message: string, type: Toast['type'] = 'info') {
  const id = Math.random().toString(36).slice(2);
  currentToasts = [...currentToasts, { id, message, type }];
  notifyListeners();
  setTimeout(() => {
    currentToasts = currentToasts.filter(t => t.id !== id);
    notifyListeners();
  }, 3500);
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const subscribe = useCallback(() => {
    const listener = (t: Toast[]) => setToasts(t);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  return { toasts, subscribe };
}
