import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">JalanRusak</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Laporkan Jalan Rusak, Wujudkan Infrastruktur Lebih Baik
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Report damaged roads in your area and help local authorities prioritize repairs. Together, we can make
            Indonesian roads safer for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="primary" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">GPS Location</h3>
            <p className="text-gray-600">Mark exact locations of damaged roads with precise GPS coordinates</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">Photo Evidence</h3>
            <p className="text-gray-600">Upload photos to document the extent of road damage</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor the status of your reports from submission to repair</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Create an Account</h4>
                <p className="text-gray-600">Sign up with your email to get started</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Submit a Report</h4>
                <p className="text-gray-600">
                  Mark the damaged area on the map, add photos, and provide details about the damage
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Track Status</h4>
                <p className="text-gray-600">
                  Your report will be verified by authorities and you can track the repair progress
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 JalanRusak. Making Indonesian roads safer, one report at a time.</p>
        </div>
      </div>
    </main>
  );
}
