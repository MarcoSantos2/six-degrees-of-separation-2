import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast, { ToastType } from './Toast';

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastState {
  message: string;
  type: ToastType;
  duration: number;
  id: number;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    setToasts((prev) => [...prev, { message, type, duration, id: idCounter }]);
    setIdCounter((id) => id + 1);
  }, [idCounter]);

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => handleClose(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}; 