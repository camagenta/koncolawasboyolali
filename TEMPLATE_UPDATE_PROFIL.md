# Template Update Profil Per Pengurus

Gunakan format ini untuk setiap profil yang ingin dikonfirmasi/diupdate.

---

```yaml
# IDENTITAS
nama: "Nama Lengkap (tanpa gelar)"
namaLengkap: "Nama Lengkap dengan Gelar"  # jika ada
jabatan: "Jabatan di IKA"
kategori: "dewan-pembina" | "dewan-pengawas" | "pengurus-pusat" | "bidang"

# DATA DIRI
estimasiAngkatan: "1990"       # perkiraan
tahunLulus: "±1992"           # atau tahun pasti
gender: "Laki-laki" | "Perempuan"
tempatLahir: "Boyolali"       # jika ditemukan
tanggalLahir: ""              # jika ada

# KARIR & POSISI
posisiSaatIni: ""             # posisi/jabatan terkini
posisiSebelumnya: ""          # karir sebelumnya
perusahaan: ""                # perusahaan/instansi

# KONTAK (kosongkan jika tidak tersedia)
linkedin: ""
instagram: ""
email: ""
facebook: ""
github: ""
telepon: ""                   # hanya jika publik

# FOTO
fotoUrl: ""                   # URL foto publik (Wikipedia, LinkedIn, dll)

# CATATAN VERIFIKASI
sumberInfo: ""                # dari mana data diperoleh
verifiedBy: ""                # siapa yang konfirmasi
verifikasiTanggal: ""         # tanggal verifikasi
catatan: ""                   # catatan tambahan (misal: "nama umum, perlu cross-check")
```

---

## Contoh isian

```yaml
nama: "Susilo Siswoutomo"
namaLengkap: "Ir. H. Susilo Siswoutomo"
jabatan: "Dewan Pembina - Ketua"
kategori: "dewan-pembina"
estimasiAngkatan: "1968"
tahunLulus: "1970"
gender: "Laki-laki"
posisiSaatIni: "Wakil Menteri ESDM (2013-2014)"
perusahaan: "ExxonMobil"
linkedin: "https://linkedin.com/in/susilo-siswoutomo"
fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Susilo_Siswoutomo_Official.jpg"
sumberInfo: "Wikipedia, Kementerian ESDM"
verifiedBy: "Data publik"
```

---

## Cara Penggunaan

1. Copy template YAML di atas
2. Isi data yang ditemukan
3. Simpan sebagai `update-{nama}.md` di folder `_updates/`
4. Setelah terkumpul, kita batch-commit ke `profil-pengurus.ts`
