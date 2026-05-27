import { Card, CardContent } from '@/components/ui';
import { Building2 } from 'lucide-react';

export default function AdminPropertiesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <p className="text-sm text-muted-foreground">Manage and approve guest properties</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Building2 className="h-12 w-12 mb-3 opacity-30" />
          <p>Property management coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
