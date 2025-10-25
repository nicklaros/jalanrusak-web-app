'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { apiClient } from '@/lib/api/client';

import type { PointDTO } from '@/lib/api/types';

const reportSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  subdistrict_code: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/, 'Invalid subdistrict code format (e.g., 35.10.02.2005)'),
  description: z.string().max(500, 'Description is too long').optional(),
  photo_urls: z.string().min(1, 'At least one photo URL is required'),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function CreateReportPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState<PointDTO[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]); // Default: Jakarta
  const [locationError, setLocationError] = useState<string>('');

  // Get user's current location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Could not get your location. Using default map center.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    if (points.length === 0) {
      setError('Please add at least one point on the map to mark the damaged road location');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Split photo URLs by newline or comma
      const photoUrls = data.photo_urls
        .split(/[,\n]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (photoUrls.length === 0) {
        setError('Please provide at least one photo URL');
        setIsLoading(false);
        return;
      }

      await apiClient.createDamagedRoad({
        title: data.title,
        subdistrict_code: data.subdistrict_code,
        path_points: points,
        photo_urls: photoUrls,
        description: data.description,
      });

      router.push('/dashboard/reports');
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || 'Failed to submit report. Please try again.');
      } else {
        setError('Failed to submit report. Please try again.');
      }
      console.error('Submit report error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Damaged Road</h1>
          <p className="mt-2 text-gray-600">Help improve road conditions by reporting damage in your area</p>
        </div>

        <Card>
          {locationError && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">{locationError}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('title')}
              id="title"
              label="Report Title"
              type="text"
              placeholder="e.g., Jalan berlubang di depan SDN 01"
              error={errors.title?.message}
              helperText="Brief description of the damage"
            />

            <Input
              {...register('subdistrict_code')}
              id="subdistrict_code"
              label="Subdistrict Code"
              type="text"
              placeholder="e.g., 35.10.02.2005"
              error={errors.subdistrict_code?.message}
              helperText="Indonesian administrative area code (format: XX.XX.XX.XXXX)"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Damage Location Path</label>
              <p className="text-xs text-gray-500 mb-2">
                Click on the map to add points marking the damaged road. The map is centered on your current location.
              </p>
              <MapPicker points={points} onPointsChange={setPoints} center={mapCenter} zoom={15} />
            </div>

            <Textarea
              {...register('photo_urls')}
              id="photo_urls"
              label="Photo URLs"
              rows={4}
              placeholder="Enter photo URLs (one per line or comma-separated)&#10;https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
              error={errors.photo_urls?.message}
              helperText="Provide URLs to photos showing the damage (at least one required)"
            />

            <Textarea
              {...register('description')}
              id="description"
              label="Additional Description (Optional)"
              rows={4}
              placeholder="e.g., Jalan berlubang sepanjang 50 meter, berbahaya untuk sepeda motor"
              error={errors.description?.message}
              helperText="Provide additional context or details about the damage"
            />

            <div className="flex gap-4">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
