import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatBox({
  chatInput,
  setChatInput,
  chatHistory,
  onSubmit,
  isWaitingResponse,
}) {
  const bottomRef = useRef(null);
  const [typingMessage, setTypingMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const lastAiMsg = [...chatHistory]
    .reverse()
    .find((msg) => msg.role === "ai" && !!msg.content);

  useEffect(() => {
    if (isWaitingResponse || !lastAiMsg?.content) {
      setTypingMessage("");
      setIsTyping(false);
      return;
    }

    let i = 0;
    const text = lastAiMsg.content ?? "";
    setTypingMessage("");
    setIsTyping(true);

    const interval = setInterval(() => {
      setTypingMessage((prev) => {
        const next = prev + text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
        return next;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [lastAiMsg?.content, isWaitingResponse]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, typingMessage]);

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">AI에게 질문하기</h3>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="예: 이 뉴스와 문서의 관련성은?"
          className="flex-1 px-4 py-3 border text-base rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          disabled={isWaitingResponse}
        />
        <button
          onClick={onSubmit}
          disabled={isWaitingResponse || !chatInput.trim()}
          className={`px-6 py-2 rounded-md font-semibold text-base transition-all ${
            isWaitingResponse || !chatInput.trim()
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isWaitingResponse ? "응답 중..." : "전송"}
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-md border min-h-[180px] max-h-[600px] overflow-y-auto space-y-4 text-base leading-relaxed">
        {chatHistory.map((msg, idx) => {
          const isLastAi = msg === lastAiMsg;
          return (
            <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block px-4 py-3 rounded-md whitespace-pre-wrap text-left break-words max-w-full ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.role === "ai" && isLastAi && isTyping ? (
                  <ReactMarkdown>{typingMessage ?? ""}</ReactMarkdown>
                ) : msg.role === "ai" ? (
                  <ReactMarkdown>{msg.content ?? ""}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          );
        })}

        {isWaitingResponse && (
          <div className="text-left text-gray-500 animate-pulse">
            AI 응답 생성 중...
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
