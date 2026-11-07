// Nomor WhatsApp Penjual
const NOMOR_WA = '6282137330500';

// Daftar Menu Makanan & Minuman Spesial Warung GAJE
const menu = [
    {
        id: 1,
        nama: 'Nasi Goreng Spesial GAJE',
        harga: 18000,
        gambar: 'https://dcostseafood.id/wp-content/uploads/2023/04/Nasi-Goreng-telor.jpg'
    },
    { 
        id: 2, 
        nama: 'Mie Goreng Dok-Dok', 
        harga: 15000,  
        gambar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqqT0Yq4g1tHls5yA8qdJMOJfs6O2cdoIvDhEPS4ApNw&s=10'
    },
    { 
        id: 3, 
        nama: 'Ayam Geprek Sambal Korek', 
        harga: 17000, 
        gambar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG2dgQQl_mZ0rwteaVKChb8dHUdtbZjnDhS5QW1MwQJQ&s=10' 
    },
    { 
        id: 4, 
        nama: 'Nasi Telur Dadar Crispy', 
        harga: 12000,  
        gambar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvBq3dgYrcNj33_I0mGKpo-icAL8nwUnRx-IqEPYaIpA&s=10' 
    },
    { 
        id: 5, 
        nama: 'Es Teh Manis Jumbo', 
        harga: 4000, 
        gambar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC909gLFFmX-51p_BopZrjbDwEjZyYv-yvBRVzHQ-aUw&s=10' 
    },
    { 
        id: 6, 
        nama: 'Es Jeruk Peras Segar', 
        harga: 6000, 
        gambar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS17KBA8s2OeNgupo0GS-jiXikk_498CwgB5P5Zz7ejlw&s=10' 
    },
    { 
        id: 7, 
        nama: 'Kopi Susu Gula Aren', 
        harga: 12000, 
        gambar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrj01rvaX67M2pqXjETPWS5pF_zrdfWSabY-I7jMx8Q&s=10' 
    }
];

let keranjang = {};

function rupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

function cariMenu(id) {
    return menu.find((m) => m.id === id);
}

function tampilkanMenu() {
    const wadah = document.getElementById('daftar-menu');
    wadah.innerHTML = '';
    
    for (const m of menu) {
        const kartu = document.createElement('article');
        kartu.className = 'kartu menu-kartu';
        kartu.innerHTML = `
            <div class="foto">
                <span class="emoji">${m.emoji}</span>
                <img src="${m.gambar}" alt="${m.nama}" loading="lazy">
            </div>
            <div class="isi">
                <h3>${m.nama}</h3>
                <div class="baris-harga">
                    <span class="harga">${rupiah(m.harga)}</span>
                    <button type="button" class="btn-tambah" style="background:var(--aksen-emas); color:#fff; border:none; padding:6px 12px; border-radius:6px; font-weight:600;">+ Tambah</button>
                </div>
            </div>
        `;

        // Jika gambar gagal dimuat (misal koneksi terputus/link mati), tampilkan emoji
        const img = kartu.querySelector('img');
        img.addEventListener('error', () => img.remove());
        
        kartu.querySelector('.btn-tambah').addEventListener('click', () => ubahJumlah(m.id, 1));
        wadah.appendChild(kartu);
    }
}

function ubahJumlah(id, perubahan) {
    keranjang[id] = (keranjang[id] || 0) + perubahan;
    if (keranjang[id] <= 0) {
        delete keranjang[id];
    }
    tampilkanKeranjang();
}

function hitungTotal() {
    let total = 0;
    for (const id in keranjang) {
        total += cariMenu(Number(id)).harga * keranjang[id];
    }
    return total;
}

function tampilkanKeranjang() {
    const daftar = document.getElementById('isi-keranjang');
    daftar.innerHTML = '';
    let jumlahItem = 0;

    for (const id in keranjang) {
        const m = cariMenu(Number(id));
        const jumlah = keranjang[id];
        jumlahItem += jumlah;

        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${m.nama}</strong><br>
                <small class="redup">${jumlah}x ${rupiah(m.harga)} = ${rupiah(m.harga * jumlah)}</small>
            </div>
            <div class="jumlah">
                <button type="button" class="kurang">-</button>
                <span>${jumlah}</span>
                <button type="button" class="tambah">+</button>
            </div>
        `;
        li.querySelector('.kurang').addEventListener('click', () => ubahJumlah(m.id, -1));
        li.querySelector('.tambah').addEventListener('click', () => ubahJumlah(m.id, 1));
        daftar.appendChild(li);
    }

    document.getElementById('total').textContent = rupiah(hitungTotal());
    document.getElementById('jumlah-item').textContent = jumlahItem;
    document.getElementById('keranjang-kosong').hidden = jumlahItem > 0;
    document.getElementById('tombol-pesan').disabled = jumlahItem === 0;
}

// Proses Kirim Pesanan ke WhatsApp
document.getElementById('tombol-pesan').addEventListener('click', () => {
    const nama = document.getElementById('nama-pemesan').value.trim();
    const alamat = document.getElementById('alamat').value.trim();
    const pembayaran = document.getElementById('metode-bayar').value;

    if (nama === '' || alamat === '') {
        alert('Mohon lengkapi nama pemesan dan alamat/catatan pengiriman.');
        return;
    }

    let teks = `*PESANAN BARU - WARUNG GAJE*\n`;
    teks += `-----------------------------------\n`;
    teks += `👤 *Nama Pemesan:* ${nama}\n`;
    teks += `💳 *Metode Bayar:* ${pembayaran}\n`;
    teks += `📍 *Alamat / Catatan:* ${alamat}\n`;
    teks += `-----------------------------------\n\n`;
    teks += `🛒 *Rincian Pesanan:*\n`;

    for (const id in keranjang) {
        const m = cariMenu(Number(id));
        teks += `• ${m.nama} (${keranjang[id]}x) = ${rupiah(m.harga * keranjang[id])}\n`;
    }

    teks += `\n💵 *TOTAL PEMBAYARAN: ${rupiah(hitungTotal())}*\n`;
    teks += `-----------------------------------\n`;
    teks += `Mohon segera diproses ya, terima kasih!`;

    window.open('https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(teks), '_blank');
});

// Inisialisasi awal
tampilkanMenu();
tampilkanKeranjang();