'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { geofenceApi } from '@/lib/api';
import { GeofenceZone } from '@/types';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const GeofenceMap = dynamic(() => import('@/components/admin/GeofenceMap'), { ssr: false });

export default function AdminGeofencePage() {
  const { data: session } = useSession();
  const [zones, setZones] = useState<GeofenceZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    geofenceApi.list(session.accessToken).then(res => {
      if (res.success) setZones(res.data ?? []);
      setLoading(false);
    });
  }, [session]);

  async function activate(id: string) {
    if (!session) return;
    setActivating(id);
    const res = await geofenceApi.activate(session.accessToken, id);
    if (res.success) {
      setZones(prev => prev.map(z => ({ ...z, isActive: z.id === id })));
      toast.success('Geofence boundary activated — all mobile clients notified');
    } else toast.error(res.error?.message ?? 'Activation failed');
    setActivating(null);
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const active = zones.find(z => z.isActive);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Geofence Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {active ? `Active: ${active.name}` : 'No active boundary'}
          </p>
        </div>
        <Button size="sm">+ New Boundary</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Map */}
        <div className="col-span-2">
          <Card className="overflow-hidden">
            <div style={{ height: 480 }}>
              <GeofenceMap zones={zones} />
            </div>
          </Card>
          <p className="text-xs text-muted-foreground mt-2">
            ℹ Activating a boundary immediately refreshes the server cache and broadcasts
            a GeofenceBoundaryUpdated event to all connected mobile clients.
          </p>
        </div>

        {/* Zone list */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Saved Boundaries</h3>
          {zones.map(zone => (
            <Card key={zone.id}
              className={zone.isActive ? 'border-blue-500 ring-1 ring-blue-500' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-sm">{zone.name}</div>
                  {zone.isActive
                    ? <Badge variant="success">Active</Badge>
                    : <Badge variant="secondary">Saved</Badge>}
                </div>
                {zone.description && (
                  <p className="text-xs text-muted-foreground mb-2">{zone.description}</p>
                )}
                {zone.activatedAt && (
                  <p className="text-xs text-muted-foreground font-mono mb-3">
                    Activated: {formatDate(zone.activatedAt)}
                  </p>
                )}
                <div className="flex gap-2">
                  {!zone.isActive && (
                    <Button size="sm" className="flex-1"
                      disabled={activating === zone.id}
                      onClick={() => activate(zone.id)}>
                      {activating === zone.id ? 'Activating...' : 'Activate'}
                    </Button>
                  )}
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
