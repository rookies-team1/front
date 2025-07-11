import { VscLoading } from "react-icons/vsc";

export default function LoadingSpinner({ text = "로딩 중입니다..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-700 gap-4">
      <VscLoading className="animate-spin text-7xl font-bold text-blue-600 drop-shadow-md" />
      <p className="text-xl font-semibold">{text}</p>
    </div>
  );
}
