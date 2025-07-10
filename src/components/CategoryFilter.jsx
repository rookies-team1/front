//카테고리 버튼 렌더링
export default function CategoryFilter({ companies, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          selectedCategory === null
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-blue-300'
        } transition-all duration-200 ease-in ml-auto`}
      >
        전체 보기
      </button>

      {companies.map((company) => (
        <button
          key={company}
          onClick={() => onSelectCategory(company)}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            selectedCategory === company
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-blue-300'
          } transition-all duration-200 ease-in`}
        >
          {company}
        </button>
      ))}
    </div>
  );
}