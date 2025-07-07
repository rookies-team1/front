import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchNewsDetail } from "../utils/api"; // API 호출 함수 추가
import FileUploadArea from "../components/FileUploadArea"; // 파일 업로드 컴포넌트

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 뉴스 데이터 상태
  const [news, setNews] = useState(null);
  const [summary, setSummary] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [uploadedText, setUploadedText] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 상세 뉴스 데이터 API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const newsData = await fetchNewsDetail(id); // API 호출로 뉴스 상세 정보 가져오기
        if (newsData) {
          setNews(newsData); // 뉴스 상태 업데이트
        } else {
          setError("해당 뉴스 데이터를 불러올 수 없습니다.");
        }
      } catch (error) {
        setError("뉴스 데이터를 불러오는 데 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // 뉴스 데이터가 없으면 에러 처리
  if (!news) {
    return <p>해당 뉴스가 존재하지 않습니다.</p>;
  }

  const contentToUse = uploadedText || news.content; // 업로드된 텍스트가 있으면 그것을 사용, 없으면 뉴스 본문 사용

  const handleSummarize = () => {
    // 뉴스 본문 또는 업로드된 텍스트로 요약 생성
    setSummary("📌 요약 결과:\n\n" + contentToUse.slice(0, 100) + "...");
  };

  const handleAnalyze = () => {
    // 뉴스 본문 또는 업로드된 텍스트로 포트폴리오 분석 생성
    setPortfolio("💼 포트폴리오 분석 결과:\n\n" + contentToUse.slice(0, 100) + "...");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-blue-500 hover:underline"
      >
        ← 뒤로가기
      </button>

      <h2 className="text-2xl font-bold">{news.title}</h2>
      <p className="mt-2"><strong>요약:</strong> {news.summary}</p>
      <p className="mt-2"><strong>본문:</strong> {news.content}</p>

      <div className="mt-4">
        <button 
          onClick={handleSummarize} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
        >
          요약 보기
        </button>
        <button 
          onClick={handleAnalyze} 
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          포트폴리오 분석
        </button>
      </div>

      {summary && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <strong>요약 결과</strong>
          <pre>{summary}</pre>
        </div>
      )}

      {portfolio && (
        <div className="mt-6 p-4 bg-blue-100 rounded-md">
          <strong>분석 결과</strong>
          <pre>{portfolio}</pre>
        </div>
      )}

      {/* 파일 업로드 영역 */}
      <FileUploadArea onExtractedText={(text) => setUploadedText(text)} />
    </div>
  );
}
