import type { PointDTO } from '@/lib/api/types';

// OSRM public demo server — replace with a self-hosted instance for production
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

interface NominatimAddress {
  road?: string;
  suburb?: string;
  village?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  county?: string;
}

interface NominatimReverseResponse {
  address?: NominatimAddress;
}

export async function reverseGeocodeToTitle(lat: number, lng: number): Promise<string> {
  const prefix = 'Kerusakan jalan';
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=id`
    );
    if (!res.ok) return prefix;
    const data = (await res.json()) as NominatimReverseResponse;
    const addr = data.address;
    if (!addr) return prefix;

    const parts: string[] = [];
    if (addr.road) parts.push(addr.road);
    const area = addr.suburb ?? addr.village ?? addr.neighbourhood;
    if (area) parts.push(area);
    const city = addr.city ?? addr.town ?? addr.county;
    if (city) parts.push(city);

    const title = parts.length > 0 ? `${prefix}: ${parts.join(', ')}` : prefix;
    return title.slice(0, 100);
  } catch {
    return prefix;
  }
}

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
