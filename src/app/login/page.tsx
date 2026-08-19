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

const loginSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await apiClient.login(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Email atau kata sandi salah nih. Coba lagi ya!');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JalanRusak</h1>
          <p className="text-gray-600">Yuk, laporkan jalan rusak di sekitar kamu! 🚧</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hai, selamat datang! 👋</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('email')}
              id="email"
              label="Email"
              type="email"
              placeholder="Ketik email kamu"
              error={errors.email?.message}
              autoComplete="email"
            />

            <Input
              {...register('password')}
              id="password"
              label="Kata Sandi"
              type="password"
              placeholder="Ketik kata sandi kamu"
              error={errors.password?.message}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between mb-6">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Lupa kata sandi?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Lagi masuk...' : 'Masuk Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Daftar yuk!
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
