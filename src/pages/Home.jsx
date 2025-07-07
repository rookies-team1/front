import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies, fetchNewsTitles, fetchNewsByCompany } from '../utils/api'; // API 함수 가져오기

export default function Home() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]); // 기업 목록 상태
  const [newsList, setNewsList] = useState([]); // 뉴스 목록 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태

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
          newsData = await fetchNewsByCompany(selectedCategory);
        } else {
          // 모든 뉴스 제목 가져오기
          newsData = await fetchNewsTitles();
        }

        // 응답에서 'data' 속성만 추출하여 상태에 저장
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

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🏢 기업 카테고리</h2>
      <div className="flex gap-3 mb-6">
        {companies.map((company, index) => (
          <button
            key={company + index} // company와 index를 합쳐서 고유 key 생성
            onClick={() => setSelectedCategory(company)}
            className={`px-4 py-2 rounded-md ${selectedCategory === company ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            {company}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-md ${selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          전체 보기
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-3">📰 뉴스 목록</h3>
      {newsList.length === 0 ? (
        <p className="text-gray-600">뉴스 목록이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {newsList.map((news) => (
            <li
              key={news.id}
              className="max-w-2xl mx-auto p-4 border rounded-lg shadow-md hover:bg-gray-50 transition"
              onClick={() => navigate(`/news/${news.id}`)}
            >
              <h4 className="text-lg font-bold">{news.title}</h4>
              <p className="text-sm text-gray-600 break-words">{news.contents}</p> {/* 내용으로 변경 */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
