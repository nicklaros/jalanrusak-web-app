'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api/client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await apiClient.forgotPassword(data);
      setSuccess(true);
    } catch (err) {
      setError('Hmm, gagal kirim email. Coba lagi ya!');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JalanRusak</h1>
          <p className="text-gray-600">Tenang, kita bantu reset! 😊</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lupa Kata Sandi?</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success ? (
            <div className="mb-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-6">
                <p className="text-sm text-green-600">
                  Kalau emailmu terdaftar, kita udah kirim link reset kata sandi. Cek inbox atau folder spam kamu ya! 📩
                </p>
              </div>
              <Link href="/login">
                <Button variant="primary" fullWidth>
                  Kembali ke Halaman Masuk
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Masukin emailmu dan kita kirimin link buat reset kata sandi kamu.
              </p>

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

                <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                  {isLoading ? 'Lagi kirim...' : 'Kirim Link Reset'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
