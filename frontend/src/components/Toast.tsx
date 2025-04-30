import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number; // ms
}

const toastColors: Record<ToastType, string> = {
  success: '#2ecc71',
  error: '#e74c3c',
  info: '#3498db',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      style={{
        minWidth: 240,
        maxWidth: 400,
        margin: '0 auto',
        background: toastColors[type],
        color: '#fff',
        padding: '1em 1.5em',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'fixed',
        left: '50%',
        bottom: 40,
        transform: 'translateX(-50%)',
        zIndex: 9999,
        fontWeight: 600,
        fontSize: '1.05em',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'opacity 0.3s',
      }}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.2em',
          marginLeft: 'auto',
          cursor: 'pointer',
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast; 