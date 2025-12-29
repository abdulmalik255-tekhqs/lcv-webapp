import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import CustomToast from '@/pages/Admin/admin-investors/CustomToast';
import { CustomErrorToast } from '@/components/shared/CustomErrorToast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map(toast => 
      toast.id === id ? { ...toast, isClosing: true } : toast
    ));
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300); // Match animation duration
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id, isClosing: false };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    if (toast.autoClose !== false) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 3000);
    }

    return id;
  }, [removeToast]);

  const showBottomRightToast = useCallback((title, subtitle, options = {}) => {
    return addToast({
      type: 'success',
      title,
      subtitle,
      position: 'bottom-right',
      ...options,
    });
  }, [addToast]);

  const showErrorToast = useCallback((title, subtitle, options = {}) => {
    return addToast({
      type: 'error',
      title,
      subtitle,
      position: 'bottom-right',
      ...options,
    });
  }, [addToast]);

  const showSuccessToast = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      title: message,
      position: 'top-right',
      ...options,
    });
  }, [addToast]);

  const showInfoToast = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      title: message,
      position: 'bottom-right',
      ...options,
    });
  }, [addToast]);

  const showWarningToast = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      title: message,
      position: 'top-right',
      ...options,
    });
  }, [addToast]);

  const showCustomToast = useCallback((message, options = {}) => {
    return addToast({
      type: 'custom',
      title: message,
      position: 'top-right',
      ...options,
    });
  }, [addToast]);

  const value = {
    showBottomRightToast,
    showErrorToast,
    showSuccessToast,
    showInfoToast,
    showWarningToast,
    showCustomToast,
  };

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'bottom-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <>
          {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
            <div
              key={position}
              className={`fixed z-[9999] flex flex-col gap-2 ${getPositionClasses(position)}`}
              style={{ pointerEvents: 'none' }}
            >
              {positionToasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`toast-item ${toast.isClosing ? 'toast-closing' : 'toast-entering'}`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {toast.type === 'error' ? (
                    <CustomErrorToast
                      title={toast.title}
                      subtitle={toast.subtitle}
                      closeToast={() => removeToast(toast.id)}
                    />
                  ) : toast.type === 'success' || toast.type === 'info' || toast.type === 'custom' ? (
                    <CustomToast
                      title={toast.title}
                      subtitle={toast.subtitle}
                      closeToast={() => removeToast(toast.id)}
                    />
                  ) : (
                    <CustomToast
                      title={toast.title}
                      subtitle={toast.subtitle}
                      closeToast={() => removeToast(toast.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

const getPositionClasses = (position) => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  return positions[position] || positions['bottom-right'];
};
