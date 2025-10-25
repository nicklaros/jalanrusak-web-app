'use client';

import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { MapView } from '@/components/map/MapView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api/client';

import type { DamagedRoadResponse, PointDTO } from '@/lib/api/types';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<DamagedRoadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Convert geometry coordinates to PointDTO format
  // Backend returns [longitude, latitude] pairs, convert to {latitude, longitude}
  const pathPoints = useMemo<PointDTO[]>(() => {
    if (!report?.path?.coordinates) return [];
    return report.path.coordinates.map((coord) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));
  }, [report]);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await apiClient.getDamagedRoad(reportId);
        setReport(data);
      } catch (err) {
        setError('Failed to load report details. Please try again.');
        console.error('Fetch report error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="secondary" onClick={() => router.back()}>
              ← Back
            </Button>
          </div>
          <Card>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error || 'Report not found'}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="secondary" onClick={() => router.back()}>
            ← Back to Reports
          </Button>
        </div>

        <Card>
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(report.status)}`}>
                {report.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Report ID:</span> {report.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Subdistrict Code:</span> {report.subdistrict_code}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Submitted:</span> {format(new Date(report.created_at), 'PPpp')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Last Updated:</span> {format(new Date(report.updated_at), 'PPpp')}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Author ID:</span> {report.author_id}
                </p>
              </div>
            </div>
          </div>

          {report.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">{report.description}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location Map</h2>
            <MapView points={pathPoints} />
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Coordinates ({pathPoints.length} points):</span>
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {pathPoints.map((point, index) => (
                  <p key={index} className="text-xs text-gray-600 font-mono">
                    Point {index + 1}: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Photos ({report.photo_urls.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.photo_urls.map((url, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img src={url} alt={`Damage photo ${index + 1}`} className="w-full h-64 object-cover" />
                  <div className="p-2 bg-gray-50">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 break-all"
                    >
                      {url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
