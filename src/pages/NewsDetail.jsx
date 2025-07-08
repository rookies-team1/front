import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchNewsDetail } from '../utils/api'; // API에서 가져오기
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await fetchNewsDetail(id);  // 뉴스 상세 내용 호출

        // 로그 추가: 데이터 확인
        console.log("Received news data:", newsData);

        // newsData가 유효한지 확인 후 데이터를 업데이트
        if (newsData && newsData.data) {
          setNewsTitle(newsData.data.title);  // 뉴스 제목 설정
          setNewsDetail(newsData.data.contents);  // 뉴스 내용 설정
        } else {
          setError("뉴스 데이터가 잘못되었습니다.");
        }
      } catch (error) {
        setError("뉴스 데이터를 불러오는 데 문제가 발생했습니다.");
        console.error("Error fetching news:", error);
      }
    };

    fetchData();  // 데이터 호출
  }, [id]);

  // 에러가 있을 경우
  if (error) {
    return <p className="text-red-500">{error}</p>;
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

      {/* 보기 모드 선택 버튼 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleViewToggle('full')}
          className={`px-6 py-2 rounded-md text-sm font-medium ${viewMode === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition-all`}
        >
          전체 보기
        </button>
        <button
          onClick={handleSummarize}
          className={`px-6 py-2 rounded-md text-sm font-medium ${viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition-all`}
        >
          요약 보기
        </button>
      </div>

      {/* 뉴스 본문 */}
      <div className="bg-white border p-6 rounded-lg shadow-lg h-auto max-h-[80vh] overflow-y-auto">
        {viewMode === 'full' ? (
          <p className="text-sm text-gray-600 break-words">{newsDetail}</p>
        ) : (
          <p className="text-sm text-gray-600 break-words">{summary || '요약된 내용이 없습니다.'}</p>
        )}
      </div>

      {/* 파일 업로드 */}
      <FileUploadArea onExtractedText={(text) => setUploadedText(text)} />

      {/* AI 질문 */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">AI에게 질문하기</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="예: 이 뉴스와 문서의 관련성은?"
            className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button
            onClick={handleChatSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            전송
          </button>
        </div>
        <div className="bg-gray-50 p-6 rounded-md border max-h-60 overflow-y-auto space-y-4 text-sm">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <span
                className={`inline-block px-4 py-2 rounded-md ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}
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
