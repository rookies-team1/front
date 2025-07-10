export default function ChatBox({ chatInput, setChatInput, chatHistory, onSubmit }) {
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
        />
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          전송
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
      </div>
    </div>
  );
}