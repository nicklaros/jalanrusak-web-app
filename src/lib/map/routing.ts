import type { PointDTO } from '@/lib/api/types';

// OSRM public demo server — replace with a self-hosted instance for production
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

export async function fetchRoadRoute(points: PointDTO[]): Promise<[number, number][]> {
  if (points.length < 2) return points.map((p) => [p.lat, p.lng]);

  // OSRM expects coordinates as lng,lat (longitude first)
  const waypoints = points.map((p) => `${p.lng},${p.lat}`).join(';');
  const url = `${OSRM_BASE_URL}/${waypoints}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) return points.map((p) => [p.lat, p.lng]);

  const data: { routes?: { geometry: { coordinates: [number, number][] } }[] } = await res.json();

  if (data.routes?.[0]?.geometry?.coordinates) {
    // OSRM returns [lng, lat] — convert to Leaflet's [lat, lng]
    return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  }

  return points.map((p) => [p.lat, p.lng]);
}
