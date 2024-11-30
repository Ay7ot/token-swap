'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error';

interface Toast {
    id: number;
    message: ReactNode;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: ReactNode, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: ReactNode, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Remove toast after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            p-4 rounded-xl shadow-lg backdrop-blur-xl animate-fade-in max-w-md
                            ${toast.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                                : 'bg-red-500/10 border border-red-500/20 text-red-500'
                            }
                        `}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}