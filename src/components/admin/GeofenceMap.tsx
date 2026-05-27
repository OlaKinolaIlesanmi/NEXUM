'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeofenceZone } from '@/types';

function FitBounds({ zones }: { zones: GeofenceZone[] }) {
  const map = useMap();
  useEffect(() => {
    const active = zones.find(z => z.isActive);
    if (active?.boundary?.coordinates?.[0]) {
      const coords = active.boundary.coordinates[0].map(
        ([lng, lat]) => [lat, lng] as [number, number]
      );
      if (coords.length > 0) map.fitBounds(coords, { padding: [20, 20] });
    }
  }, [zones, map]);
  return null;
}

export default function GeofenceMap({ zones }: { zones: GeofenceZone[] }) {
  return (
    <MapContainer
      center={[6.8403, 3.3864]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {zones.map(zone => {
        if (!zone.boundary?.coordinates?.[0]) return null;
        const positions = zone.boundary.coordinates[0].map(
          ([lng, lat]) => [lat, lng] as [number, number]
        );
        return (
          <Polygon
            key={zone.id}
            positions={positions}
            pathOptions={{
              color: zone.isActive ? '#2563EB' : '#F59E0B',
              fillColor: zone.isActive ? '#2563EB' : '#F59E0B',
              fillOpacity: zone.isActive ? 0.1 : 0.05,
              dashArray: zone.isActive ? undefined : '6,4',
              weight: zone.isActive ? 2.5 : 1.5,
            }}
          />
        );
      })}
      <FitBounds zones={zones} />
    </MapContainer>
  );
}
