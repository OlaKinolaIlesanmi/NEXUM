import { ApiResponse, PagedResult } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7001/v1';

class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string; lat?: number; lng?: number } = {}
): Promise<ApiResponse<T>> {
  const { token, lat, lng, ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (lat !== undefined) headers['X-Client-Lat'] = String(lat);
  if (lng !== undefined) headers['X-Client-Lng'] = String(lng);

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const json: ApiResponse<T> = await res.json();
  return json;
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: (body: unknown) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  refresh: (refreshToken: string) =>
    request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  me: (token: string) =>
    request('/auth/me', { token }),

  updateProfile: (token: string, body: unknown) =>
    request('/auth/me/profile', { method: 'PUT', token, body: JSON.stringify(body) }),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  verifyOtp: (body: unknown) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),

  resetPassword: (body: unknown) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
};

// ── Properties & Bookings ─────────────────────────────────────
export const propertyApi = {
  create: (token: string, body: unknown) =>
    request('/properties', { method: 'POST', token, body: JSON.stringify(body) }),
  list: (params?: { page?: number; pageSize?: number }) => {
    const q = new URLSearchParams({
      page: String(params?.page ?? 1),
      pageSize: String(params?.pageSize ?? 12),
    });
    return request<PagedResult<import('@/types').Property>>(`/properties?${q}`);
  },

  get: (id: string) =>
    request<import('@/types').Property>(`/properties/${id}`),

  getRoomTypes: (id: string) =>
    request<import('@/types').RoomType[]>(`/properties/${id}/room-types`),

  checkAvailability: (id: string, checkIn: string, checkOut: string) =>
    request(`/properties/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`),
};

export const bookingApi = {
  create: (token: string, body: unknown) =>
    request<import('@/types').Booking>('/bookings', {
      method: 'POST', token, body: JSON.stringify(body),
    }),

  myBookings: (token: string, page = 1) =>
    request<PagedResult<import('@/types').Booking>>(`/bookings/mine?page=${page}`, { token }),

  get: (token: string, id: string) =>
    request<import('@/types').Booking>(`/bookings/${id}`, { token }),

  lookup: (token: string, code: string) =>
    request<import('@/types').Booking>(`/bookings/lookup/${code}`, { token }),

  checkIn: (token: string, id: string) =>
    request(`/bookings/${id}/check-in`, { method: 'POST', token }),

  // Admin
  all: (token: string, page = 1) =>
    request<PagedResult<import('@/types').Booking>>(`/admin/bookings?page=${page}`, { token }),
};

// ── Emergency ─────────────────────────────────────────────────
export const emergencyApi = {
  report: (token: string, body: unknown, lat: number, lng: number) =>
    request('/emergency/report', {
      method: 'POST', token, lat, lng, body: JSON.stringify(body),
    }),

  incidents: (token: string, page = 1) =>
    request<PagedResult<import('@/types').Incident>>(
      `/emergency/incidents?page=${page}`, { token }),

  incident: (token: string, id: string) =>
    request<import('@/types').Incident>(`/emergency/incidents/${id}`, { token }),

  updateStatus: (token: string, id: string, body: unknown) =>
    request(`/emergency/incidents/${id}/status`, {
      method: 'PUT', token, body: JSON.stringify(body),
    }),

  updateAvailability: (token: string, isAvailable: boolean) =>
    request('/emergency/officers/availability', {
      method: 'PUT', token, body: JSON.stringify({ isAvailable }),
    }),
};

// ── Missing Persons ───────────────────────────────────────────
export const alertApi = {
  list: (token: string, page = 1) =>
    request<PagedResult<import('@/types').MissingPersonAlert>>(
      `/alerts/missing-persons?page=${page}`, { token }),

  get: (token: string, id: string) =>
    request<import('@/types').MissingPersonAlert>(
      `/alerts/missing-persons/${id}`, { token }),

  create: (token: string, body: unknown, lat: number, lng: number) =>
    request('/alerts/missing-persons', {
      method: 'POST', token, lat, lng, body: JSON.stringify(body),
    }),

  updateStatus: (token: string, id: string, status: string) =>
    request(`/alerts/missing-persons/${id}/status`, {
      method: 'PUT', token, body: JSON.stringify({ status }),
    }),

  sightings: (token: string, id: string) =>
    request<import('@/types').Sighting[]>(
      `/alerts/missing-persons/${id}/sightings`, { token }),
};

// ── Admin – Geofence ──────────────────────────────────────────
export const geofenceApi = {
  getActive: () =>
    request<import('@/types').GeofenceZone>('/admin/geofence/active'),

  list: (token: string) =>
    request<import('@/types').GeofenceZone[]>('/admin/geofence', { token }),

  create: (token: string, body: unknown) =>
    request('/admin/geofence', { method: 'POST', token, body: JSON.stringify(body) }),

  update: (token: string, id: string, body: unknown) =>
    request(`/admin/geofence/${id}`, { method: 'PUT', token, body: JSON.stringify(body) }),

  activate: (token: string, id: string) =>
    request(`/admin/geofence/${id}/activate`, { method: 'PUT', token }),
};

// ── Admin – Users ─────────────────────────────────────────────
export const usersApi = {
  list: (token: string, page = 1) =>
    request(`/admin/users?page=${page}`, { token }),

  create: (token: string, body: unknown) =>
    request('/admin/users', { method: 'POST', token, body: JSON.stringify(body) }),
};

// ── Transit ───────────────────────────────────────────────────
export const transitApi = {
  nodes: () => request<import('@/types').CampNode[]>('/transit/network/nodes'),
  edges: () => request<import('@/types').CampEdge[]>('/transit/network/edges'),
  vehicles: (token: string) =>
    request<import('@/types').ShuttleVehicle[]>('/transit/vehicles/live', { token }),
  closeEdge: (token: string, id: string) =>
    request(`/transit/network/edges/${id}/close`, { method: 'PUT', token }),
  openEdge: (token: string, id: string) =>
    request(`/transit/network/edges/${id}/open`, { method: 'PUT', token }),
};

// ── Bank accounts ─────────────────────────────────────────────
export const bankApi = {
  getBanks: (token: string) =>
    request('/host/bank-accounts/banks', { token }),

  verify: (token: string, body: { bankCode: string; accountNumber: string }) =>
    request('/host/bank-accounts/verify', {
      method: 'POST', token, body: JSON.stringify(body),
    }),

  add: (token: string, body: { bankCode: string; accountNumber: string }) =>
    request('/host/bank-accounts', {
      method: 'POST', token, body: JSON.stringify(body),
    }),

  list: (token: string) =>
    request('/host/bank-accounts', { token }),

  remove: (token: string, id: string) =>
    request(`/host/bank-accounts/${id}`, { method: 'DELETE', token }),
};

// ── Transfers ─────────────────────────────────────────────────
export const transferApi = {
  // Admin can see all transfers for a booking
  forBooking: (token: string, bookingId: string) =>
    request(`/admin/bookings/${bookingId}/transfers`, { token }),
};
