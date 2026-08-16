'use client';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

import { fetchRoadRoute } from '@/lib/map/routing';

import type { PointDTO } from '@/lib/api/types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  points: PointDTO[];
  center?: [number, number];
  zoom?: number;
}

export function MapView({ points, center, zoom = 15 }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (points.length >= 2) {
      fetchRoadRoute(points).then(setRouteCoords);
    } else {
      setRouteCoords([]);
    }
  }, [points]);

  if (!isMounted) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Calculate center from points if not provided
  const mapCenter: [number, number] =
    center || (points.length > 0 ? [points[0]!.lat, points[0]!.lng] : [-6.2088, 106.8456]);

  return (
    <MapContainer center={mapCenter} zoom={zoom} className="h-96 rounded-lg z-0" scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map((point, index) => (
        <Marker key={index} position={[point.lat, point.lng]} />
      ))}

      {routeCoords.length > 1 && <Polyline positions={routeCoords} color="red" weight={3} opacity={0.7} />}
    </MapContainer>
  );
}
