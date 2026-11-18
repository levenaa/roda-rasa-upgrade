// =============================
// KONEKSI SUPABASE
// =============================
import { supabase as supabaseClient } from "./js/supabase.js";

// Variabel untuk menyimpan data cache sementara
let cacheLokasi = [];
let cacheMenu = [];

// Nomor WhatsApp Pemilik Usaha
const nomorWhatsApp = "6282225858304";

// =============================
// JADWAL LOKASI RODA RASA
// =============================

async function loadJadwalLokasi() {
  const container = document.getElementById("lokasi-container");

  const { data, error } = await supabaseClient
    .from("lokasi")
    .select("*")
    .eq("aktif", true);

  if (error) {
    console.error("Gagal memuat jadwal:", error.message);
    container.innerHTML = '<p class="loading-message">Jadwal lokasi belum bisa dimuat.</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="loading-message">Belum ada jadwal lokasi.</p>';
    return;
  }

  container.innerHTML = data.map(lokasi => {
    const status = lokasi.status || "berjualan";

    let keterangan = "";

    if (status === "berjualan") {
      keterangan = "Sedang berjualan";
    } else if (status === "tidak_berjualan") {
      keterangan = "Hari ini Roda Rasa tidak berjualan.";
    } else if (status === "lokasi_menyusul") {
      keterangan = "Lokasi berjualan akan segera diumumkan.";
    }

    return `
      <article class="location-card">
        <h3>${lokasi.hari}</h3>
        <p><strong>Status:</strong> ${keterangan}</p>

        ${status === "berjualan" ? `
          <p><strong>Lokasi:</strong> ${lokasi.nama_lokasi || "-"}</p>
          <p><strong>Alamat:</strong> ${lokasi.alamat || "-"}</p>
          <p><strong>Jam:</strong> ${lokasi.jam || "-"}</p>
          ${lokasi.maps_url ? `
            <a href="${lokasi.maps_url}" target="_blank"
               rel="noopener" class="maps-button">
              Lihat Google Maps
            </a>
          ` : ""}
        ` : ""}
      </article>
    `;
  }).join("");
}

// =============================
// FITUR KARTU MENU DAN FILTER
// =============================
const menuGrid = document.getElementById("menu-container");

async function loadMenu(kategori = "Semua") {
  let query = supabaseClient.from('menu').select('*');

  if (kategori !== "Semua") {
    query = query.eq('kategori', kategori);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Gagal memuat menu:", error.message);
    if (menuGrid) menuGrid.innerHTML = `<p class="text-red-500">Gagal memuat menu dari database.</p>`;
    return;
  }

  cacheMenu = data;
  renderMenu(cacheMenu);
}

function formatRupiah(angka) {
  return "Rp" + Number(angka).toLocaleString("id-ID");
}

function renderMenu(items) {
  if (!menuGrid) return;

  if (!items || items.length === 0) {
    menuGrid.innerHTML = `<p class="text-gray-500 col-span-full text-center py-8">Belum ada menu dalam kategori ini.</p>`;
    return;
  }

  menuGrid.innerHTML = items.map(menu => `
    <article class="food-card">
      <img src="${menu.foto_url || menu.foto}" alt="${menu.nama}" loading="lazy"
           onerror="this.onerror=null;this.src='https://placehold.co/600x400/f1e7d8/493629?text=Foto+Menu';">
      <div class="food-info">
        <span class="food-category">${menu.kategori}</span>
        <h3>${menu.nama}</h3>
        <p>${menu.deskripsi || ''}</p>
        <div class="price">${formatRupiah(menu.harga)}</div>
      </div>
    </article>
  `).join("");
}

// Event listener untuk tombol filter kategori menu (Semua, Makanan, Minuman, Snack)
document.querySelectorAll(".filter").forEach(tombol => {
  tombol.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    tombol.classList.add("active");
    
    // Ambil kategori dari atribut data-category atau teks tombol
    const kategori = tombol.dataset.category || tombol.textContent.trim();
    loadMenu(kategori);
  });
});

// Set tombol WhatsApp
const waButton = document.getElementById("whatsappButton");
if (waButton) {
  waButton.href = "https://wa.me/" + nomorWhatsApp + "?text=" +
    encodeURIComponent("Halo, saya ingin bertanya tentang menu dan lokasi hari ini.");
}

// Jalankan saat halaman dimuat
window.addEventListener("DOMContentLoaded", () => {
  loadJadwalLokasi();
  loadMenu("Semua");
});