import { propertyApi } from '@/lib/api';
import { Property } from '@/types';
import Link from 'next/link';
import { MapPin, AlertCircle } from 'lucide-react';

export const revalidate = 60;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page ?? 1);

  // Gracefully handle backend being offline
  let properties: Property[] = [];
  let totalPages = 0;
  let totalCount = 0;
  let backendOffline = false;

  try {
    const res = await propertyApi.list({ page, pageSize: 16 });
    if (res.success && res.data) {
      properties = res.data.items ?? [];
      totalPages = res.data.totalPages ?? 0;
      totalCount = res.data.totalCount ?? 0;
    }
  } catch {
    backendOffline = true;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
            <span className="font-bold text-gray-800 tracking-tight text-lg">Nexum</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-white/90 text-sm font-semibold">
            <a className="hover:text-white transition-colors" href="#">Features</a>
            <a className="hover:text-white transition-colors" href="#">Studies</a>
            <a className="hover:text-white transition-colors border-b-2 border-white/50 pb-0.5" href="#">Properties</a>
          </nav>
          <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-sm font-bold transition-all shadow-lg">Login / Sign up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="pt-44 pb-24 px-6 text-center text-white"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 68, 160, 0.4) 0%, rgba(0, 48, 115, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgv9Yl3-1pOEqy87M9ryxyoBtb7g0xtEVTajalB9knCOJdfMAiSCuHMxKJ-94irjQ7mMZEr04xdWFkDKh9mB5msTW6cb913QnVawQ2oQWcUhJSpDePVYGaWQu9Okkj_gZZ6YmL4pDn9_akkypmcrSXMpF7m00tjHU5otry1Uj_xccDAHh1llwOq_tqC_BvV7aBRBZs89g915uNWuBFqQAqdzx2CB218sJUO_EjCEUvD9VSSQyLzGqegD26Y8Qw-W44BXfi1ahHGZE")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">Redemption City Accommodation</h1>
          <p className="text-xl text-white/90 mb-12 font-medium max-w-2xl mx-auto drop-shadow-sm">Browse approved guest properties for Holy Ghost Congress and monthly services</p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-20">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path></svg>
            </div>
            <input className="w-full pl-11 pr-4 py-4 rounded-lg text-gray-800 border-none focus:ring-2 focus:ring-orange-500 shadow-2xl text-base font-medium placeholder:text-gray-400" placeholder="search favorite properties..." type="text"/>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-left">
              <h2 className="text-3xl font-black mb-1">5M+</h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">Peak worshippers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-left">
              <h2 className="text-3xl font-black mb-1">2,500</h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">Hectares covered</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-left">
              <h2 className="text-3xl font-black mb-1">3s</h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">Emergency dispatch</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-left">
              <h2 className="text-3xl font-black mb-1">24/7</h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">Always active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Redemption City Accommodation</h2>
            <p className="text-gray-500 mt-2 font-medium text-lg">Browse approved guest properties for Holy Ghost Congress and monthly services</p>
          </div>
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <input className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 font-medium transition-all" placeholder="search here for properties..." type="text"/>
          </div>
        </div>

        {/* Backend Offline Banner */}
        {backendOffline && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-800">Backend not connected</div>
              <div className="text-sm text-amber-700 mt-1">
                Start the .NET API with <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">dotnet run</code>, then set <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_API_URL</code> in `.env.local`.
              </div>
            </div>
          </div>
        )}

        {/* Property Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>{backendOffline ? 'Properties will appear here once the backend is running' : 'No properties available yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white p-2 rounded">
                <span className="font-black text-slate-900 text-sm">Nexum</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">Nexum is the safety intelligence backbone for Redemption City, coordinating millions of worshippers through advanced geospatial technology.</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Platform</h5>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-white transition-colors" href="#">Features</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Media</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Properties</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Security</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Company</h5>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-white transition-colors" href="#">About</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Contact</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Partners</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Legal</h5>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-white transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Terms</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Cookies</a></li>
              <li><a className="hover:text-white transition-colors" href="#">SLA</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Nexum Intelligence. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Designed for Redemption City</span>
            <span>Powered by Geospatial AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const photo = property.photoUrls?.[0];

  return (
    <Link href={`/properties/${property.id}`}>
      <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        <img alt={property.name} className="w-full h-48 object-cover" src={photo || "https://via.placeholder.com/400x300?text=No+Image"} />
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-base mb-1.5">{property.name}</h3>
          <p className="text-xs text-gray-500 mb-5 leading-relaxed font-medium">{property.address}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold bg-orange-50 text-orange-700 px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Host: {property.hostName}
            </span>
            <button className="text-[11px] border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 font-bold text-gray-700 transition-colors">View Rooms</button>
          </div>
        </div>
      </article>
    </Link>
  );
}
