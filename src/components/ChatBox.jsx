export default function ChatBox({ chatInput, setChatInput, chatHistory, onSubmit, isWaitingResponse }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">AI에게 질문하기</h3>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="예: 이 뉴스와 문서의 관련성은?"
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          disabled={isWaitingResponse}
        />
        <button
          onClick={onSubmit}
          disabled={isWaitingResponse || !chatInput.trim()}
          className={`px-6 py-2 rounded-md transition-all ${
            isWaitingResponse || !chatInput.trim()
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isWaitingResponse ? '응답 중...' : '전송'}
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-md border max-h-60 overflow-y-auto space-y-4 text-sm">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block px-4 py-2 rounded-md ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {isWaitingResponse && (
          <div className="text-left text-gray-500 animate-pulse">AI 응답 생성 중...</div>
        )}
      </div>
    </div>
  );
}
