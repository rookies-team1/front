import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import FileUploadArea from "../components/FileUploadArea";

// 더미 뉴스 데이터
const dummyNews = [
  {
    id: 1,
    company: "삼성전자",
    title: "삼성전자, 반도체 수출 증가",
    summary: "반도체 수출이 25% 증가했다는 소식입니다.",
    content: "삼성전자의 반도체 부문이 지난 분기보다 25% 수출 증가하였습니다...",
  },
  {
    id: 2,
    company: "카카오",
    title: "카카오, 신사업 진출 발표",
    summary: "AI 기반 신사업을 추진한다는 발표가 있었습니다.",
    content: "카카오는 AI와 메신저 연동 사업을 본격적으로 추진할 예정입니다...",
  },
];

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = dummyNews.find((n) => n.id === parseInt(id));
  const [summary, setSummary] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [uploadedText, setUploadedText] = useState("");

  if (!news) return <p>해당 뉴스가 존재하지 않습니다.</p>;

  const contentToUse = uploadedText || news.content;

  const handleSummarize = () => {
    setSummary("📌 요약 결과:\n\n" + contentToUse.slice(0, 100) + "...");
  };

  const handleAnalyze = () => {
    setPortfolio("💼 포트폴리오 분석 결과:\n\n" + contentToUse.slice(0, 100) + "...");
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 10 }}>← 뒤로가기</button>

      <h2>{news.title}</h2>
      <p><strong>요약:</strong> {news.summary}</p>
      <p><strong>본문:</strong> {news.content}</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleSummarize} style={{ marginRight: 10 }}>요약 보기</button>
        <button onClick={handleAnalyze}>포트폴리오 분석</button>
      </div>

      {summary && (
        <div style={{ marginTop: 20, background: "#f9f9f9", padding: 10 }}>
          <strong>요약 결과</strong>
          <pre>{summary}</pre>
        </div>
      )}

      {portfolio && (
        <div style={{ marginTop: 20, background: "#e6f4ff", padding: 10 }}>
          <strong>분석 결과</strong>
          <pre>{portfolio}</pre>
        </div>
      )}

      <FileUploadArea onExtractedText={(text) => setUploadedText(text)} />
    </div>
  );
}
