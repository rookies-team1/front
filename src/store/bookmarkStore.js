import { create } from "zustand";

// 북마크 저장할 스토어
export const useBookmarkStore = create((set) => ({
  bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [], // 로컬 스토리지에서 북마크 데이터 불러오기

  // 북마크 추가 또는 제거
  toggleBookmark: (news) =>
    set((state) => {
      const exists = state.bookmarks.find((n) => n.id === news.id);
      let updatedBookmarks;
      if (exists) {
        updatedBookmarks = state.bookmarks.filter((n) => n.id !== news.id); // 북마크에서 제거
      } else {
        updatedBookmarks = [...state.bookmarks, news]; // 북마크 추가
      }

      // 로컬 스토리지에 업데이트된 북마크 저장
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));

      return { bookmarks: updatedBookmarks };
    }),
}));
