
import { supabase } from "./js/supabase.js";

// Format harga menjadi Rupiah
function formatRupiah(harga) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(harga);
}

// Tampilkan tahun saat ini
document.getElementById("tahun").textContent =
  new Date().getFullYear();

// AMBIL DATA MENU
async function tampilkanMenu() {
  const container = document.getElementById("menu-container");

  const { data, error } = await supabase
    .from("menu")
    .select("*")
    .eq("tersedia", true)
    .order("nama", { ascending: true });

  if (error) {
    console.error("Gagal mengambil menu:", error.message);
    container.innerHTML =
      '<p class="empty-message">Menu belum bisa dimuat. Silakan coba lagi nanti.</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML =
      '<p class="empty-message">Belum ada menu tersedia.</p>';
    return;
  }

  container.innerHTML = data.map(menu => `
    <article class="menu-card">
      <img
        src="${menu.foto_url || "https://placehold.co/600x400?text=Roda+Rasa"}"
        alt="${menu.nama}"
        loading="lazy"
      >

      <div class="menu-card-content">
        <span class="menu-category">${menu.kategori || "Menu"}</span>
        <h3>${menu.nama}</h3>
        <p>${menu.deskripsi || "Menu lezat dari Roda Rasa."}</p>
        <div class="menu-price">${formatRupiah(menu.harga)}</div>
      </div>
    </article>
  `).join("");
}

// AMBIL DATA LOKASI
async function tampilkanLokasi() {
  const container = document.getElementById("lokasi-container");

  const { data, error } = await supabase
    .from("lokasi")
    .select("*")
    .eq("aktif", true);

  if (error) {
    console.error("Gagal mengambil lokasi:", error.message);
    container.innerHTML =
      '<p class="empty-message">Lokasi belum bisa dimuat.</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML =
      '<p class="empty-message">Belum ada jadwal lokasi jualan.</p>';
    return;
  }

  container.innerHTML = data.map(lokasi => `
    <article class="location-card">
      <h3>${lokasi.nama_lokasi}</h3>
      <p><strong>Hari:</strong> ${lokasi.hari}</p>
      <p><strong>Alamat:</strong> ${lokasi.alamat || "-"}</p>
      <p><strong>Jam:</strong> ${lokasi.jam || "-"}</p>

      ${
        lokasi.maps_url
          ? `<a
              href="${lokasi.maps_url}"
              target="_blank"
              rel="noopener"
              class="maps-button"
            >Lihat Google Maps</a>`
          : ""
      }
    </article>
  `).join("");
}

// JALANKAN KEDUANYA
tampilkanMenu();
tampilkanLokasi();
