'use client';
import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  onClose?: () => void;
};

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed right-6 top-6 z-50 w-[360px] overflow-hidden rounded-md px-4 py-3 text-sm text-white shadow-md ${
        type === 'error' ? 'bg-red-600' : 'bg-blue-700'
      } ${visible ? 'animate-pulse' : ''}`}
    >
      <button className='absolute right-2 top-2 font-bold' onClick={onClose}>
        ×
      </button>
      <p className='pr-4'>{message}</p>
      <div className='mt-2 h-1 w-full bg-white/30'>
        <div className='h-1 bg-white animate-[shrink_5s_linear_forwards]' />
      </div>
    </div>
  );
}
