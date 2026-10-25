
const readline = require("readline");

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function tanya(pesan) {
  return new Promise(resolve => {
    input.question(pesan, resolve);
  });
}

async function bacaAngka(pesan) {
  while (true) {
    const teks = await tanya(pesan);
    const angka = Number(teks);

    if (Number.isInteger(angka)) {
      return angka;
    }

    console.log("Masukkan angka yang valid!");
  }
}

// CLASS PRODUK PULSA
class ProdukPulsa {
  constructor(nominal, harga) {
    this.nominal = nominal;
    this.harga = harga;
  }

  tampilkanProduk() {
    console.log(
      `Pulsa Rp${this.nominal.toLocaleString("id-ID")} | Harga Rp${this.harga.toLocaleString("id-ID")}`
    );
  }
}

// CLASS PELANGGAN
class Pelanggan {
  #saldo;

  constructor(nomorHP, saldo) {
    this.nomorHP = nomorHP;
    this.#saldo = saldo;
  }

  get saldo() {
    return this.#saldo;
  }

  kurangiSaldo(jumlah) {
    if (jumlah > 0 && jumlah <= this.#saldo) {
      this.#saldo -= jumlah;
      return true;
    }

    return false;
  }

  tampilkanSaldo() {
    console.log(
      `Saldo Anda: Rp${this.#saldo.toLocaleString("id-ID")}`
    );
  }
}

// CLASS KATALOG PULSA
class KatalogPulsa {
  constructor() {
    this.daftarProduk = [
      new ProdukPulsa(5000, 6000),
      new ProdukPulsa(10000, 11000),
      new ProdukPulsa(20000, 21000),
      new ProdukPulsa(50000, 51000),
      new ProdukPulsa(100000, 101000)
    ];
  }

  tampilkanProduk() {
    console.log("\n===== DAFTAR PULSA =====");

    this.daftarProduk.forEach((produk, index) => {
      process.stdout.write(`${index + 1}. `);
      produk.tampilkanProduk();
    });
  }

  pilihProduk(pilihan) {
    if (pilihan >= 1 && pilihan <= this.daftarProduk.length) {
      return this.daftarProduk[pilihan - 1];
    }

    return null;
  }
}

// CLASS TRANSAKSI
class Transaksi {
  static nomorTransaksi = 1;

  constructor(nomorTujuan, produk) {
    this.idTransaksi = `TRX${Transaksi.nomorTransaksi++}`;
    this.nomorTujuan = nomorTujuan;
    this.produk = produk;
    this.status = "Menunggu";
    this.tanggal = new Date();
  }

  get totalHarga() {
    return this.produk.harga;
  }

  cetakStruk() {
    console.log("\n===== STRUK PEMBELIAN =====");
    console.log(`ID Transaksi : ${this.idTransaksi}`);
    console.log(`Tanggal      : ${this.tanggal.toLocaleString("id-ID")}`);
    console.log(`Nomor Tujuan : ${this.nomorTujuan}`);
    console.log(`Nominal      : Rp${this.produk.nominal.toLocaleString("id-ID")}`);
    console.log(`Harga        : Rp${this.totalHarga.toLocaleString("id-ID")}`);
    console.log(`Status       : ${this.status}`);
    console.log("===========================");
  }
}

// CLASS PEMBAYARAN
class Pembayaran {
  prosesPembayaran(pelanggan, transaksi) {
    const total = transaksi.totalHarga;

    if (pelanggan.saldo >= total) {
      pelanggan.kurangiSaldo(total);
      transaksi.status = "Berhasil";
      return true;
    }

    transaksi.status = "Gagal - Saldo tidak cukup";
    return false;
  }
}

// FUNGSI PEMBELIAN PULSA
async function beliPulsa(
  pelanggan,
  katalog,
  pembayaran,
  riwayat
) {
  console.log("\n===== PEMBELIAN PULSA =====");

  const nomorTujuan = await tanya("Masukkan nomor HP tujuan: ");

  if (!/^08\d{8,11}$/.test(nomorTujuan)) {
    console.log("Nomor HP tidak valid!");
    return;
  }

  katalog.tampilkanProduk();

  const pilihan = await bacaAngka("\nPilih nominal pulsa: ");
  const produk = katalog.pilihProduk(pilihan);

  if (!produk) {
    console.log("Produk tidak tersedia!");
    return;
  }

  console.log("\n===== KONFIRMASI PEMBELIAN =====");
  console.log(`Nomor Tujuan : ${nomorTujuan}`);
  console.log(`Nominal      : Rp${produk.nominal.toLocaleString("id-ID")}`);
  console.log(`Harga        : Rp${produk.harga.toLocaleString("id-ID")}`);
  console.log(`Saldo Anda   : Rp${pelanggan.saldo.toLocaleString("id-ID")}`);

  console.log("\n1. Konfirmasi");
  console.log("2. Batalkan");

  const konfirmasi = await bacaAngka("Pilihan: ");

  if (konfirmasi !== 1) {
    console.log("Pembelian dibatalkan!");
    return;
  }

  const transaksi = new Transaksi(nomorTujuan, produk);

  const berhasil = pembayaran.prosesPembayaran(
    pelanggan,
    transaksi
  );

  riwayat.push(transaksi);

  if (berhasil) {
    console.log("\nPembelian berhasil!");
    transaksi.cetakStruk();
    pelanggan.tampilkanSaldo();
  } else {
    console.log("\nPembelian gagal! Saldo tidak mencukupi.");
    transaksi.cetakStruk();
  }
}

// FUNGSI RIWAYAT TRANSAKSI
function tampilkanRiwayat(riwayat) {
  console.log("\n===== RIWAYAT TRANSAKSI =====");

  if (riwayat.length === 0) {
    console.log("Belum ada transaksi.");
    return;
  }

  riwayat.forEach(transaksi => {
    transaksi.cetakStruk();
  });
}

// PROGRAM UTAMA
async function main() {
  const pelanggan = new Pelanggan("081234567890", 150000);
  const katalog = new KatalogPulsa();
  const pembayaran = new Pembayaran();
  const riwayatTransaksi = [];

  let pilihan;

  do {
    console.log("\n================================");
    console.log("       SISTEM POS PENJUALAN");
    console.log("================================");
    console.log("1. Beli Pulsa");
    console.log("2. Cek Saldo");
    console.log("3. Riwayat Transaksi");
    console.log("0. Keluar");
    console.log("================================");

    pilihan = await bacaAngka("Pilih menu: ");

    switch (pilihan) {
      case 1:
        await beliPulsa(
          pelanggan,
          katalog,
          pembayaran,
          riwayatTransaksi
        );
        break;

      case 2:
        pelanggan.tampilkanSaldo();
        break;

      case 3:
        tampilkanRiwayat(riwayatTransaksi);
        break;

      case 0:
        console.log("Terima kasih!");
        break;

      default:
        console.log("Pilihan tidak tersedia!");
    }

  } while (pilihan !== 0);

  input.close();
}

main();
