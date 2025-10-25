'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api/client';

import type { UserProfile } from '@/lib/api/types';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!apiClient.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const profile = await apiClient.getProfile();
        setUser(profile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } finally {
      router.push('/login');
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/reports', label: 'Reports', icon: '📝' },
    { href: '/dashboard/reports/create', label: 'New Report', icon: '➕' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">JalanRusak</h1>
              </Link>

              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {user && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">{user.role}</span>
                </div>
              )}
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 px-4 py-3">
              {user && (
                <div className="text-sm text-gray-700 mb-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
              <Button variant="secondary" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
