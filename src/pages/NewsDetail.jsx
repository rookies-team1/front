import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  fetchNewsDetail,
  fetchNewsSummary,
  fetchChatResponse,
  fetchChatHistory,
} from '../utils/api';
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
  const [uploadedText, setUploadedText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryStartTime, setSummaryStartTime] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [chatReady, setChatReady] = useState(false);

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
        }

        const history = await fetchChatHistory(id);
        setChatHistory(history);
      } catch (error) {
        console.error('데이터 요청 오류:', error);
        setError('뉴스 데이터를 불러오는 데 문제가 발생했습니다.');
      } finally {
        setIsLoading(false);
        setChatReady(true); // ✅ 로딩이 끝난 이후에만 chatReady true
      }
    };

    fetchData();
  }, [id]);

  const handleSummaryView = async () => {
    setViewMode('summary');
    const { hasSummary, setSummary } = useSummaryStore.getState();

    if (!hasSummary(id) && !isSummarizing) {
      try {
        setSummaryError(null);
        setSummaryStartTime(Date.now());
        setIsSummarizing(true);

        const summaryData = await fetchNewsSummary(id);
        if (summaryData.error) {
          setSummary(id, `❌ 요약 실패: ${summaryData.error_content}`);
          setSummaryError(summaryData.error_content);
        } else {
          setSummary(id, summaryData.summary);
        }
      } catch (error) {
        console.error('요약 요청 실패:', error);
        setSummary(id, '❌ 요약 실패: 알 수 없는 오류');
        setSummaryError('알 수 없는 오류');
      } finally {
        setIsSummarizing(false);
      }
    }
  };

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
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', content: '⚠️ AI 응답을 불러오는 데 실패했습니다.' },
      ]);
    } finally {
      setChatInput('');
      setIsWaitingResponse(false);
    }
  };

  const textToDisplay =
    viewMode === 'full'
      ? newsDetail
      : summaryError
      ? ''
      : summary || '요약된 내용이 없습니다.';

  const sentenceList = textToDisplay.split(/(?<=\.)\s+/);
  const groupSentences = (sentences, n = 3) => {
    const groups = [];
    for (let i = 0; i < sentences.length; i += n) {
      groups.push(sentences.slice(i, i + n).join(' '));
    }
    return groups;
  };

  const paragraphList = groupSentences(sentenceList, 3);

  if (error) return <p className="text-red-500 font-semibold">{error}</p>;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="뉴스를 불러오는 중입니다..." />
      </div>
    );

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-10 space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        ← 뒤로가기
      </button>

      <h2 className="text-4xl font-bold text-gray-900">{newsTitle}</h2>

      <ViewToggle
        viewMode={viewMode}
        onFullView={() => setViewMode('full')}
        onSummaryView={handleSummaryView}
        disabled={isSummarizing}
      />

      <div className="w-full bg-white border p-10 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto min-h-[200px]">
        {viewMode === 'summary' && isSummarizing ? (
          <LoadingSpinner
            text="AI가 뉴스를 열심히 요약 중입니다!"
            startTime={summaryStartTime}
          />
        ) : viewMode === 'summary' && summaryError ? (
          <div className="text-center space-y-4">
            <p className="text-red-500 text-lg font-semibold">
              ⚠️ 요약에 실패했습니다: {summaryError}
            </p>
            <button
              onClick={handleSummaryView}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              다시 시도하기
            </button>
          </div>
        ) : (
          paragraphList.map((para, idx) => (
            <p
              key={idx}
              className="text-lg md:text-xl leading-relaxed text-gray-800 font-serif mb-6"
              style={{ textIndent: '2em', whiteSpace: 'pre-wrap' }}
            >
              {para.trim()}
            </p>
          ))
        )}
      </div>

      {!(viewMode === 'summary' && (isSummarizing || summaryError)) && (
        <>
          <FileUploadArea
            onExtractedText={(text) => setUploadedText(text)}
            onFileSelected={(file) => setUploadedFile(file)}
          />

          {chatReady && (
            <ChatBox
              chatInput={chatInput}
              setChatInput={setChatInput}
              chatHistory={chatHistory}
              onSubmit={handleChatSubmit}
              isWaitingResponse={isWaitingResponse}
            />
          )}
        </>
      )}
    </div>
  );
}