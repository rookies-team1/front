import { create } from "zustand";

export const useBookmarkStore = create((set) => ({
  bookmarks: [],
  toggleBookmark: (news) =>
    set((state) => {
      const exists = state.bookmarks.find((n) => n.id === news.id);
      if (exists) {
        return {
          bookmarks: state.bookmarks.filter((n) => n.id !== news.id),
        };
      } else {
        return {
          bookmarks: [...state.bookmarks, news],
        };
      }
    }),
}));
