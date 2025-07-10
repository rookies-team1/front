import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchNewsDetail, fetchNewsSummary } from '../utils/api'; // 요약 API 포함
import FileUploadArea from '../components/FileUploadArea';
import ViewToggle from '../components/ViewToggle';
import ChatBox from '../components/ChatBox';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsTitle, setNewsTitle] = useState('');
  const [newsDetail, setNewsDetail] = useState('');
  const [viewMode, setViewMode] = useState('full');
  const [uploadedText, setUploadedText] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState(null);

  // 뉴스 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await fetchNewsDetail(id);
        if (newsData && newsData.data) {
          setNewsTitle(newsData.data.title);
          setNewsDetail(newsData.data.contents);
        } else {
          setError("뉴스 데이터가 잘못되었습니다.");
        }
      } catch (error) {
        setError("뉴스 데이터를 불러오는 데 문제가 발생했습니다.");
        console.error("Error fetching news:", error);
      }
    };

    fetchData();
  }, [id]);

  // 뉴스 요약하기
  const handleSummarize = async () => {
    try {
      setSummary("요약 중입니다...");
      const data = await fetchNewsSummary(id);

      if (data.error) {
        setSummary("❌ 요약 실패: " + data.error_content);
      } else {
        setSummary(data.summary);
      }

      setViewMode('summary');
    } catch (err) {
      console.error("요약 오류:", err);
      setSummary("⚠️ 요약 도중 오류가 발생했습니다.");
    }
  };

  // AI 챗봇 질문 제출
  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    const aiMsg = {
      role: 'ai',
      content: `📡 AI 응답 (예시): "${uploadedText.slice(0, 100)}..."`,
    };

    setChatHistory((prev) => [...prev, userMsg, aiMsg]);
    setChatInput('');
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-screen-lg mx-auto p-6 space-y-6">
      {/* 뒤로가기 */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          ← 뒤로가기
        </button>
      </div>

      {/* 뉴스 제목 */}
      <h2 className="text-3xl font-semibold text-gray-800">{newsTitle}</h2>

      {/* 보기 모드 선택 */}
      <ViewToggle
        viewMode={viewMode}
        onFullView={() => setViewMode('full')}
        onSummaryView={handleSummarize}
      />

      {/* 뉴스 본문 or 요약 */}
      <div className="bg-white border p-6 rounded-lg shadow-lg h-auto max-h-[80vh] overflow-y-auto">
        {viewMode === 'full' ? (
          <p className="text-sm text-gray-600 break-words">{newsDetail}</p>
        ) : (
          <p className="text-sm text-gray-600 break-words">{summary || '요약된 내용이 없습니다.'}</p>
        )}
      </div>

      {/* 파일 업로드 */}
      <FileUploadArea onExtractedText={(text) => setUploadedText(text)} />

      {/* AI 챗봇 */}
      <ChatBox
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatHistory={chatHistory}
        onSubmit={handleChatSubmit}
      />
    </div>
  );
}
