import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { MOCK_VEHICLES } from '@/lib/constants';
import { Vehicle, VehicleFilterState, PaginatedResponse, InquiryFormData } from '@/types';

/**
 * Filter vehicles locally if backend is unavailable (or mock mode)
 */
function filterMockVehicles(filters: VehicleFilterState): PaginatedResponse<Vehicle> {
  let result = [...MOCK_VEHICLES];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
    );
  }

  if (filters.make) {
    result = result.filter((v) => v.make.toLowerCase() === filters.make?.toLowerCase());
  }

  if (filters.bodyType) {
    result = result.filter((v) => v.bodyType === filters.bodyType);
  }

  if (filters.fuelType) {
    result = result.filter((v) => v.fuelType === filters.fuelType);
  }

  if (filters.transmission) {
    result = result.filter((v) => v.transmission === filters.transmission);
  }

  if (filters.minPrice) {
    result = result.filter((v) => v.price >= (filters.minPrice ?? 0));
  }

  if (filters.maxPrice) {
    result = result.filter((v) => v.price <= (filters.maxPrice ?? Infinity));
  }

  if (filters.minYear) {
    result = result.filter((v) => v.year >= (filters.minYear ?? 0));
  }

  if (filters.maxYear) {
    result = result.filter((v) => v.year <= (filters.maxYear ?? Infinity));
  }

  // Sorting
  if (filters.sortBy === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'year_desc') {
    result.sort((a, b) => b.year - a.year);
  } else if (filters.sortBy === 'mileage_asc') {
    result.sort((a, b) => a.mileage - b.mileage);
  }

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const startIndex = (page - 1) * limit;
  const paginatedData = result.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    total: result.length,
    page,
    limit,
    totalPages: Math.ceil(result.length / limit),
  };
}

/**
 * Hook to fetch paginated vehicle listings
 */
export function useVehicles(filters: VehicleFilterState) {
  return useQuery<PaginatedResponse<Vehicle>>({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== undefined && val !== '') queryParams.append(key, String(val));
        });
        return await api.get<PaginatedResponse<Vehicle>>(`/vehicles?${queryParams.toString()}`);
      } catch {
        // Graceful fallback to client-side mock filter
        return filterMockVehicles(filters);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

/**
 * Hook to fetch single vehicle detail by ID
 */
export function useVehicleDetail(id: string) {
  return useQuery<Vehicle | null>({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      try {
        return await api.get<Vehicle>(`/vehicles/${id}`);
      } catch {
        const found = MOCK_VEHICLES.find((v) => v.id === id);
        return found || null;
      }
    },
    enabled: Boolean(id),
  });
}

/**
 * Hook to submit vehicle purchase inquiry or test-drive booking
 */
export function useSubmitInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InquiryFormData) => {
      try {
        return await api.post<{ success: boolean; inquiryId: string }>('/inquiries', data);
      } catch {
        // Simulated mock success response
        await new Promise((resolve) => setTimeout(resolve, 800));
        return { success: true, inquiryId: `inq-${Date.now()}` };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries', variables.vehicleId] });
    },
  });
}
