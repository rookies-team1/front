import { useState } from "react";
import { uploadFiles } from "../utils/api"; // api.js에서 uploadFiles 함수 가져오기

export default function FileUploadArea({ onExtractedText }) {
  const [files, setFiles] = useState([]);  // 선택된 파일 목록
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const [dragOver, setDragOver] = useState(false);  // 드래그 상태

  // 파일 선택시 처리
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);  // 기존 파일 목록에 새로운 파일 추가
    setError(null);  // 에러 초기화
  };

  // 드래그한 파일을 처리하는 함수
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);  // 드래그한 파일을 기존 파일 목록에 추가
    setError(null);  // 에러 초기화
    setDragOver(false);
  };

  // 파일 업로드 처리
  const handleFileUpload = async () => {
    if (files.length === 0) {
      setError("파일을 선택해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // API로 파일 업로드 요청
      const response = await uploadFiles(files);  // api.js의 uploadFiles 함수 호출

      // 서버에서 텍스트 데이터를 반환했다면
      if (response.data && response.data.text) {
        onExtractedText(response.data.text);  // 텍스트 처리 후 부모 컴포넌트로 전달
      }

    } catch (error) {
      setError('파일 업로드에 실패했습니다.');
      console.error('파일 업로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 취소 처리
  const handleFileCancel = (fileName) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);  // 선택된 파일 목록에서 해당 파일 삭제
    setFiles(updatedFiles);  // 상태 업데이트
    setError(null);  // 에러 초기화
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">📄 문서 업로드</h4>

      {/* 드래그 앤 드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-6 text-center ${dragOver ? 'bg-blue-100' : 'bg-gray-50'}`}
      >
        <p className="text-gray-500">{files.length === 0 ? '파일을 드래그하거나 선택해주세요' : files.map(file => file.name).join(', ')}</p>
      </div>

      {/* 파일 업로드 버튼 */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => document.getElementById('file-upload').click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          파일 선택
        </button>
        <button
          onClick={handleFileUpload}
          disabled={isLoading || files.length === 0}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isLoading ? 'bg-gray-400' : ''}`}
        >
          {isLoading ? '업로드 중...' : '파일 업로드'}
        </button>
      </div>

      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        multiple // 다중 파일 선택 가능
        accept=".txt, .pdf" // 텍스트와 PDF 파일만 받음
        className="hidden"
      />

      {/* 파일 목록 및 취소 버튼 */}
      {files.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  onClick={() => handleFileCancel(file.name)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  취소
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
