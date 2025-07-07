import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchNewsTitle, fetchNewsDetail } from '../utils/api'; // api.js에서 Axios 요청 함수 가져오기
import FileUploadArea from '../components/FileUploadArea';

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
  const [error, setError] = useState(null); // 추가된 에러 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const title = await fetchNewsTitle(id); // 뉴스 제목 가져오기
        const detail = await fetchNewsDetail(id); // 뉴스 상세 내용 가져오기
        setNewsTitle(title);
        setNewsDetail(detail);
      } catch (error) {
        setError("뉴스 데이터를 불러오는 데 문제가 발생했습니다.");  // 에러 처리
        console.error("Error fetching news:", error);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <p>{error}</p>;  // 에러 메시지 출력
  }

  if (!newsTitle || !newsDetail) {
    return <p>해당 뉴스가 존재하지 않습니다.</p>;
  }

  const handleViewToggle = (mode) => setViewMode(mode);

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

  const handleSummarize = () => {
    const result = `${newsTitle}\n${newsDetail}\n(※ 실제로는 LangChain 요약 결과가 들어갑니다)`;
    setSummary(result);
    setViewMode('summary');
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

      <h2 className="text-2xl font-bold">{newsTitle}</h2>

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => handleViewToggle('full')}
          className={`px-4 py-1 rounded-md ${viewMode === 'full' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          전체 보기
        </button>
        <button
          onClick={handleSummarize}
          className={`px-4 py-1 rounded-md ${viewMode === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          요약 보기
        </button>
      </div>

      <div className="bg-white border p-4 rounded shadow-sm">
        {viewMode === 'full' ? (
          <p className="text-sm text-gray-600 break-words">{newsDetail}</p>
        ) : (
          <p className="text-sm text-gray-600 break-words">{summary || '요약된 내용이 없습니다.'}</p>
        )}
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
            className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button
            onClick={handleChatSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            전송
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md border max-h-60 overflow-y-auto space-y-2 text-sm">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <span
                className={`inline-block px-3 py-1 rounded-md ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}
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
