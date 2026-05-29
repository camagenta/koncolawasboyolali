export const cityCoords: Record<string, [number, number]> = {
  Jakarta: [-6.2088, 106.8456],
  Surabaya: [-7.2575, 112.7521],
  Bandung: [-6.9175, 107.6191],
  Medan: [3.5952, 98.6722],
  Semarang: [-6.9931, 110.4203],
  Makassar: [-5.1477, 119.4323],
  Yogyakarta: [-7.7956, 110.3695],
  Palembang: [-2.9761, 104.7754],
  Batam: [1.0456, 104.0305],
  Pekanbaru: [0.5071, 101.4478],
  Denpasar: [-8.6705, 115.2126],
  Malang: [-7.9797, 112.6304],
  Bogor: [-6.5971, 106.806],
  Solo: [-7.5667, 110.8281],
  Tangerang: [-6.1783, 106.63],
  Depok: [-6.4025, 106.7942],
  Bekasi: [-6.2383, 106.9916],
  Padang: [-0.9471, 100.4172],
  Samarinda: [-0.4948, 117.1436],
  Banjarmasin: [-3.3186, 114.5944],
  Manado: [1.4748, 124.8421],
  Pontianak: [-0.0263, 109.3425],
  Balikpapan: [-1.2379, 116.8529],
  Jambi: [-1.6101, 103.6131],
  Kupang: [-10.1772, 123.607],
  Mataram: [-8.5833, 116.1167],
  Kendari: [-3.972, 122.5208],
  Palu: [-0.8915, 119.8707],
  Gorontalo: [0.5435, 123.0568],
  Ambon: [-3.6554, 128.1909],
  Jayapura: [-2.5337, 140.7181],
  Boyolali: [-7.5333, 110.5958],
  Ampel: [-7.4486, 110.5625],
  Andong: [-7.3761, 110.7481],
  Banyudono: [-7.5319, 110.6881],
  Cepogo: [-7.5161, 110.5289],
  Gladagsari: [-7.4350, 110.5056],
  Juwangi: [-7.5250, 110.7236],
  Karanggede: [-7.3583, 110.6639],
  Kemusu: [-7.3000, 110.7167],
  Klego: [-7.3500, 110.6889],
  Mojosongo: [-7.5378, 110.6550],
  Musuk: [-7.5639, 110.5436],
  Ngemplak: [-7.4833, 110.6778],
  Nogosari: [-7.4333, 110.7083],
  Sambi: [-7.4917, 110.6500],
  Sawit: [-7.5542, 110.6361],
  Selo: [-7.5250, 110.4639],
  Simo: [-7.5167, 110.6917],
  Tamansari: [-7.4542, 110.5436],
  Teras: [-7.5000, 110.6333],
  Wonosamodro: [-7.3833, 110.6167],
  Wonosegoro: [-7.2833, 110.6833],
  Klaten: [-7.7058, 110.6064],
  Salatiga: [-7.3305, 110.5084],
  Magelang: [-7.4799, 110.2177],
  Sukoharjo: [-7.6108, 110.8281],
  Kartasura: [-7.5522, 110.7438],
  Karanganyar: [-7.5964, 110.9469],
  Sragen: [-7.4261, 111.0169],
  Wonogiri: [-7.8256, 110.9192],
  Purwodadi: [-7.0871, 110.9156],
  Cilacap: [-7.7178, 109.0152],
  Tasikmalaya: [-7.3274, 108.2207],
  Cirebon: [-6.7064, 108.557],
  Serang: [-6.1158, 106.1504],
  'Bandar Lampung': [-5.4505, 105.2546],
  'Banda Aceh': [5.5483, 95.3238],
  'Tanjung Pinang': [0.9169, 104.4445],
  Palangkaraya: [-2.2114, 113.9193],
  Mamuju: [-2.6778, 118.8933],
  Ternate: [0.7801, 127.3308],
  Sorong: [-0.8742, 131.2852],
}

const KECAMATAN_BOYOLALI = new Set([
  'Ampel', 'Andong', 'Banyudono', 'Boyolali', 'Cepogo', 'Gladagsari',
  'Juwangi', 'Karanggede', 'Kemusu', 'Klego', 'Mojosongo', 'Musuk',
  'Ngemplak', 'Nogosari', 'Sambi', 'Sawit', 'Selo', 'Simo',
  'Tamansari', 'Teras', 'Wonosamodro', 'Wonosegoro'
])

export function normalizeKecamatan(raw: string): string {
  if (!raw || !raw.trim()) return ''
  const trimmed = raw.trim()
  const lower = trimmed.toLowerCase()

  const cleaned = trimmed
    .replace(/^(Kec\.|Kecamatan|Kec)\s+/i, '')
    .replace(/\s+Kota$/i, '')
    .replace(/[,.]?\s*Boyolali$/i, '')
    .replace(/^Boyolali\s+/i, '')
    .trim()

  for (const k of KECAMATAN_BOYOLALI) {
    if (cleaned.toLowerCase() === k.toLowerCase()) return k
  }
  for (const k of KECAMATAN_BOYOLALI) {
    if (lower === k.toLowerCase()) return k
  }
  return ''
}

export function getCityCoord(city: string): [number, number] {
  const normalized = city.trim()
  if (cityCoords[normalized]) return cityCoords[normalized]
  const kec = normalizeKecamatan(normalized)
  if (kec && cityCoords[kec]) return cityCoords[kec]
  for (const [key, coord] of Object.entries(cityCoords)) {
    if (normalized.toLowerCase() === key.toLowerCase()) return coord
  }
  return cityCoords.Boyolali
}
