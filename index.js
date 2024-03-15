/**
 * Tez Sorgu Sonuç Sayfasında (https://tez.yok.gov.tr/UlusalTezMerkezi/tezSorguSonucYeni.jsp)
 * o an listelenen tüm tezlerin ID'lerini döndürür.
 *
 * @returns {String[]}
 */
function getThesesIDs() {
  const ids = getData().rows.map(
    (x) => x.userId.match(/(?<=tezDetay\(')[^']*/)[0]
  );

  return ids;
}

async function getDataById(id) {
  const url = `https://tez.yok.gov.tr/UlusalTezMerkezi/tezDetay.jsp?id=${id}`;
  let doc;
  return fetch(url)
    .then((x) => x.text())
    .then((x) => {
      doc = new DOMParser().parseFromString(x, "text/html");
      const thesisNo = Number(
        doc
          .querySelector(
            "body > table > tbody > tr:nth-child(2) > td:nth-child(1)"
          )
          .innerText.trim()
      );
      const firstTable = [
        ...doc.querySelector(
          "body > table > tbody > tr:nth-child(2) > td:nth-child(3)"
        ).childNodes,
      ].map((x) => x.data);
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

      const secondTable = [
        ...doc.querySelector(
          "body > table > tbody > tr:nth-child(2) > td:nth-child(4)"
        ).childNodes,
      ].map((x) => x.data);
      const type = secondTable[2].trim();
      const language = secondTable[4].trim();
      const year = Number(secondTable[6].trim());
      const numPages = Number(secondTable[8].trim().match(/\d+/)[0]);

      const abstractTurkish = doc
        .querySelector("#td0")
        .innerText.trim()
        .slice(0, 5000);
      const abstractEnglish = doc
        .querySelector("#td1")
        .innerText.trim()
        .slice(0, 5000);

      return {
        "Tez No": thesisNo,
        "Tez ID": id,
        "Detay Sayfası Linki": `https://tez.yok.gov.tr/UlusalTezMerkezi/tezDetay.jsp?id=${id}`,
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
    });
  //.catch((err)=>console.error(id, err));
}

function exportToExcel(data) {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.1/xlsx.full.min.js";
  document.body.appendChild(script);

  script.onload = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tez Verileri");
    XLSX.writeFile(wb, "Tez Verileri.xlsx");
  };
}

async function getBatchData(ids) {
  const result = [];
  const promises = ids.map((id) => getDataById(id));

  return Promise.all(promises);
}

async function main() {
  const result = [];
  const ids = getThesesIDs();
  let total = 0;

  console.log("Tezlerin detayları sorgulanıyor, lütfen bekleyiniz.");

  for (let i = 0; i < ids.length; i += 500) {
    const batchData = await getBatchData(ids.slice(i, i + 500));
    total += batchData.length;
    console.log(
      `Şu ana kadar toplam ${total} tezin verisi sorgulandı. İşlem devam ediyor.`
    );

    result.push(...batchData);
  }

  console.log("Tamamlandı.");
  console.log(result);

  exportToExcel(result);
}

main();
