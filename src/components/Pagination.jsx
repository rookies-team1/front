// - 뉴스 개수에 따라 페이지 버튼 렌더링
export default function Pagination({ total, currentPage, perPage, onPageChange }) {
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="mt-8 flex justify-center gap-6">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentPage === index + 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-blue-300'
          } transition-all duration-200 ease-in`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}