import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const toastTypeStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const toastIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

export function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aguarda a animação terminar
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-md transform transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          flex items-center p-4 rounded-lg border shadow-lg
          ${toastTypeStyles[type]}
        `}
      >
        <span className="flex-shrink-0 mr-2">
          {toastIcons[type]}
        </span>
        <p className="flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-4 hover:opacity-75"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>,
    document.body
  );
}

// Gerenciador de Toast
interface ToastManager {
  show: (message: string, type?: ToastType, duration?: number) => void;
}

let toastManager: ToastManager;

export function createToastManager(): ToastManager {
  if (toastManager) return toastManager;

  let currentToast: { close: () => void } | null = null;

  toastManager = {
    show(message, type = 'info', duration = 3000) {
      // Fecha o toast atual se existir
      if (currentToast) {
        currentToast.close();
      }

      // Cria um novo elemento para o toast
      const container = document.createElement('div');
      document.body.appendChild(container);

      const close = () => {
        document.body.removeChild(container);
        currentToast = null;
      };

      currentToast = { close };

      const toast = (
        <Toast
          message={message}
          type={type}
          duration={duration}
          onClose={close}
        />
      );

      // Renderiza o novo toast
      createPortal(toast, container);
    },
  };

  return toastManager;
}
