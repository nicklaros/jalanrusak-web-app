'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { QuickReportButton } from '@/components/ui/QuickReportButton';
import { apiClient } from '@/lib/api/client';

import type { UserProfile } from '@/lib/api/types';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<{ total: number; pending: number; verified: number; repaired: number }>({
    total: 0,
    pending: 0,
    verified: 0,
    repaired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [profile, allReports, submittedReports, verifiedReports, resolvedReports] = await Promise.all([
          apiClient.getProfile(),
          apiClient.listDamagedRoads({ limit: 1 }),
          apiClient.listDamagedRoads({ status: 'submitted', limit: 1 }),
          apiClient.listDamagedRoads({ status: 'verified', limit: 1 }),
          apiClient.listDamagedRoads({ status: 'resolved', limit: 1 }),
        ]);

        setUser(profile);
        setStats({
          total: allReports.pagination.total,
          pending: submittedReports.pagination.total,
          verified: verifiedReports.pagination.total,
          repaired: resolvedReports.pagination.total,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Sebentar ya, lagi loading... ⌛</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
          <p className="mt-2 text-gray-600">Ini ringkasan laporan jalan rusak kamu</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Laporan</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 mt-1">Menunggu</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
              <p className="text-sm text-gray-600 mt-1">Terverifikasi</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.repaired}</p>
              <p className="text-sm text-gray-600 mt-1">Diperbaiki</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Aksi Cepat">
          <div className="mb-4">
            <QuickReportButton />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/reports/create">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="text-center">
                  <span className="text-2xl mb-1 block">📝</span>
                  <h3 className="text-sm font-semibold text-gray-900">Laporan Lengkap</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Isi detail, foto, dan peta</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/reports">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="text-center">
                  <span className="text-2xl mb-1 block">📋</span>
                  <h3 className="text-sm font-semibold text-gray-900">Semua Laporan</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Lihat dan kelola laporan</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>

        {/* Info Section */}
        <Card title="Tentang JalanRusak" className="mt-8">
          <div className="prose max-w-none">
            <p className="text-gray-700">
              JalanRusak adalah platform warga buat melaporkan jalan rusak di Indonesia. Dengan laporan kamu, dinas
              terkait bisa tahu mana yang perlu diperbaiki duluan — biar jalan makin aman buat semua! 🚗
            </p>
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-gray-900">Gimana caranya:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Klik &quot;Buat Laporan Baru&quot; buat ngirim laporan jalan rusak</li>
                <li>Tandain area rusak di peta dengan klik untuk tambahin titik GPS</li>
                <li>Tambahin foto dan detail kerusakan</li>
                <li>Kirim laporan kamu buat diverifikasi</li>
                <li>Pantau statusnya sampai jalan diperbaiki!</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
