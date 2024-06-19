import { DownloadButton } from "./DownloadButton"

export function TextDownloader({ disabled, downloadAllThesesTexts }) {

  const handleClick = async () => {
    await downloadAllThesesTexts();
  }

  return <DownloadButton disabled={disabled} handleClick={handleClick}>Tez Metinlerini İndir</DownloadButton>
}