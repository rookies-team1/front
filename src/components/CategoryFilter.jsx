export default function CategoryFilter({ companies, selectedCategory, onSelectCategory }) {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* 전체 보기 버튼도 grid 안으로 이동 */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`py-3 px-4 rounded-xl text-sm font-medium shadow-md transition-all duration-200 ease-in-out
            ${selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-200 hover:bg-blue-100 hover:text-blue-600'}
          `}
        >
          전체 보기
        </button>

        {companies.map((company) => (
          <button
            key={company}
            onClick={() => onSelectCategory(company)}
            className={`py-3 px-4 rounded-xl text-sm font-medium shadow-md transition-all duration-200 ease-in-out
              ${selectedCategory === company
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-100 hover:text-blue-600'}
            `}
          >
            {company}
          </button>
        ))}
      </div>
    </div>
  );
}
