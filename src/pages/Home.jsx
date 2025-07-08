import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies, fetchNewsTitles, fetchNewsByCompany } from '../utils/api'; // API 함수 가져오기
import { useUserStore } from '../store/userStore';  // 로그인 상태 확인용

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUserStore(); // 로그인 상태 가져오기
  const [companies, setCompanies] = useState([]); // 기업 목록 상태
  const [newsList, setNewsList] = useState([]); // 뉴스 목록 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [newsPerPage] = useState(10); // 한 페이지에 표시할 뉴스 개수 (10개)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 기업 목록 가져오기
        const companyData = await fetchCompanies();
        setCompanies(companyData); // 기업 목록 상태 업데이트

        let newsData;
        if (selectedCategory) {
          // 선택된 카테고리에 맞는 뉴스 가져오기
          newsData = await fetchNewsByCompany(selectedCategory); // 특정 기업의 뉴스만 가져옴
        } else {
          // 모든 뉴스 제목 가져오기
          newsData = await fetchNewsTitles(); // 전체 뉴스 목록 가져옴
        }

        if (newsData && newsData.data && Array.isArray(newsData.data)) {
          setNewsList(newsData.data); // 뉴스 목록 업데이트
        } else {
          setError('뉴스 데이터를 불러오는 데 문제가 발생했습니다.');
        }
      } catch (error) {
        setError('기업 목록 또는 뉴스 데이터를 불러오는 데 문제가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // 데이터 호출
  }, [selectedCategory]); // selectedCategory가 바뀔 때마다 데이터를 새로 받아옴

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 뉴스 클릭 시 로그인 여부 확인 후, 로그인 되어 있지 않으면 메시지 표시 후 로그인 페이지로 이동
  const handleNewsClick = (newsId) => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");  // 로그인되지 않은 경우 메시지 표시
      navigate('/login'); // 로그인되지 않으면 로그인 페이지로 이동
    } else {
      navigate(`/news/${newsId}`); // 로그인된 경우 뉴스 디테일 페이지로 이동
    }
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
          {currentNews.map((news) => (
            <li
              key={news.id}
              className="max-w-6xl mx-auto p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in"
              onClick={() => handleNewsClick(news.id)} // 뉴스 클릭 시 로그인 여부 확인 후 이동
            >
              <h4 className="text-lg font-bold text-gray-900">{news.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{news.contents}</p>
            </li>
          ))}
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
