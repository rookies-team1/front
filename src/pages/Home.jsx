import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies, fetchNewsTitles, fetchNewsByCompany } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useBookmarkStore } from '../store/bookmarkStore';

import CategoryFilter from '../components/CategoryFilter';
import NewsList from '../components/NewsList';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarks, toggleBookmark } = useBookmarkStore();

  const [companies, setCompanies] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10);

  // ✅ 카테고리 변경 핸들러 - 페이지 초기화 포함
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 🔧 페이지 초기화 핵심!
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const companyData = await fetchCompanies();
        setCompanies(companyData);

        const newsData = selectedCategory
          ? await fetchNewsByCompany(selectedCategory)
          : await fetchNewsTitles();

        if (newsData?.data && Array.isArray(newsData.data)) {
          setNewsList(newsData.data);
        } else {
          setError('뉴스 데이터를 불러오는 데 문제가 발생했습니다.');
        }
      } catch {
        setError('기업 목록 또는 뉴스 데이터를 불러오는 데 문제가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleNewsClick = (newsId) => {
    if (!user) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
    } else {
      navigate(`/news/${newsId}`);
    }
  };

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);

  return (
    <div className="p-6 px-4 md:px-12 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">🏢 기업 카테고리</h2>
      <CategoryFilter
        companies={companies}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory} // ✅ 여기만 바뀜
      />

      <h3 className="text-xl font-semibold text-gray-800 mb-4">📰 뉴스 목록</h3>

      {error && <p className="text-red-500">{error}</p>}

      {isLoading ? (
        <LoadingSpinner text="뉴스 불러오는 중..." />
      ) : currentNews.length === 0 ? (
        <p className="text-gray-600">뉴스 목록이 없습니다.</p>
      ) : (
        <>
          <NewsList
            user={user}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            onClickNews={handleNewsClick}
            newsList={currentNews}
          />
          <Pagination
            total={newsList.length}
            currentPage={currentPage}
            perPage={newsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
