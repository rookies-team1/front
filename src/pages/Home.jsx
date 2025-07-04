import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../store/categoryStore";
import { useBookmarkStore } from "../store/bookmarkStore";
import { useUserStore } from "../store/userStore";

const dummyCompanies = ["삼성전자", "카카오"];
const dummyNews = [
  {
    id: 1,
    company: "삼성전자",
    title: "삼성전자, 반도체 수출 증가",
    summary: "반도체 수출이 25% 증가했다는 소식입니다.",
  },
  {
    id: 2,
    company: "카카오",
    title: "카카오, 신사업 진출 발표",
    summary: "AI 기반 신사업을 추진한다는 발표가 있었습니다.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  const { user } = useUserStore();

  const filteredNews = selectedCategory
    ? dummyNews.filter((n) => n.company === selectedCategory)
    : dummyNews;

  const isBookmarked = (id) => bookmarks.some((n) => n.id === id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🏢 기업 카테고리</h2>
      <div className="flex gap-3 mb-6">
        {dummyCompanies.map((company) => (
          <button
            key={company}
            onClick={() => setSelectedCategory(company)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === company
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {company}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-md ${
            selectedCategory === null
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          전체 보기
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-3">📰 뉴스 목록</h3>
      <ul className="space-y-4">
        {filteredNews.map((news) => (
          <li
            key={news.id}
            className="border p-4 rounded shadow hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/news/${news.id}`)}
              >
                <h4 className="text-lg font-bold">{news.title}</h4>
                <p className="text-sm text-gray-600">{news.summary}</p>
              </div>

              {user ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(news);
                  }}
                  className={`text-xl ${
                    isBookmarked(news.id)
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-yellow-400"
                  }`}
                  title="즐겨찾기"
                >
                  {isBookmarked(news.id) ? "★" : "☆"}
                </button>
              ) : (
                <span
                  title="로그인 필요"
                  className="text-xl text-gray-300 cursor-not-allowed"
                >
                  ☆
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
