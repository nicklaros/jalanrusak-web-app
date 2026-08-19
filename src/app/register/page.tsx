'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api/client';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi').max(255, 'Nama terlalu panjang'),
    email: z.string().email('Alamat email tidak valid'),
    password: z
      .string()
      .min(8, 'Kata sandi minimal 8 karakter')
      .regex(/[A-Z]/, 'Kata sandi harus mengandung huruf kapital')
      .regex(/[a-z]/, 'Kata sandi harus mengandung huruf kecil')
      .regex(/[0-9]/, 'Kata sandi harus mengandung angka'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setSuccess('Yeay, berhasil daftar! 🎉 Sebentar lagi kamu akan diarahkan ke halaman masuk...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string } } };
        setError(
          axiosError.response?.data?.message || axiosError.response?.data?.error || 'Duh, gagal daftar. Coba lagi ya!'
        );
      } else {
        setError('Duh, gagal daftar. Coba lagi ya!');
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JalanRusak</h1>
          <p className="text-gray-600">Yuk gabung dan bikin jalan makin aman! 🙌</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Bikin Akun Baru</h2>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('name')}
              id="name"
              label="Nama Lengkap"
              type="text"
              placeholder="Nama kamu siapa?"
              error={errors.name?.message}
              autoComplete="name"
            />

            <Input
              {...register('email')}
              id="email"
              label="Email"
              type="email"
              placeholder="Email kamu"
              error={errors.email?.message}
              autoComplete="email"
            />

            <Input
              {...register('password')}
              id="password"
              label="Kata Sandi"
              type="password"
              placeholder="Buat kata sandi yang kuat ya"
              error={errors.password?.message}
              autoComplete="new-password"
            />

            <Input
              {...register('confirmPassword')}
              id="confirmPassword"
              label="Konfirmasi Kata Sandi"
              type="password"
              placeholder="Ketik ulang kata sandi kamu"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Lagi bikin akun...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
