//뉴스 리스트 렌더링 및 북마크 버튼 처리

export default function NewsList({ newsList, user, bookmarks, toggleBookmark, onClickNews }) {
  return (
    <ul className="space-y-8">
      {newsList.map((news) => {
        const isBookmarked = bookmarks.some((b) => b.id === news.id);

        return (
          <li
            key={news.id}
            className="relative max-w-6xl mx-auto p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in"
            onClick={() => onClickNews(news.id)}
          >
            <h4 className="text-lg font-bold text-gray-900">{news.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{news.contents}</p>

            {user && (
              <button
                className="absolute top-4 right-4 text-2xl"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(news);
                }}
              >
                {isBookmarked ? '★' : '☆'}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}