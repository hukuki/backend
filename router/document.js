const express = require('express');

const router = express.Router();

router.get('/:id', (req, res) => {
    res.send([
        {
            "type": "header",
            "content": "TAPU KANUNU VE BAZI KANUNLARDA DEĞİŞİKLİK"
        },
        {
            "type": "header",
            "content": "YAPILMASINA DAİR KANUN"
        },
        {
            "type": "header",
            "content": "Kanun Numarası                    : 7181"
        },
        {
            "type": "header",
            "content": "Kabul Tarihi                           : 4/7/2019"
        },
        {
            "type": "header",
            "content": "Yayımlandığı Resmî Gazete   : Tarih : 10/7/2019         Sayı : 30827"
        },
        {
            "type": "header",
            "content": "MADDE 1 –2– 3 –4– (22/12/1934 tarihli ve 2644 sayılı Tapu Kanunu ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 5 –(23/6/1965 tarihli ve 634 sayılı Kat Mülkiyeti Kanunu ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 6 – 7- 8- 9- 10- 11- 12- 13- 14- 15-(3/5/1985 tarihli ve 3194 sayılı İmar Kanunu ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 16 – 17- 18- (29/6/2001 tarihli ve 4706 sayılı Hazineye Ait Taşınmaz Malların Değerlendirilmesi ve Katma Değer Vergisi Kanununda Değişiklik Yapılması Hakkında Kanun ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 19 – (22/11/2001 tarihli ve 4721 sayılı Türk Medeni Kanunu ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 20 – (3/7/2005 tarihli ve 5393 sayılı Belediye Kanunu ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 21 – (3/7/2005 tarihli ve 5403 sayılı Toprak Koruma ve Arazi Kullanımı Kanunu ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 22 – 23- (19/4/2012 tarihli ve 6292 sayılı Orman Köylülerinin Kalkınmalarının Desteklenmesi ve Hazine Adına Orman Sınırları Dışına Çıkarılan Yerlerin Değerlendirilmesi ile Hazineye Ait Tarım Arazilerinin Satışı Hakkında Kanun ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "header",
            "content": "MADDE 24 – 25- 26- 27- (16/5/2012 tarihli ve 6306 sayılı Afet Riski Altındaki Alanların Dönüştürülmesi Hakkında Kanun ile ilgili olup yerine işlenmiştir.)"
        },
        {
            "type": "madde",
            "maddeStr": "GEÇİCİ MADDE 1 –",
            "number": 1,
            "content": "(1) Çevre ve Şehircilik Bakanlığı Milli Emlak Genel Müdürlüğü kadrolarında bulunan ve sınav tarihi itibarıyla en az üç yıl görev yapan, uyarma ve kınama hariç son üç yıl içinde herhangi bir disiplin cezası almayan, Milli Emlak Uzmanı olabilmek için yaş ve öğrenim alanı şartları hariç mevzuatında öngörülen diğer şartları taşıyan personelden; usul ve esasları Milli Emlak Genel Müdürlüğü tarafından belirlenerek bu maddenin yayımı tarihinden itibaren, beş yıl içinde iki defa yapılacak sınavda başarılı olanlar, Milli Emlak Uzmanı kadrolarına atanırlar.",
            "subsections": []
        },
        {
            "type": "madde",
            "maddeStr": "MADDE 28 –",
            "number": 28,
            "content": "(1) Bu Kanunun;",
            "subsections": [
                {
                    "type": "text",
                    "content": "a\\) 1 inci maddesi, 3 üncü maddesi ile 19 uncu maddesi 1/1/2020 tarihinde,"
                },
                {
                    "type": "text",
                    "content": "b\\) Diğer maddeleri yayımı tarihinde,"
                },
                {
                    "type": "text",
                    "content": "yürürlüğe girer."
                }
            ]
        },
        {
            "type": "madde",
            "maddeStr": "MADDE 29 –",
            "number": 29,
            "content": "(1) Bu Kanun hükümlerini Cumhurbaşkanı yürütür.",
            "subsections": []
        }
    ])
});

module.exports = router;