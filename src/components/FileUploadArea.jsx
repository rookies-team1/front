import { useState } from "react";
import { uploadFiles } from "../utils/api";

export default function FileUploadArea({ onExtractedText, onFileSelected }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (validateFile(selected)) {
      setFile(selected);
      setError(null);
      onFileSelected(selected);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const validTypes = ["application/pdf", "text/plain"];
    if (!validTypes.includes(file.type)) {
      setError("PDF 또는 TXT 파일만 업로드 가능합니다.");
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (validateFile(dropped)) {
      setFile(dropped);
      onFileSelected(dropped);
      setError(null);
    }
    setDragOver(false);
  };

  const handleFileUpload = async () => {
    if (!file) return setError("파일을 선택해 주세요.");
    try {
      setIsLoading(true);
      const response = await uploadFiles([file]);
      if (response?.data?.text) {
        onExtractedText(response.data.text);
      } else {
        setError("텍스트 추출에 실패했습니다.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">📄 문서 업로드</h4>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-6 text-center ${dragOver ? 'bg-blue-100' : 'bg-gray-50'}`}
      >
        <p className="text-gray-500">{file ? file.name : 'PDF 또는 TXT 파일을 드래그하거나 선택해주세요'}</p>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => document.getElementById('file-upload').click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >파일 선택</button>
        <button
          onClick={handleFileUpload}
          disabled={isLoading || !file}
          className={`px-4 py-2 ${isLoading || !file ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-md hover:bg-blue-700`}
        >{isLoading ? '업로드 중...' : '업로드'}</button>
      </div>

      <input type="file" id="file-upload" accept=".pdf,.txt" className="hidden" onChange={handleFileChange} />

      {file && (
        <div className="mt-2 text-sm text-gray-700">선택된 파일: {file.name}</div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
