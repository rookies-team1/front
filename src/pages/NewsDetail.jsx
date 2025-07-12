import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchNewsDetail, fetchNewsSummary, fetchChatResponse } from '../utils/api';
import { useSummaryStore } from '../store/summaryStore';
import FileUploadArea from '../components/FileUploadArea';
import ViewToggle from '../components/ViewToggle';
import ChatBox from '../components/ChatBox';
import LoadingSpinner from '../components/LoadingSpinner';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsTitle, setNewsTitle] = useState('');
  const [newsDetail, setNewsDetail] = useState('');
  const [viewMode, setViewMode] = useState('full');
  const [uploadedFile, setUploadedFile] = useState(null); // ✅ 파일 상태만 유지
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const summaryMap = useSummaryStore((state) => state.summaryMap);
  const summary = summaryMap[id];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const newsData = await fetchNewsDetail(id);
        if (newsData?.data) {
          setNewsTitle(newsData.data.title);
          setNewsDetail(newsData.data.contents);
        } else {
          setError('뉴스 데이터가 잘못되었습니다.');
          return;
        }

        const { hasSummary, setSummary } = useSummaryStore.getState();
        if (!hasSummary(id)) {
          const summaryData = await fetchNewsSummary(id);
          if (summaryData.error) {
            setSummary(id, '❌ 요약 실패: ' + summaryData.error_content);
          } else {
            setSummary(id, summaryData.summary);
          }
        }
      } catch (error) {
        console.error('데이터 요청 오류:', error);
        setError('뉴스 또는 요약 데이터를 불러오는 데 문제가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsWaitingResponse(true);

    try {
      const aiMsg = await fetchChatResponse({
        newsId: id,
        file: uploadedFile,
        question: chatInput,
      });

      setChatHistory((prev) => [...prev, { role: 'ai', content: aiMsg }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', content: '⚠️ AI 응답을 불러오는 데 실패했습니다.' },
      ]);
    } finally {
      setChatInput('');
      setIsWaitingResponse(false);
    }
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

  if (error)
    return <p className="text-red-500 font-semibold">{error}</p>;
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="뉴스 및 요약을 불러오는 중입니다..." />
      </div>
    );

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
        onSummaryView={() => setViewMode('summary')}
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

      <FileUploadArea onFileSelected={(file) => setUploadedFile(file)} />

      <ChatBox
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatHistory={chatHistory}
        onSubmit={handleChatSubmit}
        isWaitingResponse={isWaitingResponse}
      />
    </div>
  );
}
