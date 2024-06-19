import { DownloadButton } from "./DownloadButton";
import { exportToExcel } from "../utils/dataExporter";
import { useEffect } from "preact/hooks";

export function MetadataFetcher({ disabled, theses, setAllThesesMetadataFetched, fetchAllThesesMetadata, setProgressValue }) {

  useEffect(() => {
    const numFetchedTheses = [...theses.values()].filter(x => x.fetched).length;
    const progressValue = Math.round((100 * numFetchedTheses) / theses.size);
    setProgressValue(progressValue);

    setAllThesesMetadataFetched(numFetchedTheses === theses.size);
  }, [theses]);

  const handleClick = async () => {
    const results = await fetchAllThesesMetadata();

    exportToExcel(results);
  };

  return <DownloadButton disabled={disabled} handleClick={handleClick}>Metaveri İndir</DownloadButton>
}