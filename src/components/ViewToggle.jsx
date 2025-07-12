const baseClass = "px-6 py-2 rounded-md text-sm font-medium transition-all";

export default function ViewToggle({ viewMode, onFullView, onSummaryView }) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onFullView}
        className={`${baseClass} ${
          viewMode === "full"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        전체 보기
      </button>
      <button
        onClick={onSummaryView}
        className={`${baseClass} ${
          viewMode === "summary"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        요약 보기
      </button>
    </div>
  );
}
