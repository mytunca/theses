export const getThesisMetadataById = async (id) => {
  const hostname = "https://tez.yok.gov.tr/UlusalTezMerkezi";
  const url = `${hostname}/tezDetay.jsp?id=${id}`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    const thesisNo = Number(
      doc
        .querySelector(
          "body > table > tbody > tr:nth-child(2) > td:nth-child(1)"
        )
        .textContent.trim()
    );
    const pdfDownloadLink =
      doc.querySelector(
        "table > tbody > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)"
      )?.href || null;

    const firstTable = Array.from(
      doc.querySelector(
        "body > table > tbody > tr:nth-child(2) > td:nth-child(3)"
      ).childNodes
    ).map((x) => x.data);
    const [thesisTitleOriginal, thesisTitleTranslation] = firstTable[0]
      .trim()
      .split(" /");
    const author = firstTable[2].match(/(?<=Yazar:).+/)[0].trim();
    const supervisor = firstTable[4].match(/(?<=Danışman:).+/)[0].trim();
    const where =
      (/(?<=Yer Bilgisi:).+/.test(firstTable[6]) &&
        firstTable[6].match(/(?<=Yer Bilgisi:).+/)[0].trim()) ||
      "";
    const subject =
      (/(?<=Konu:).+/.test(firstTable[8]) &&
        firstTable[8].match(/(?<=Konu:).+/)[0].trim()) ||
      "";
    const keyword =
      (/(?<=Dizin:).+/.test(firstTable[10]) &&
        firstTable[10].match(/(?<=Dizin:).+/)[0].trim()) ||
      "";

    const secondTable = Array.from(
      doc.querySelector(
        "body > table > tbody > tr:nth-child(2) > td:nth-child(4)"
      ).childNodes
    ).map((x) => x.data);
    const type = secondTable[2].trim();
    const language = secondTable[4].trim();
    const year = Number(secondTable[6].trim());
    const numPages = Number(secondTable[8].trim().match(/\d+/)[0]);

    const abstractTurkish = doc
      .querySelector("#td0")
      .textContent.trim()
      .slice(0, 5000)
      .replace(/\uFFFE/g, " ");

    const abstractEnglish = doc
      .querySelector("#td1")
      .textContent.trim()
      .slice(0, 5000)
      .replace(/\uFFFE/g, " ");

    const result = {
      "Tez No": thesisNo,
      "Tez ID": id,
      "PDF İndirme Linki": pdfDownloadLink,
      "Detay Sayfası Linki": url,
      "Tez Adı (Orijinal)": thesisTitleOriginal,
      "Tez Adı (Çeviri)": thesisTitleTranslation,
      Yazar: author,
      Danışman: supervisor,
      Üniversite: where,
      Konu: subject,
      Dizin: keyword,
      Tür: type,
      Dil: language,
      Yıl: year,
      "Sayfa Sayısı": numPages,
      "Özet (Türkçe)": abstractTurkish,
      "Özet (İngilizce)": abstractEnglish,
    };

    return result;
  } catch (error) {
    throw `Error fetching data for id ${id}: ${error.message}`;
  }
};

export const fetchBulkTheses = async (ids, callback) => {
  const results = [];
  const setTheses = callback;
  const groupSize = 500;

  for (let i = 0; i < ids.length; i += groupSize) {
    const thesesToFetch = ids.slice(i, i + groupSize);
    const promises = thesesToFetch.map((id) =>
      getThesisMetadataById(id)
        .then((metadata) => {
          setTheses((prevTheses) => {
            const newTheses = new Map(prevTheses);
            newTheses.set(id, { metadata, fetched: true });
            return newTheses;
          });
          results.push(metadata);
        })
        .catch((error) => {
          console.error(error);
          setTheses((prevTheses) => {
            const newTheses = new Map(prevTheses);
            newTheses.set(id, { metadata: null, fetched: true });
            return newTheses;
          });
        })
    );

    await Promise.all(promises);
  }

  return results;
};
