import { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // axios 인스턴스 가져오기

export default function FileUploadArea({ onExtractedText }) {
  const [fileNames, setFileNames] = useState([]); // 파일명 상태
  const [files, setFiles] = useState([]); // 선택된 파일 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFileNames(selectedFiles.map((file) => file.name)); // 파일명 상태 업데이트
    setFiles(selectedFiles); // 선택된 파일 상태 업데이트

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 서버에서 받은 텍스트를 상태로 업데이트
      onExtractedText(response.data.text);
    } catch (error) {
      setError("파일 업로드에 실패했습니다.");
      console.error("Error uploading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileCancel = (index) => {
    const updatedFileNames = fileNames.filter((_, i) => i !== index);
    const updatedFiles = files.filter((_, i) => i !== index);

    setFileNames(updatedFileNames);
    setFiles(updatedFiles);
    onExtractedText(""); // 텍스트 초기화
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">📄 문서 업로드</h4>

      {/* 파일 선택 버튼 */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all duration-300"
      >
        <i className="fas fa-upload mr-2"></i> 파일 선택
      </label>
      <input
        type="file"
        id="file-upload"
        accept=".txt,.pdf"
        onChange={handleFileChange}
        className="hidden"
        multiple // 다중 파일 선택 허용
      />

      {/* 업로드된 파일 리스트 */}
      {fileNames.length > 0 && (
        <div className="mt-2 space-y-2">
          {fileNames.map((fileName, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{fileName}</span>
              <button
                onClick={() => handleFileCancel(index)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                취소
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && <p className="text-blue-500">파일 업로드 중...</p>}

      {/* 에러 상태 */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
