import { saveAs } from "file-saver";
import JSZip from "jszip";

const fetchPDF = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return await response.blob();
};

export const downloadAllTexts = async (
  theses,
  setProgressValue,
  setProgressInfo
) => {
  let zip = new JSZip();
  setProgressValue(0);
  let currentChunkSize = 0;
  let chunkIndex = 0;
  let numDownloadedFiles = 0;
  let totalSize = 0;
  const maxChunkSize = 500 * 1024 * 1024;
    
  for (let i = 0; i < theses.length; i++) {
    const { "PDF İndirme Linki": url, "Tez No": name } = theses[i];
    const pdfBlob = await fetchPDF(url);
    const fileName = `${name}.pdf`;
    zip.file(fileName, pdfBlob);
    currentChunkSize += pdfBlob.size;
    totalSize += pdfBlob.size;
    setProgressValue(((100 * ++numDownloadedFiles) / theses.length).toFixed(2));
    setProgressInfo(
      `${numDownloadedFiles} / ${theses.length} tez metni (${(
        totalSize /
        (1024 * 1024)
      ).toFixed(2)} MB) indirildi. \nBellek sorunu yaşamamanız adına PDF dosyaları 500 MB'lık parçalar halinde indirilir.`
    );

    if (
      currentChunkSize >= maxChunkSize ||
      numDownloadedFiles == theses.length
    ) {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Tez_Metinleri_Part_${++chunkIndex}.zip`);
      zip = new JSZip();
      currentChunkSize = 0;
    }
  }
};
