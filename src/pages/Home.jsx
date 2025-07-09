import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies, fetchNewsTitles, fetchNewsByCompany } from '../utils/api'; // API 함수
import { useUserStore } from '../store/userStore';  // 로그인 상태
import { useBookmarkStore } from '../store/bookmarkStore'; // 북마크 상태

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUserStore(); // 로그인 사용자
  const { bookmarks, toggleBookmark } = useBookmarkStore(); // 북마크 상태와 토글함수

  const [companies, setCompanies] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const companyData = await fetchCompanies();
        setCompanies(companyData);

        let newsData;
        if (selectedCategory) {
          newsData = await fetchNewsByCompany(selectedCategory);
        } else {
          newsData = await fetchNewsTitles();
        }

        if (newsData && newsData.data && Array.isArray(newsData.data)) {
          setNewsList(newsData.data);
        } else {
          setError('뉴스 데이터를 불러오는 데 문제가 발생했습니다.');
        }
      } catch (error) {
        setError('기업 목록 또는 뉴스 데이터를 불러오는 데 문제가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNewsClick = (newsId) => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      navigate('/login');
    } else {
      navigate(`/news/${newsId}`);
    }
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 px-12 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">🏢 기업 카테고리</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-300'} transition-all duration-200 ease-in ml-auto`}
        >
          전체 보기
        </button>

        {companies.map((company) => (
          <button
            key={company}
            onClick={() => setSelectedCategory(company)}
            className={`px-6 py-2 rounded-md text-sm font-medium ${selectedCategory === company ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-300'} transition-all duration-200 ease-in`}
          >
            {company}
          </button>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">📰 뉴스 목록</h3>
      {currentNews.length === 0 ? (
        <p className="text-gray-600">뉴스 목록이 없습니다.</p>
      ) : (
        <ul className="space-y-8">
          {currentNews.map((news) => {
            const isBookmarked = bookmarks.some((b) => b.id === news.id);

            return (
              <li
                key={news.id}
                className="relative max-w-6xl mx-auto p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in"
                onClick={() => handleNewsClick(news.id)}
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
      )}

      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center gap-6">
        {Array.from({ length: Math.ceil(newsList.length / newsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-300'} transition-all duration-200 ease-in`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
