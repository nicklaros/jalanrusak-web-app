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
  title: z.string().min(3, 'Judul minimal 3 karakter').max(100, 'Judul terlalu panjang'),
  subdistrict_code: z
    .string()
    .regex(/^(\d{2}\.\d{2}\.\d{2}\.\d{4})?$/, 'Format kode kelurahan tidak valid (mis. 35.10.02.2005)')
    .optional()
    .or(z.literal('')),
  description: z.string().max(500, 'Deskripsi terlalu panjang').optional(),
  photo_urls: z.string().optional(),
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
          setLocationError('Lokasi kamu nggak bisa diakses. Pakai peta default dulu ya.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Browser kamu belum support geolokasi nih.');
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
      setError('Tandai dulu lokasi jalan rusaknya di peta ya!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Split photo URLs by newline or comma
      const photoUrls = data.photo_urls
        ? data.photo_urls
            .split(/[,\n]/)
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
        : [];

      await apiClient.createDamagedRoad({
        title: data.title,
        ...(data.subdistrict_code ? { subdistrict_code: data.subdistrict_code } : {}),
        path_points: points,
        ...(photoUrls.length > 0 ? { photo_urls: photoUrls } : {}),
        description: data.description,
      });

      router.push('/dashboard/reports');
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || 'Aduh, laporan gagal terkirim. Coba lagi ya!');
      } else {
        setError('Aduh, laporan gagal terkirim. Coba lagi ya!');
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
          <h1 className="text-3xl font-bold text-gray-900">Laporkan Jalan Rusak</h1>
          <p className="mt-2 text-gray-600">Bantu bikin jalan makin aman dengan laporan kamu! 🙌</p>
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
              label="Judul Laporan"
              type="text"
              placeholder="mis. Jalan berlubang di depan SDN 01"
              error={errors.title?.message}
              helperText="Ceritain singkat kerusakannya"
            />

            <Input
              {...register('subdistrict_code')}
              id="subdistrict_code"
              label="Kode Kelurahan (Opsional)"
              type="text"
              placeholder="mis. 35.10.02.2005"
              error={errors.subdistrict_code?.message}
              helperText="Format: XX.XX.XX.XXXX — boleh dikosongkan dulu"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jalur Lokasi Kerusakan</label>
              <p className="text-xs text-gray-500 mb-2">
                Klik di peta buat tandain lokasi jalan rusak. Peta udah di-set ke lokasi kamu sekarang.
              </p>
              <MapPicker points={points} onPointsChange={setPoints} center={mapCenter} zoom={15} />
            </div>

            <Textarea
              {...register('photo_urls')}
              id="photo_urls"
              label="URL Foto (Opsional)"
              rows={4}
              placeholder="Masukkan URL foto (satu per baris atau dipisahkan koma)&#10;https://example.com/foto1.jpg"
              error={errors.photo_urls?.message}
              helperText="Lampirin foto biar laporannya makin kuat 📸"
            />

            <Textarea
              {...register('description')}
              id="description"
              label="Deskripsi Tambahan (Opsional)"
              rows={4}
              placeholder="mis. Jalan berlubang sepanjang 50 meter, berbahaya untuk sepeda motor"
              error={errors.description?.message}
              helperText="Ceritain lebih lengkap kalau ada info tambahan"
            />

            <div className="flex gap-4">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Lagi kirim...' : 'Kirim Laporan 🚀'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
