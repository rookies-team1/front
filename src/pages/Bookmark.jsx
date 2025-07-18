import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../store/bookmarkStore";
import { useUserStore } from "../store/userStore";
import PublishDate from "../components/PublishDate";
import toast from "react-hot-toast";

export default function Bookmark() {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">⭐ 즐겨찾기한 뉴스</h2>
      {bookmarks.length === 0 ? (
        <p className="text-gray-600">즐겨찾기한 뉴스가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((news) => (
            <li
              key={news.id}
              className="relative p-6 border border-gray-200 rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:bg-gray-50 hover:scale-[1.01] cursor-pointer"
              onClick={() => navigate(`/news/${news.id}`)}
            >
              <h3 className="text-lg font-bold text-gray-900">{news.title}</h3>
              <PublishDate date={news.publishDate} />

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{news.summary}</p>

              {/* 북마크 해제 버튼 */}
              <button
                className="absolute top-4 right-4 text-yellow-400 text-2xl hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(news);
                  toast.error("북마크에서 제거되었습니다.");
                }}
              >
                ★
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}