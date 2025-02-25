const user = {
  name: prompt("Adınızı girin:"),
  age: Number(prompt("Yaşınızı girin:")),
  job: prompt("Mesleğinizi girin:"),
};

console.log(user);

var sepet = [];

function addProduct() {
  var productName = prompt("Ürünü yazınız:");
  var productPrice = Number(prompt("Ürünün fiyatı:"));

  if (productName && !isNaN(productPrice) && productPrice > 0) {
    sepet.push({ isim: productName, fiyat: productPrice });
    console.log(
      `${productName} ürünü sepete eklendi. Fiyatı: ${productPrice} TL`
    );
  } else {
    console.log("Hatalı giriş!");
  }
}

function removeProduct(productName, productPrice) {
  var oncekiUzunluk = sepet.length;

  sepet = sepet.filter(
    (urun) => urun.isim.toLowerCase() !== productName.toLowerCase()
  );

  if (sepet.length < oncekiUzunluk) {
    console.log(`${productName} ürünü sepetten çıkarıldı.`);
  } else {
    console.log("Ürün bulunamadı.");
  }
}

function sepetiListele() {
  console.log("Sepetteki ürünler");
  if (sepet.length === 0) {
    console.log("Sepet boş.");
  } else {
    sepet.map((urun, index) =>
      console.log(`${index + 1}. ${urun.isim} - ${urun.fiyat} TL`)
    );
  }
}

function toplamFiyatHesapla() {
  let toplamFiyat = sepet.reduce((toplam, urun) => toplam + urun.fiyat, 0);
  console.log(`Sepetin toplam fiyatı: ${toplamFiyat} TL`);
  return toplamFiyat;
}

addProduct();
console.log(sepetiListele());
console.log(sepet);
