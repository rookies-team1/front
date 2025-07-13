import { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";

export default function LoadingSpinner({ text = "로딩 중입니다...", startTime }) {
  const [seconds, setSeconds] = useState(() => {
    return startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] pt-32 text-gray-700 gap-4">
      <VscLoading className="animate-spin text-7xl font-bold text-blue-600 drop-shadow-md" />
      <p className="text-xl font-semibold">
        {text} <span className="text-gray-400 font-normal">({seconds}초)</span>
      </p>
    </div>
  );
}