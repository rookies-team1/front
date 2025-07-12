import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSummaryStore = create(
  persist(
    (set, get) => ({
      summaryMap: {},
      order: [], // ⬅ summary 저장 순서 기록

      getSummary: (id) => get().summaryMap[id],

      setSummary: (id, summary) => {
        const currentMap = get().summaryMap;
        const currentOrder = get().order;

        // 이미 존재하는 경우 순서만 조정
        let newOrder = currentOrder.filter((key) => key !== id);
        newOrder.push(id);

        // 30개 초과 시 가장 오래된 것 제거
        if (newOrder.length > 30) {
          const oldestId = newOrder.shift(); // FIFO 구조
          delete currentMap[oldestId];
        }

        set({
          summaryMap: {
            ...currentMap,
            [id]: summary,
          },
          order: newOrder,
        });
      },

      hasSummary: (id) => !!get().summaryMap[id],
    }),
    {
      name: 'summary-storage',
    }
  )
);
