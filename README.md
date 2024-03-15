## YÖK Ulusal Tez Merkezi Veri Kazıma Aracı

Bu "repository", Yükseköğretim Kurulu (YÖK) Ulusal Tez Merkezi'nde bulunan tezlerin detaylı verilerine erişimi kolaylaştırmak için geliştirilen bir JavaScript kodunu içerir.

YÖK Ulusal Tez Merkezi'nde, tezlerle ilgili temel bilgiler (tez no, yazar, yıl, tez adı, üniversite, dil, tez türü ve konu) bir tablo halinde listelenir. Ancak, daha ayrıntılı bilgilere erişmek için her bir tezin detay sayfasına tek tek tıklamak gereklidir. Bu süreci otomatikleştirmek için geliştirilen bu JavaScript kodu, web tarayıcısı geliştirici araçları (DevTools) kullanılarak tablodaki tüm tezlerin detaylı verilerine erişimi sağlar.

**Özellikler:**

- YÖK Ulusal Tez Merkezi'nde listelenen tezlerin detaylı verilerine erişimi otomatikleştirir.
- Tez numarası, yazar adı, yayın yılı, tez adı, tez türü ve konu gibi bilgilerin yanı sıra daha fazla detay içeren verilere (dizin, sayfa sayısı, özet) erişim sağlar.
- JavaScript kullanarak tarayıcıda çalışır, ayrı bir yazılım yüklemenizi gerektirmez.
- Verileri Microsoft Excel dosyası olarak indirmenize olanak tanır.

Bu repo, araştırmacılar ve veri bilimcileri için YÖK Ulusal Tez Merkezi'nden veri toplamayı ve analiz etmeyi kolaylaştırmayı amaçlamaktadır.

**Kullanım:**

1. [YÖK Ulusal Tez Merkezi](https://tez.yok.gov.tr/UlusalTezMerkezi/)'nde istediğiniz aramayı yapın.
2. Sonuçların listelendiği https://tez.yok.gov.tr/UlusalTezMerkezi/tezSorguSonucYeni.jsp sayfası açıldığında F12 tuşuna basarak tarayıcınızın geliştirici araçlarını açın ve **Console** sekmesine geçin.
3. [index.js](index.js) dosyasında bulunan kodu kopyalayın. Konsola kodu yapıştırıp **Enter** tuşuna basın.
5. Sorgulama sonucunda dönen tüm tezlerin detaylı verileri Excel dosyası olarak inecektir. (İşlem birkaç dakika sürebilir.)

**Notlar:** 
1. Bu kodun kullanımı, YÖK Ulusal Tez Merkezi'nin kullanım koşullarına uygun olmalıdır. Veri toplama ve kullanma konusunda YÖK'ün politikalarını göz önünde bulundurun.
2. YÖK Ulusal Tez Merkezi'nde yapılan aramalar, tek seferde en fazla 2000 tezin verisini listelemektedir. 
    >Tarama sonucunda 13472 kayıt bulundu. 2000 tanesi görüntülenmektedir. 
    
    şeklinde bir uyarıyla karşılaşmanız halinde arama kriterlerinizi genişleterek listelenen tez sayısını 2000'in altına düşürmeye çalışın. 
    
    Örneğin arama yaptığınız kriterleri sağlayan toplam 5000 civarı tez varsa onar yıllık periyotlar halinde sorgulama yaparsanız tek seferde listelenen tez sayısı muhtemelen 2000'in altına düşecektir.

3. Bu kod 15.03.2024 tarihi itibarıyla çalışmaktadır. Ancak sayfanın kodlarında değişiklik yapılması durumunda kodun çalışmayı durdurma ihtimali her zaman mevcuttur.