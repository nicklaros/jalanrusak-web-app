'use client';

import { useState } from 'react';

import { apiClient } from '@/lib/api/client';

type State = 'idle' | 'locating' | 'submitting' | 'success' | 'error';

interface QuickReportButtonProps {
  onSuccess?: (reportId: string) => void;
}

export function QuickReportButton({ onSuccess }: QuickReportButtonProps) {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    if (state === 'locating' || state === 'submitting') return;

    setState('locating');
    setMessage('');

    let coords: GeolocationCoordinates;
    try {
      coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not supported by your browser'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(new Error(err.message)),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Could not get your location');
      return;
    }

    setState('submitting');

    const now = new Date();
    const title = `Laporan Jalan Rusak - ${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;

    try {
      const report = await apiClient.createDamagedRoad({
        title,
        path_points: [{ lat: coords.latitude, lng: coords.longitude }],
      });

      setState('success');
      setMessage('Laporan berhasil dikirim!');
      onSuccess?.(report.id);

      // Reset to idle after 4 seconds
      setTimeout(() => {
        setState('idle');
        setMessage('');
      }, 4000);
    } catch (err) {
      setState('error');
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setMessage(axiosErr.response?.data?.error || 'Gagal mengirim laporan. Coba lagi.');
    }
  };

  const buttonConfig = {
    idle: {
      label: 'Laporkan Jalan Rusak di Sini',
      disabled: false,
      className: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
    },
    locating: { label: 'Mendapatkan lokasi...', disabled: true, className: 'bg-red-400 cursor-not-allowed' },
    submitting: { label: 'Mengirim laporan...', disabled: true, className: 'bg-red-400 cursor-not-allowed' },
    success: { label: '✓ Laporan terkirim!', disabled: true, className: 'bg-green-600 cursor-default' },
    error: {
      label: 'Laporkan Jalan Rusak di Sini',
      disabled: false,
      className: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
    },
  }[state];

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={buttonConfig.disabled}
        className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-colors duration-150 ${buttonConfig.className}`}
      >
        {state === 'locating' || state === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {buttonConfig.label}
          </span>
        ) : (
          buttonConfig.label
        )}
      </button>
      {message && (
        <p className={`text-sm text-center ${state === 'error' ? 'text-red-600' : 'text-green-700'}`}>{message}</p>
      )}
      {state === 'idle' && (
        <p className="text-xs text-gray-500 text-center">Menggunakan GPS Anda saat ini. Tidak perlu mengisi form.</p>
      )}
    </div>
  );
}
