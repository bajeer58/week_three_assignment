import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const VARIANTS = {
  error: {
    icon: XCircle,
    classes: 'bg-red-600 text-white'
  },
  success: {
    icon: CheckCircle2,
    classes: 'bg-emerald-600 text-white'
  },
  info: {
    icon: Info,
    classes: 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
  }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'error') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const variant = VARIANTS[t.type] || VARIANTS.error;
          const Icon = variant.icon;
          return (
            <div
              key={t.id}
              className={`animate-slide-up flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-elevated ${variant.classes}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-1 shrink-0 rounded-full p-0.5 opacity-70 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
