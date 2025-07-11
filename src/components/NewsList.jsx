import PublishDate from "./PublishDate";
import toast from "react-hot-toast";

export default function NewsList({
  user,
  bookmarks,
  toggleBookmark,
  onClickNews,
  newsList,
}) {
  return (
    <ul className="space-y-8">
      {newsList.map((news) => {
        const isBookmarked = bookmarks.some((b) => b.id === news.id);

        return (
          <li
            key={news.id}
            className="relative max-w-6xl mx-auto p-6 border border-gray-200 rounded-lg shadow-md transition-all duration-200 ease-in hover:shadow-lg hover:bg-gray-100 hover:scale-[1.01] cursor-pointer"
            onClick={() => onClickNews(news.id)}
          >
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-xl transition-all duration-150">
              {news.title}
            </h4>

            <PublishDate date={news.publishDate} />

            {news.contents && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {news.contents}
              </p>
            )}

            {user && (
              <button
                className={`absolute top-4 right-4 text-2xl transition-transform duration-150 ${
                  isBookmarked
                    ? "text-yellow-400 hover:scale-110"
                    : "text-gray-400 hover:text-yellow-400 hover:scale-110"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(news);
                  if (isBookmarked) {
                    toast.error("북마크에서 제거되었습니다.");
                  } else {
                    toast.success("북마크에 추가되었습니다.");
                  }
                }}
              >
                {isBookmarked ? "★" : "☆"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
