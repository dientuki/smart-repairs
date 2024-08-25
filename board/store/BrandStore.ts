import { create } from 'zustand'

interface BrandStore {
  brands: OptionType[];
  setBrands: (brands: OptionType[]) => void;
  updateBrandInStore: (brand: OptionType) => void;
}

export const useBrandStore = create<BrandStore>((set) => ({
  brands: [],

  setBrands: (brands: OptionType[]) => {
    set({ brands });
  },

  updateBrandInStore: (brand: OptionType) => {
    set((state) => {
      const existingIndex = state.brands.findIndex((b) => b.id === brand.id);

      if (existingIndex >= 0) {
        // Update the existing brand
        const updatedBrands = [...state.brands];
        updatedBrands[existingIndex] = brand;
        return { brands: updatedBrands };
      } else {
        // Add the new brand
        return { brands: [...state.brands, brand] };
      }
    });
  },

}));

export default useBrandStore;