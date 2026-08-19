'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/api/client';

import type { AreaLevel, TopAreaEntry } from '@/lib/api/types';

const LEVELS: { key: AreaLevel; label: string; description: string }[] = [
  { key: 'province', label: 'Provinsi', description: 'Peringkat per provinsi' },
  { key: 'city', label: 'Kota / Kabupaten', description: 'Peringkat per kota atau kabupaten' },
  { key: 'district', label: 'Kecamatan', description: 'Peringkat per kecamatan' },
  { key: 'subdistrict', label: 'Kelurahan / Desa', description: 'Peringkat per kelurahan atau desa' },
];

export default function TopAreasPage() {
  const [activeLevel, setActiveLevel] = useState<AreaLevel>('province');
  const [data, setData] = useState<Record<AreaLevel, TopAreaEntry[]>>({
    province: [],
    city: [],
    district: [],
    subdistrict: [],
  });
  const [loading, setLoading] = useState<Record<AreaLevel, boolean>>({
    province: true,
    city: true,
    district: true,
    subdistrict: true,
  });
  const [errors, setErrors] = useState<Record<AreaLevel, string | null>>({
    province: null,
    city: null,
    district: null,
    subdistrict: null,
  });

  useEffect(() => {
    const levels: AreaLevel[] = ['province', 'city', 'district', 'subdistrict'];
    levels.forEach((level) => {
      apiClient
        .getTopDamagedAreas(level)
        .then((res) => {
          setData((prev) => ({ ...prev, [level]: res.data }));
        })
        .catch(() => {
          setErrors((prev) => ({ ...prev, [level]: 'Gagal memuat data' }));
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, [level]: false }));
        });
    });
  }, []);

  const activeEntries = data[activeLevel];
  const isLoading = loading[activeLevel];
  const error = errors[activeLevel];

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-4xl mb-3">😤</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Papan Malu Jalan Rusak</h1>
          <p className="text-red-100 text-lg">
            10 wilayah dengan laporan jalan rusak terkonfirmasi terbanyak yang belum diperbaiki
          </p>
          <p className="text-red-200 text-sm mt-2">
            Data mencakup laporan berstatus <strong>terverifikasi</strong> dan <strong>menunggu perbaikan</strong>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Level tabs */}
        <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1 mb-8 overflow-x-auto">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.key}
              onClick={() => setActiveLevel(lvl.key)}
              className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeLevel === lvl.key ? 'bg-red-700 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Level description */}
        <p className="text-gray-500 text-sm mb-4 text-center">
          {LEVELS.find((l) => l.key === activeLevel)?.description}
        </p>

        {/* Rankings */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">{error}</div>
        )}

        {!isLoading && !error && activeEntries.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-600 font-medium">Belum ada data laporan terkonfirmasi</p>
            <p className="text-gray-400 text-sm mt-1">Wilayah ini bersih dari jalan rusak terkonfirmasi!</p>
          </div>
        )}

        {!isLoading && !error && activeEntries.length > 0 && (
          <div className="space-y-3">
            {activeEntries.map((entry) => (
              <div
                key={entry.code}
                className={`bg-white rounded-xl shadow-sm flex items-center gap-4 px-5 py-4 ${
                  entry.rank <= 3 ? 'border-l-4 border-red-500' : ''
                }`}
              >
                {/* Rank */}
                <span className={`text-2xl font-bold w-8 text-center ${getMedalColor(entry.rank)}`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </span>

                {/* Area info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{entry.name ?? entry.code}</p>
                  {entry.name && <p className="text-xs text-gray-400 font-mono">{entry.code}</p>}
                </div>

                {/* Count */}
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-red-600">{entry.report_count}</p>
                  <p className="text-xs text-gray-400">laporan</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 underline">
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}
