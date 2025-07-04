import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

export default function FileUploadArea({ onExtractedText }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        onExtractedText(reader.result);
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
      }

      onExtractedText(text);
    } else {
      alert("PDF 또는 텍스트 파일만 업로드 가능합니다.");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4>📄 문서 업로드</h4>
      <input type="file" accept=".txt,.pdf" onChange={handleFileChange} />
      {fileName && <p>업로드된 파일: {fileName}</p>}
    </div>
  );
}
