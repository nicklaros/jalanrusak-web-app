'use client';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet';

import type { PointDTO } from '@/lib/api/types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapPickerProps {
  points: PointDTO[];
  onPointsChange: (points: PointDTO[]) => void;
  center?: [number, number];
  zoom?: number;
}

function MapClickHandler({
  onPointsChange,
  points,
}: {
  onPointsChange: (points: PointDTO[]) => void;
  points: PointDTO[];
}) {
  useMapEvents({
    click(e) {
      const newPoint: PointDTO = {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      };
      onPointsChange([...points, newPoint]);
    },
  });
  return null;
}

export function MapPicker({ points, onPointsChange, center = [-6.2088, 106.8456], zoom = 13 }: MapPickerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemovePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    onPointsChange(newPoints);
  };

  if (!isMounted) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div>
      <MapContainer center={center} zoom={zoom} className="h-96 rounded-lg z-0" scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onPointsChange={onPointsChange} points={points} />

        {points.map((point, index) => (
          <Marker key={index} position={[point.latitude, point.longitude]} />
        ))}

        {points.length > 1 && (
          <Polyline positions={points.map((p) => [p.latitude, p.longitude])} color="red" weight={3} opacity={0.7} />
        )}
      </MapContainer>

      {points.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Points ({points.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {points.map((point, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                <span className="text-gray-700">
                  Point {index + 1}: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePoint(index)}
                  className="text-red-600 hover:text-red-700 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500">Click on the map to add points marking the damaged road path</p>
    </div>
  );
}
