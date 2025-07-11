import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchNewsDetail, fetchNewsSummary } from '../utils/api';
import FileUploadArea from '../components/FileUploadArea';
import ViewToggle from '../components/ViewToggle';
import ChatBox from '../components/ChatBox';
import LoadingSpinner from '../components/LoadingSpinner'; // ✅ 추가

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const groupSentences = (sentences, n = 3) => {
    const groups = [];
    for (let i = 0; i < sentences.length; i += n) {
      groups.push(sentences.slice(i, i + n).join(' '));
    }
    return groups;
  };

  const textToDisplay = viewMode === 'full' ? newsDetail : summary || '요약된 내용이 없습니다.';
  const sentenceList = textToDisplay.split(/(?<=\.)\s+/);
  const paragraphList = groupSentences(sentenceList, 3);

  if (error) return <p className="text-red-500">{error}</p>;
  if (isLoading) return <LoadingSpinner text="뉴스를 불러오는 중입니다..." />;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-10 space-y-10">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          ← 뒤로가기
        </button>
      </div>

      <h2 className="text-4xl font-bold text-gray-900">{newsTitle}</h2>

      <ViewToggle
        viewMode={viewMode}
        onFullView={() => setViewMode('full')}
        onSummaryView={handleSummarize}
      />

      <div className="w-full bg-white border p-10 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
        {paragraphList.map((para, idx) => (
          <p
            key={idx}
            className="text-lg md:text-xl leading-relaxed text-gray-800 font-serif mb-6"
            style={{ textIndent: '2em', whiteSpace: 'pre-wrap' }}
          >
            {para.trim()}
          </p>
        ))}
      </div>

      <FileUploadArea onExtractedText={(text) => setUploadedText(text)} />

      <ChatBox
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatHistory={chatHistory}
        onSubmit={handleChatSubmit}
      />
    </div>
  );
}
