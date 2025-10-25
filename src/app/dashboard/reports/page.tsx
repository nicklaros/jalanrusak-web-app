'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api/client';

import type { DamagedRoadResponse } from '@/lib/api/types';

export default function ReportsListPage() {
  const [reports, setReports] = useState<DamagedRoadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchReports = async (page: number, status?: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.listDamagedRoads({
        page,
        per_page: 10,
        ...(status && { status }),
      });

      setReports(response.data);
      // Calculate total pages from pagination meta
      const totalPages = Math.ceil(response.pagination.total / response.pagination.limit);
      setTotalPages(totalPages);
      setCurrentPage(response.pagination.page);
    } catch (err) {
      setError('Failed to load reports. Please try again.');
      console.error('Fetch reports error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1, statusFilter);
  }, [statusFilter]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'repaired':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Damage Reports</h1>
            <p className="mt-2 text-gray-600">View and manage road damage reports</p>
          </div>
          <Link href="/dashboard/reports/create">
            <Button variant="primary">Create New Report</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <div className="flex gap-4 items-center">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="repaired">Repaired</option>
            </select>
          </div>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No reports found</p>
              <Link href="/dashboard/reports/create">
                <Button variant="primary">Create Your First Report</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(report.status)}`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>
                          <span className="font-medium">Subdistrict Code:</span> {report.subdistrict_code}
                        </p>
                        <p>
                          <span className="font-medium">Points:</span> {report.path.coordinates.length} location
                          {report.path.coordinates.length > 1 ? 's' : ''} marked
                        </p>
                        <p>
                          <span className="font-medium">Photos:</span> {report.photo_urls.length} attached
                        </p>
                        <p>
                          <span className="font-medium">Submitted:</span> {format(new Date(report.created_at), 'PPpp')}
                        </p>
                      </div>

                      {report.description && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{report.description}</p>
                      )}

                      <Link href={`/dashboard/reports/${report.id}`}>
                        <Button variant="secondary">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <Button
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => fetchReports(currentPage - 1, statusFilter)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => fetchReports(currentPage + 1, statusFilter)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
