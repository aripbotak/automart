import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VehicleFilterState } from '@/types';

interface VehicleStoreState {
  filters: VehicleFilterState;
  savedVehicleIds: string[];
  compareVehicleIds: string[];
  viewMode: 'grid' | 'list';
  setFilter: (key: keyof VehicleFilterState, value: unknown) => void;
  setFilters: (filters: Partial<VehicleFilterState>) => void;
  resetFilters: () => void;
  toggleSavedVehicle: (id: string) => void;
  toggleCompareVehicle: (id: string) => void;
  clearCompareVehicles: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

const initialFilters: VehicleFilterState = {
  query: '',
  make: '',
  model: '',
  minPrice: undefined,
  maxPrice: undefined,
  minYear: undefined,
  maxYear: undefined,
  bodyType: '',
  transmission: '',
  fuelType: '',
  condition: '',
  sortBy: 'newest',
  page: 1,
  limit: 12,
};

export const useVehicleStore = create<VehicleStoreState>()(
  persist(
    (set) => ({
      filters: initialFilters,
      savedVehicleIds: [],
      compareVehicleIds: [],
      viewMode: 'grid',

      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
            page: 1, // Reset to page 1 on filter change
          },
        })),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...newFilters,
            page: 1,
          },
        })),

      resetFilters: () =>
        set(() => ({
          filters: initialFilters,
        })),

      toggleSavedVehicle: (id) =>
        set((state) => {
          const isSaved = state.savedVehicleIds.includes(id);
          return {
            savedVehicleIds: isSaved
              ? state.savedVehicleIds.filter((item) => item !== id)
              : [...state.savedVehicleIds, id],
          };
        }),

      toggleCompareVehicle: (id) =>
        set((state) => {
          const isComparing = state.compareVehicleIds.includes(id);
          if (isComparing) {
            return { compareVehicleIds: state.compareVehicleIds.filter((item) => item !== id) };
          }
          if (state.compareVehicleIds.length >= 4) {
            return state; // Max 4 vehicles for side-by-side comparison
          }
          return { compareVehicleIds: [...state.compareVehicleIds, id] };
        }),

      clearCompareVehicles: () =>
        set(() => ({
          compareVehicleIds: [],
        })),

      setViewMode: (viewMode) =>
        set(() => ({
          viewMode,
        })),
    }),
    {
      name: 'automart-preferences',
      partialize: (state) => ({
        savedVehicleIds: state.savedVehicleIds,
        compareVehicleIds: state.compareVehicleIds,
        viewMode: state.viewMode,
      }),
    }
  )
);
