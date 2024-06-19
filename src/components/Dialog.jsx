import { useEffect, useState } from "preact/hooks";
import { ProgressBar } from "./ProgressBar";
import { MetadataFetcher } from "./MetadataFetcher";
import { TextDownloader } from "./TextDownloader";
import { fetchBulkTheses } from "../utils/thesesMetadata";
import { downloadAllTexts } from "../utils/thesesTexts";

export function Dialog({ container, open, handleClose }) {
  const [info, setInfo] = useState("");
  const [theses, setTheses] = useState(new Map());
  const [allThesesMetadataFetched, setAllThesesMetadataFetched] = useState(false);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [progressValue, setProgressValue] = useState();
  const [progressInfo, setProgressInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      // getData(), sayfada mevcut olan, sorgu sonucu dönen veriyi getiren bir fonksiyondur.
      const getData = window["getData"];
      const data = getData().rows?.reduce((map, x) => {
        const id = x.userId.match(/(?<=tezDetay\(')([^']*)/)[1];
        map.set(id, { metadata: null, fetched: false });
        return map;
      }, new Map());
      setTheses(data);
    } catch (e) {
      throw alert(`Bir hata oluştu. Hata mesajı: ${e.message}`);
    }
  }, []);

  useEffect(() => {
    if (container) {
      container.dialog({
        title: "Veri İndir",
        show: { effect: "blind", duration: 200 },
        autoOpen: false,
        modal: true,
        minHeight: 400,
        minWidth: 400,
        resizable: false,
        close: handleClose,
      });
    }
  }, [container]);

  useEffect(() => {
    if (container) {
      if (open) {
        container.dialog("open");
        if (theses.size) {
          setInfo(
            `${theses.size
            } tez listeleniyor. \n\nTezlerin ayrıntılı metaverilerini ve metinlerini indirmek için butonlara tıklayınız.`
          );
          setIsDownloadable(true);
        } else {
          setInfo("Sayfada listelenen tez bulunmamaktadır.");
        }
      } else {
        container.dialog("close");
      }
    }
  }, [open, container, theses]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = true;
    };

    if (loading) window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [loading])

  const fetchAllThesesMetadata = async () => {
    const ids = [...theses.keys()];

    let results;
    if (allThesesMetadataFetched) {
      results = [...theses.values()].map(thesis => thesis.metadata)
    }
    else {
      setLoading(true);
      setProgressLabel("Tez metaverileri indiriliyor...");
      results = await fetchBulkTheses(ids, setTheses);
      setProgressLabel("");
      setLoading(false);
    }

    return results;
  };

  const downloadAllThesesTexts = async () => {
    const thesesToDownload = (await fetchAllThesesMetadata()).filter(thesis => thesis["PDF İndirme Linki"]);

    setLoading(true);
    setProgressLabel("Tez metinleri indiriliyor...");

    await downloadAllTexts(thesesToDownload, setProgressValue, setProgressInfo);

    setProgressLabel("");
    setLoading(false);
  };

  return (
    <>
      <a href="https://github.com/mytunca/theses" target="_blank" class="github-corner" aria-label="View source on Github">
        <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
        </svg>
      </a>
      <h3>Tez Merkezi<br />Veri Kazıma Aracı</h3>
      <span style={{whiteSpace:"pre-line"}}>{info}</span>
      <hr />
      <MetadataFetcher
        disabled={!isDownloadable || loading}
        theses={theses}
        setAllThesesMetadataFetched={setAllThesesMetadataFetched}
        fetchAllThesesMetadata={fetchAllThesesMetadata}
        setProgressValue={setProgressValue}
      />
      <TextDownloader
        disabled={!isDownloadable || loading}
        downloadAllThesesTexts={downloadAllThesesTexts}
      />

      {loading && (
        <>
          <hr />
          <ProgressBar value={progressValue} label={progressLabel} info={progressInfo} />
        </>
      )}
      <span style={{ float: "right", color: "#999", fontSize: "xx-small", marginTop: 20 }}>by Muhammet Yunus Tunca</span>

    </>
  );
}
