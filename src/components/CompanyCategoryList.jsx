import { useState, useEffect } from "react";
import { useCategoryStore } from "../store/categoryStore";
import { fetchCompanies } from "../utils/api"; // API 함수 가져오기

export default function CompanyCategoryList() {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [companies, setCompanies] = useState([]); // 기업 목록 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 기업 목록을 API에서 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const companiesData = await fetchCompanies(); // API 호출로 기업 목록 가져오기
        setCompanies(companiesData); // 기업 목록 상태 업데이트
      } catch (error) {
        setError("기업 데이터를 불러오는 데 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p className="text-center">로딩 중...</p>;  // 로딩 상태일 때 메시지
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;  // 에러 메시지
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap justify-center gap-3"> {/* 화면 중앙 정렬 */}
        {companies.map((company, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(company)}
            className={`px-4 py-2 rounded-md border ${
              selectedCategory === company
                ? "bg-blue-500 text-white"
                : "bg-white text-black border-gray-300"
            }`}
          >
            {company}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)} // 전체 보기 버튼
          className={`px-4 py-2 rounded-md border ${
            selectedCategory === null
              ? "bg-blue-500 text-white"
              : "bg-white text-black border-gray-300"
          }`}
        >
          전체 보기
        </button>
      </div>
    </div>
  );
}
