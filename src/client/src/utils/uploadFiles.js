import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

export const handleFileUpload = async (file, characterLimit, setFilesizeWarning, setFileContent) => {
  // CASE 0 - NO FILE
  if (!file) return;

  // CASE 1 - TXT file
  if (file.name.endsWith(".txt")) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const text = e.target.result;
      if (text.length > characterLimit) {
        setFilesizeWarning(`File size exceeds ${characterLimit} characters. Please upload a smaller file.`);
        setFileContent("");
      } else {
        setFilesizeWarning("");
        setFileContent(text);
      }
    };
    fileReader.readAsText(file);
  }

  // CASE 2 - PDF file
  else if (file.name.endsWith(".pdf")) {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const arr1 = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument({ data: arr1 }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      if (text.length > characterLimit) {
        setFilesizeWarning(`File size exceeds ${characterLimit} characters. Please upload a smaller file.`);
        setFileContent("");
      } else {
        setFilesizeWarning("");
        setFileContent(text);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }

  // CASE 3 - DOCX file
  else if (file.name.endsWith(".docx")) {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const arr2 = e.target.result;
      const result = await mammoth.extractRawText({ arrayBuffer: arr2 });
      const text = result.value;
      if (text.length > characterLimit) {
        setFilesizeWarning(`File size exceeds ${characterLimit} characters. Please upload a smaller file.`);
        setFileContent("");
      } else {
        setFilesizeWarning("");
        setFileContent(text);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }

  // CASE 4 - UNSUPPORTED FILES
  else {
    alert("Only .txt, .docx, and .pdf files are supported.");
  }
};

