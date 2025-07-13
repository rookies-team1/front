import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSummaryStore = create(
  persist(
    (set, get) => ({
      summaryMap: {},
      order: [],

      getSummary: (id) => get().summaryMap[id],

      setSummary: (id, summary) => {
        const currentMap = get().summaryMap;
        const currentOrder = get().order;

        // 순서 업데이트 (불변성 유지)
        let newOrder = currentOrder.filter((key) => key !== id);
        newOrder = [...newOrder, id];

        // 30개 초과 시 가장 오래된 것 제거
        let newMap = { ...currentMap };
        if (newOrder.length > 30) {
          const oldestId = newOrder.shift(); // FIFO
          delete newMap[oldestId];
        }

        // 새 상태 설정
        set({
          summaryMap: {
            ...newMap,
            [id]: summary,
          },
          order: newOrder,
        });
      },

      hasSummary: (id) => !!get().summaryMap[id],

      // 전체 초기화 함수 추가 (사용 시점 자유)
      clearSummaries: () =>
        set({
          summaryMap: {},
          order: [],
        }),
    }),
    {
      name: 'summary-storage', // localStorage 키 이름
    }
  )
);
