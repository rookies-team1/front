// src/store/categoryStore.js
import { create } from 'zustand';

export const useCategoryStore = create((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
