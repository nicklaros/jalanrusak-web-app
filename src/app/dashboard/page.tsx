'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api/client';

import type { DamagedRoadListResponse, UserProfile } from '@/lib/api/types';

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
          apiClient.listDamagedRoads({ per_page: 1 }),
          apiClient.listDamagedRoads({ status: 'submitted', per_page: 1 }),
          apiClient.listDamagedRoads({ status: 'verified', per_page: 1 }),
          apiClient.listDamagedRoads({ status: 'resolved', per_page: 1 }),
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
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="mt-2 text-gray-600">Here's an overview of road damage reports</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Reports</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
              <p className="text-sm text-gray-600 mt-1">Verified</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.repaired}</p>
              <p className="text-sm text-gray-600 mt-1">Repaired</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/reports/create">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">➕</span>
                  <h3 className="text-lg font-semibold text-gray-900">Create New Report</h3>
                  <p className="text-sm text-gray-600 mt-1">Report a new damaged road in your area</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/reports">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📝</span>
                  <h3 className="text-lg font-semibold text-gray-900">View All Reports</h3>
                  <p className="text-sm text-gray-600 mt-1">Browse and manage existing reports</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>

        {/* Info Section */}
        <Card title="About JalanRusak" className="mt-8">
          <div className="prose max-w-none">
            <p className="text-gray-700">
              JalanRusak is a citizen-driven platform that helps improve road infrastructure in Indonesia. By reporting
              damaged roads, you're helping local authorities identify and prioritize repairs, making our roads safer
              for everyone.
            </p>
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-gray-900">How it works:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Click "Create New Report" to submit a road damage report</li>
                <li>Mark the damaged area on the map by clicking to add GPS coordinates</li>
                <li>Add photos and details about the damage</li>
                <li>Submit your report for verification</li>
                <li>Track the status as authorities address the issue</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
