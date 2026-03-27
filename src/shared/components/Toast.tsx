import { css, keyframes } from '@emotion/react';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const show = useCallback((options: ToastOptions) => {
    const id = Date.now();
    const duration = options.duration ?? 3000;

    setToasts(prev => [...prev, { ...options, id }]);

    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      timersRef.current.delete(id);
    }, duration);

    timersRef.current.set(id, timer);
  }, []);

  const success = useCallback(
    (message: string) => {
      show({ message, type: 'success' });
    },
    [show]
  );

  const error = useCallback(
    (message: string) => {
      show({ message, type: 'error' });
    },
    [show]
  );

  return (
    <ToastContext.Provider value={{ show, success, error }}>
      {children}
      {toasts.length > 0 &&
        createPortal(
          <div css={containerStyle}>
            {toasts.map(toast => (
              <div key={toast.id} css={toastStyle(toast.type ?? 'info')}>
                <Text typography="t6" fontWeight="medium" color={colors.white}>
                  {toast.message}
                </Text>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const containerStyle = css`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1100;
`;

const toastStyle = (type: ToastType) => css`
  padding: 14px 20px;
  border-radius: 12px;
  animation: ${slideUp} 0.2s ease-out;
  white-space: nowrap;

  ${type === 'success' &&
  css`
    background: ${colors.blue500};
  `}

  ${type === 'error' &&
  css`
    background: ${colors.red500};
  `}

  ${type === 'info' &&
  css`
    background: ${colors.grey800};
  `}
`;
