import { useCategoryStore } from "../store/categoryStore";

const companies = ["삼성전자", "LG", "카카오", "네이버", "현대차"];

export default function CompanyCategoryList() {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  return (
    <div className="mb-4 flex gap-2">
      {companies.map((company) => (
        <button
          key={company}
          onClick={() => setSelectedCategory(company)}
          className={`px-3 py-1 rounded border ${
            selectedCategory === company
              ? "bg-blue-500 text-white"
              : "bg-white text-black border-gray-300"
          }`}
        >
          {company}
        </button>
      ))}
    </div>
  );
}
