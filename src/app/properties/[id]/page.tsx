import { propertyApi } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  // Fetch property data
  const propertyRes = await propertyApi.get(params.id);
  if (!propertyRes.success || !propertyRes.data) {
    notFound();
  }

  const property = propertyRes.data;
  const roomsRes = await propertyApi.getRoomTypes(params.id);
  const rooms = roomsRes.data ?? [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="max-w-7xl mx-auto mt-4 px-6">
        <nav className="bg-[#004aad] rounded-xl py-2 md:py-3 px-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 md:px-4 py-1.5 md:py-2">
            <div className="w-5 h-5 bg-gray-300 rounded-sm"></div>
            <span className="font-bold text-gray-800 tracking-tight text-sm md:text-base">Nexum</span>
          </div>
          <div className="hidden md:flex space-x-8 text-white/90 font-semibold text-sm">
            <a href="#">Features</a>
            <a href="#">Modules</a>
            <a href="#" className="border-b-2 border-white/50 pb-0.5">Properties</a>
          </div>
          <Link href="/login" className="bg-[#f59e0b] hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md text-sm">
            Login / Sign up
          </Link>
        </nav>
      </header>

      {/* Property Details Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title & Location */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{property.name}</h1>
          <div className="flex items-center text-sm font-medium text-gray-500 mt-2">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span>{property.address}</span>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Side: Image & About */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="rounded-3xl overflow-hidden aspect-video shadow-xl border border-gray-100">
              {property.photoUrls && property.photoUrls[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={property.photoUrls[0]} alt={property.name} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Gallery Carousel */}
            {property.photoUrls && property.photoUrls.length > 1 && (
              <div className="flex justify-center gap-2">
                <div className="h-2 w-12 bg-[#004aad] rounded-full"></div>
                {property.photoUrls.slice(1, 3).map((_, i) => (
                  <div key={i} className="h-2 w-2 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            )}

            {/* About Property */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg md:text-xl font-bold mb-3 tracking-tight">About this property</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {property.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 bg-orange-50 px-4 py-3 rounded-xl border border-orange-100">
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="text-xs md:text-sm font-bold text-orange-800">Hosted by {property.hostName}</span>
                </div>

                {property.lastSupervisedAt && (
                  <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Last supervised: {formatDate(property.lastSupervisedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-1 tracking-tight">Book a Room</h2>
            <p className="text-gray-500 text-sm mb-8">You can seamlessly book an apartment</p>

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Select Room</label>
                <select className="w-full rounded-xl border border-gray-200 text-sm font-medium text-gray-700 py-3 px-3 focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad]">
                  <option>Select a room type</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Check In</label>
                  <input className="w-full rounded-xl border border-gray-200 text-sm font-medium py-3 px-3 focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad]" placeholder="DD/MM/YYYY" type="text" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Check Out</label>
                  <input className="w-full rounded-xl border border-gray-200 text-sm font-medium py-3 px-3 focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad]" placeholder="DD/MM/YYYY" type="text" />
                </div>
              </div>

              <button className="w-full bg-[#004aad] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg text-base">
                Book Now
              </button>

              <div className="flex items-center justify-center">
                <span className="text-[10px] text-gray-400 font-medium italic">Payment processed securely via Paystack</span>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms Grid */}
        {rooms.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Available Rooms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  {room.photoUrls && room.photoUrls[0] && (
                    <div className="aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={room.photoUrls[0]} alt={room.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 md:p-5 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{room.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
                      {room.description}
                    </p>
                    <div className="mt-auto">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">per night</p>
                      <p className="font-black text-xl text-[#004aad]">₦{room.pricePerNight.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-8 pb-4 px-6 border-t border-slate-700 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 mb-4">
            <p>© 2026 Nexum Intelligence. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
              <a href="#" className="hover:text-white transition-colors">TERMS</a>
              <a href="#" className="hover:text-white transition-colors">SUPPORT</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
