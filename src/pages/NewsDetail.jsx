import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import FileUploadArea from "../components/FileUploadArea";

const dummyNews = [
  {
    id: 1,
    company: "삼성전자",
    title: "삼성전자, 반도체 수출 증가",
    summary: "반도체 수출이 25% 증가했다는 소식입니다.",
    content: "삼성전자의 반도체 부문이 지난 분기보다 25% 수출 증가했습니다. 이번 성과는...",
  },
  {
    id: 2,
    company: "카카오",
    title: "카카오, 신사업 진출 발표",
    summary: "AI 기반 신사업을 추진한다는 발표가 있었습니다.",
    content: "카카오는 메신저와 AI를 융합한 신규 플랫폼을 선보이며...",
  },
];

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = dummyNews.find((n) => n.id === parseInt(id));

  const [viewMode, setViewMode] = useState("full"); // 'full' or 'summary'
  const [uploadedText, setUploadedText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [summary, setSummary] = useState(""); // AI 요약 결과

  if (!news) return <p className="p-6">해당 뉴스가 존재하지 않습니다.</p>;

  const handleViewToggle = (mode) => setViewMode(mode);

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    const aiMsg = {
      role: "ai",
      content: `📡 AI 응답 (예시): "${uploadedText.slice(0, 100)}..."`,
    };
    setChatHistory((prev) => [...prev, userMsg, aiMsg]);
    setChatInput("");
  };

  const handleSummarize = () => {
    const result = `${news.summary}\n(※ 실제로는 LangChain 요약 결과가 들어갑니다)`;
    setSummary(result);
    setViewMode("summary");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {/* 뒤로가기 */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← 뒤로가기
        </button>
      </div>

      <h2 className="text-2xl font-bold">{news.title}</h2>

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => handleViewToggle("full")}
          className={`px-4 py-1 rounded ${
            viewMode === "full" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          전체 보기
        </button>
        <button
          onClick={handleSummarize}
          className={`px-4 py-1 rounded ${
            viewMode === "summary" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          요약 보기
        </button>
      </div>

      <div className="bg-white border p-4 rounded shadow-sm whitespace-pre-wrap">
        {viewMode === "full" ? news.content : summary || "요약된 내용이 없습니다."}
      </div>

      {/* 파일 업로드 */}
      <FileUploadArea onExtractedText={(text) => setUploadedText(text)} />

      {/* 대화 영역 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">AI에게 질문하기</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="예: 이 뉴스와 문서의 관련성은?"
            className="flex-1 px-3 py-2 border rounded"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button
            onClick={handleChatSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            전송
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded border max-h-60 overflow-y-auto space-y-2 text-sm">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
              <span
                className={`inline-block px-3 py-1 rounded ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
