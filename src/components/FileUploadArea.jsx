import { useState } from "react";

export default function FileUploadArea({ onFileSelected }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (validateFile(selected)) {
      setFile(selected);
      setError(null);
      onFileSelected(selected);
      setIsUploaded(false); // 다시 선택하면 업로드 가능하게
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
      setError(null);
      onFileSelected(dropped);
      setIsUploaded(false);
    }
    setDragOver(false);
  };

  const handleUploadClick = () => {
    if (!file) {
      setError("파일을 먼저 선택해주세요.");
      return;
    }
    setIsUploaded(true); // ✅ 한번만 업로드
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

      <div className="flex justify-end mt-2 gap-2">
        <button
          onClick={() => document.getElementById('file-upload').click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          파일 선택
        </button>
        <button
          onClick={handleUploadClick}
          disabled={!file || isUploaded}
          className={`px-4 py-2 rounded-md ${
            !file || isUploaded
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isUploaded ? '업로드 완료' : '업로드'}
        </button>
      </div>

      <input type="file" id="file-upload" accept=".pdf,.txt" className="hidden" onChange={handleFileChange} />
      {file && <p className="text-sm text-gray-700">선택된 파일: {file.name}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
