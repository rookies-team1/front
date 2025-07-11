//카테고리 버튼 렌더링
export default function CategoryFilter({ companies, selectedCategory, onSelectCategory }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 mb-10 items-start">
      {/* 전체 보기 버튼 */}
      <div>
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-6 py-3 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 ease-in-out
            ${selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-600'}
          `}
        >
          전체 보기
        </button>
      </div>

      {/* 회사 목록 버튼들 */}
      <div className="grid grid-cols-3 gap-4">
        {companies.map((company) => (
          <button
            key={company}
            onClick={() => onSelectCategory(company)}
            className={`px-6 py-3 rounded-xl text-sm font-medium text-center shadow-md transition-all duration-200 ease-in-out
              ${selectedCategory === company
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border hover:bg-blue-100 hover:text-blue-600'}
            `}
          >
            {company}
          </button>
        ))}
      </div>
    </div>
  );
}