import { useBookmarkStore } from "../store/bookmarkStore";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

export default function Bookmarks() {
  const { bookmarks } = useBookmarkStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  // 🔐 로그인 안 된 경우 접근 제한
  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500 font-semibold mb-4">⚠️ 로그인 후 이용해주세요.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          로그인 하러가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📌 즐겨찾기 목록</h2>
      {bookmarks.length === 0 ? (
        <p className="text-gray-600">북마크한 뉴스가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((news) => (
            <li
              key={news.id}
              className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/news/${news.id}`)}
            >
              <h4 className="text-lg font-semibold">{news.title}</h4>
              <p className="text-sm text-gray-700">{news.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
