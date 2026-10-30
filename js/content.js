// ============================================================
//  Umrah Aamani — kandungan rujukan (Mazhab Syafie, ringkas)
//  Semak semula dengan guru / panduan Lembaga Tabung Haji.
// ============================================================

export const DOA = {
  niat: {
    id: 'niat', tajuk: 'Niat Umrah',
    arab: 'نَوَيْتُ الْعُمْرَةَ وَأَحْرَمْتُ بِهَا لِلَّهِ تَعَالَى',
    rumi: "Nawaitul 'umrata wa ahramtu bihā lillāhi ta'ālā",
    maksud: 'Sahaja aku berniat umrah dan berihram dengannya kerana Allah Ta\'ala.',
    bila: 'Di miqat, selepas memakai pakaian ihram dan solat sunat ihram.'
  },
  labbaik: {
    id: 'labbaik', tajuk: 'Lafaz Ringkas Niat',
    arab: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
    rumi: "Labbaikallāhumma 'umratan",
    maksud: 'Aku sahut panggilan-Mu ya Allah untuk mengerjakan umrah.',
    bila: 'Dilafazkan bersama niat di miqat.'
  },
  talbiah: {
    id: 'talbiah', tajuk: 'Talbiah',
    arab: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    rumi: 'Labbaikallāhumma labbaik, labbaika lā syarīka laka labbaik, innal-hamda wan-ni\'mata laka wal-mulk, lā syarīka lak',
    maksud: 'Aku datang menyahut panggilan-Mu ya Allah. Tiada sekutu bagi-Mu. Sesungguhnya segala puji, nikmat dan kerajaan adalah milik-Mu. Tiada sekutu bagi-Mu.',
    bila: 'Dibaca berulang kali selepas niat sehingga mula tawaf. Lelaki menyaringkan suara, wanita perlahan.'
  },
  masukMasjid: {
    id: 'masukMasjid', tajuk: 'Doa Masuk Masjid',
    arab: 'بِسْمِ اللهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    rumi: "Bismillāh, was-salātu was-salāmu 'alā Rasūlillāh. Allāhummaftah lī abwāba rahmatik",
    maksud: 'Dengan nama Allah, selawat dan salam ke atas Rasulullah. Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    bila: 'Ketika melangkah masuk Masjidil Haram dengan kaki kanan.'
  },
  istilam: {
    id: 'istilam', tajuk: 'Istilam',
    arab: 'بِسْمِ اللهِ وَاللهُ أَكْبَرُ',
    rumi: 'Bismillāhi wallāhu akbar',
    maksud: 'Dengan nama Allah, dan Allah Maha Besar.',
    bila: 'Setiap kali melintasi garisan Hajar Aswad: menghadap Hajar Aswad, angkat tangan kanan, kemudian kucup tangan.'
  },
  rabbana: {
    id: 'rabbana', tajuk: 'Doa Rukun Yamani – Hajar Aswad',
    arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    rumi: "Rabbanā ātinā fid-dunyā hasanah, wa fil-ākhirati hasanah, wa qinā 'adzāban-nār",
    maksud: 'Wahai Tuhan kami, kurniakanlah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami daripada azab neraka.',
    bila: 'Antara Rukun Yamani dan Hajar Aswad dalam setiap pusingan tawaf.'
  },
  safa: {
    id: 'safa', tajuk: 'Di Bukit Safa',
    arab: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللهِ، أَبْدَأُ بِمَا بَدَأَ اللهُ بِهِ',
    rumi: "Innas-safā wal-marwata min sya'ā'irillāh. Abda'u bimā bada'allāhu bih",
    maksud: 'Sesungguhnya Safa dan Marwah adalah sebahagian daripada syiar Allah. Aku mulakan dengan apa yang Allah mulakan.',
    bila: 'Ketika naik ke Bukit Safa sebelum memulakan sa\'i, menghadap Kaabah.'
  },
  lampuHijau: {
    id: 'lampuHijau', tajuk: 'Antara Dua Lampu Hijau',
    arab: 'رَبِّ اغْفِرْ وَارْحَمْ، وَأَنْتَ الْأَعَزُّ الْأَكْرَمُ',
    rumi: "Rabbighfir warham, wa antal-a'azzul-akram",
    maksud: 'Wahai Tuhanku, ampunkanlah dan rahmatilah. Sesungguhnya Engkau Maha Perkasa lagi Maha Pemurah.',
    bila: 'Ketika melalui kawasan antara dua lampu hijau semasa sa\'i.'
  }
};

export const STAGES = [
  { id: 'kenali',  no: 1, icon: 'stage-kenali', nama: 'Kenali Umrah',   sub: 'Rukun & wajib',          emoji: '📖', warna: '#CDE7F7', jenis: 'learn' },
  { id: 'ihram',   no: 2, icon: 'stage-ihram', nama: 'Ihram di Miqat',  sub: 'Niat, talbiah, larangan', emoji: '🤍', warna: '#E3DAF7', jenis: 'ihram' },
  { id: 'tawaf',   no: 3, icon: 'stage-tawaf', nama: 'Tawaf 3D',        sub: '7 pusingan Kaabah',       emoji: '🕋', warna: '#F8D3DE', jenis: 'tawaf' },
  { id: 'sai',     no: 4, icon: 'stage-sai', nama: "Sa'i 3D",         sub: 'Safa ke Marwah',          emoji: '⛰️', warna: '#F6E3C2', jenis: 'sai' },
  { id: 'tahallul',no: 5, icon: 'stage-tahallul', nama: 'Tahallul',        sub: 'Bergunting / bercukur',   emoji: '✂️', warna: '#CFEFDF', jenis: 'tahallul' },
  { id: 'kuiz',    no: 6, icon: 'stage-kuiz', nama: 'Kuiz Juara',      sub: '10 soalan rawak',         emoji: '🏆', warna: '#FBE7A8', jenis: 'final' }
];

export const KENALI_KAD = [
  { tajuk: 'Apa itu Umrah?', isi: 'Umrah ialah menziarahi Baitullah (Kaabah) untuk beribadah dengan syarat-syarat tertentu. Ia boleh dibuat bila-bila masa sepanjang tahun.', ikon: 'kad-apa-umrah' },
  { tajuk: '5 Rukun Umrah', isi: 'Wajib dibuat. Kalau tertinggal, umrah tidak sah.', senarai: ['Niat ihram', 'Tawaf', "Sa'i", 'Bercukur / bergunting', 'Tertib (ikut susunan)'], ikon: 'kad-rukun' },
  { tajuk: '2 Wajib Umrah', isi: 'Kalau tertinggal, umrah tetap sah tetapi dikenakan dam (denda).', senarai: ['Berihram dari miqat', 'Menjauhi larangan ihram'], ikon: 'kad-wajib' },
  { tajuk: 'Miqat', isi: 'Sempadan tempat mula berihram. Jemaah dari Madinah berihram di Bir Ali (Zulhulaifah). Jemaah yang terbang terus ke Jeddah berniat dalam kapal terbang sebelum melintasi miqat.', ikon: 'kad-miqat' }
];

export const KENALI_KUIZ = [
  { s: 'Berapakah bilangan rukun umrah?', p: ['3', '5', '7'], j: 1 },
  { s: 'Yang manakah BUKAN rukun umrah?', p: ['Tawaf', "Sa'i", 'Berihram dari miqat'], j: 2, nota: 'Berihram dari miqat ialah WAJIB umrah, bukan rukun.' },
  { s: 'Jika tertinggal wajib umrah, apa yang berlaku?', p: ['Umrah tidak sah', 'Umrah sah tetapi kena dam', 'Tiada apa-apa'], j: 1 },
  { s: 'Jemaah dari Madinah berihram di mana?', p: ['Bir Ali', 'Jeddah', 'Arafah'], j: 0 }
];

export const IHRAM_LANGKAH = [
  { id: 'mandi',  label: 'Mandi sunat ihram', ikon: 'langkah-mandi' },
  { id: 'pakai',  label: 'Pakai pakaian ihram', ikon: 'langkah-pakai-ihram' },
  { id: 'solat',  label: 'Solat sunat ihram 2 rakaat', ikon: 'langkah-solat' },
  { id: 'niat',   label: 'Niat umrah di miqat', ikon: 'langkah-niat' },
  { id: 'talbiah',label: 'Baca talbiah', ikon: 'langkah-talbiah' }
];

// b = boleh, l = larangan ; g = khusus lelaki (m) / wanita (f)
export const LARANGAN = [
  { t: 'Memakai minyak wangi', a: 'l', ikon: 'larangan-wangian' },
  { t: 'Memotong kuku', a: 'l', ikon: 'larangan-kuku' },
  { t: 'Memakai jam tangan', a: 'b', ikon: 'larangan-jam' },
  { t: 'Memburu binatang darat', a: 'l', ikon: 'larangan-buru' },
  { t: 'Memakai cermin mata', a: 'b', ikon: 'larangan-cermin-mata' },
  { t: 'Bertengkar dan bercakap kasar', a: 'l', ikon: 'larangan-bertengkar' },
  { t: 'Berpayung di bawah panas', a: 'b', ikon: 'larangan-payung' },
  { t: 'Mencabut atau mencukur rambut', a: 'l', ikon: 'larangan-cukur' },
  { t: 'Lelaki memakai kopiah', a: 'l', ikon: 'larangan-kopiah' },
  { t: 'Wanita menutup muka (purdah)', a: 'l', ikon: 'larangan-purdah' },
  { t: 'Wanita memakai sarung tangan', a: 'l', ikon: 'larangan-sarung-tangan' },
  { t: 'Mandi dengan sabun tanpa wangian', a: 'b', ikon: 'larangan-sabun' },
  { t: 'Lelaki memakai baju berjahit', a: 'l', ikon: 'larangan-baju-jahit' },
  { t: 'Membaca al-Quran dan berzikir', a: 'b', ikon: 'larangan-zikir' }
];

export const SELEPAS_TAWAF = [
  { tajuk: 'Solat Sunat Tawaf', isi: 'Solat 2 rakaat, sebaik-baiknya di belakang Maqam Ibrahim jika tidak sesak. Boleh juga di mana-mana dalam masjid.', ikon: 'selepas-solat-tawaf' },
  { tajuk: 'Minum Air Zamzam', isi: 'Minum sambil berdoa memohon ilmu yang bermanfaat, rezeki yang luas dan penyembuhan.', ikon: 'selepas-zamzam' },
  { tajuk: 'Berdoa di Multazam', isi: 'Multazam ialah ruang antara Hajar Aswad dan pintu Kaabah. Tempat mustajab untuk berdoa jika mampu sampai.', ikon: 'selepas-doa' }
];

export const SYARAT_TAWAF = [
  'Suci daripada hadas dan najis',
  'Menutup aurat',
  'Kaabah sentiasa di sebelah kiri',
  'Bermula dan berakhir di garisan Hajar Aswad',
  'Cukup 7 pusingan',
  'Di luar Kaabah dan Hijir Ismail'
];

export const KUIZ_AKHIR = [
  { s: 'Tawaf dimulakan dari mana?', p: ['Rukun Yamani', 'Garisan Hajar Aswad', 'Maqam Ibrahim'], j: 1 },
  { s: 'Semasa tawaf, Kaabah berada di sebelah…', p: ['Kanan', 'Kiri', 'Belakang'], j: 1 },
  { s: 'Berapa pusingan tawaf?', p: ['5', '7', '9'], j: 1 },
  { s: "Sa'i dimulakan di bukit…", p: ['Marwah', 'Safa', 'Uhud'], j: 1 },
  { s: "Sa'i berakhir di bukit…", p: ['Marwah', 'Safa', 'Rahmah'], j: 0 },
  { s: "Satu laluan sa'i ialah…", p: ['Safa → Marwah → Safa', 'Safa → Marwah', 'Keliling Kaabah'], j: 1 },
  { s: 'Bila talbiah berhenti dibaca semasa umrah?', p: ['Selepas tahallul', 'Apabila mula tawaf', 'Di miqat'], j: 1 },
  { s: 'Bacaan ketika istilam ialah…', p: ['Bismillāhi wallāhu akbar', 'Subhānallāh', 'Astaghfirullāh'], j: 0 },
  { s: 'Doa "Rabbanā ātinā…" dibaca antara…', p: ['Safa dan Marwah', 'Rukun Yamani dan Hajar Aswad', 'Pintu masjid dan Kaabah'], j: 1 },
  { s: 'Minimum rambut untuk bergunting ialah…', p: ['1 helai', '3 helai', 'Semua rambut'], j: 1 },
  { s: 'Siapa disunatkan berlari-lari anak antara lampu hijau?', p: ['Lelaki', 'Wanita', 'Semua'], j: 0 },
  { s: 'Memakai minyak wangi semasa ihram hukumnya…', p: ['Dibolehkan', 'Larangan ihram', 'Sunat'], j: 1 },
  { s: 'Solat sunat tawaf sebaik-baiknya di belakang…', p: ['Maqam Ibrahim', 'Bukit Safa', 'Hijir Ismail'], j: 0 },
  { s: 'Ruang antara Hajar Aswad dan pintu Kaabah dipanggil…', p: ['Mataf', 'Multazam', 'Mas\'a'], j: 1 },
  { s: 'Tawaf di dalam Hijir Ismail…', p: ['Sah', 'Tidak dikira', 'Lebih afdal'], j: 1 },
  { s: 'Wanita bergunting rambut sekadar…', p: ['Hujung rambut seruas jari', 'Separuh rambut', 'Botak'], j: 0 }
];

export const BADGES = [
  { id: 'mula',      nama: 'Langkah Pertama', ikon: 'badge-mula', desc: 'Mulakan perjalanan umrah' },
  { id: 'kenali',    nama: 'Si Celik Ilmu',   ikon: 'badge-kenali', desc: 'Tamatkan "Kenali Umrah"' },
  { id: 'ihram',     nama: 'Berpakaian Putih',ikon: 'badge-ihram', desc: 'Selesai berihram di miqat' },
  { id: 'larangan',  nama: 'Penjaga Ihram',   ikon: 'badge-larangan', desc: 'Jawab semua larangan ihram dengan betul' },
  { id: 'tawaf',     nama: 'Tujuh Pusingan',  ikon: 'badge-tawaf', desc: 'Lengkapkan 7 pusingan tawaf' },
  { id: 'istilam',   nama: 'Istilam Sempurna',ikon: 'badge-istilam', desc: 'Istilam di setiap pusingan' },
  { id: 'sai',       nama: 'Pejalan Safa',    ikon: 'badge-sai', desc: "Lengkapkan 7 laluan sa'i" },
  { id: 'hijau',     nama: 'Lampu Hijau',     ikon: 'badge-hijau', desc: 'Baca doa di semua kawasan lampu hijau' },
  { id: 'tahallul',  nama: 'Tahallul!',       ikon: 'badge-tahallul', desc: 'Selesai bergunting / bercukur' },
  { id: 'umrah',     nama: 'Umrah Selesai',   ikon: 'badge-umrah', desc: 'Tamatkan semua rukun mengikut tertib' },
  { id: 'juara',     nama: 'Juara Umrah',     ikon: 'badge-juara', desc: 'Skor penuh dalam Kuiz Juara' },
  { id: 'doa',       nama: 'Pengumpul Doa',   ikon: 'badge-doa', desc: 'Buka semua 8 doa dalam Kitab Doa' }
];

export const LEVELS = [
  { min: 0,    nama: 'Musafir Kecil' },
  { min: 150,  nama: 'Pengembara Ilmu' },
  { min: 400,  nama: 'Bakal Tetamu' },
  { min: 750,  nama: 'Tetamu Allah' },
  { min: 1200, nama: 'Jemaah Cemerlang' }
];

export const MASKOT_TIPS = [
  'Assalamualaikum! Saya Jamal si unta. Jom belajar umrah sama-sama!',
  'Tahu tak? Umrah boleh dibuat sepanjang tahun, berbeza dengan haji.',
  'Jangan lupa, Kaabah sentiasa di sebelah kiri semasa tawaf.',
  "Sa'i bermula di Safa dan berakhir di Marwah. Senang ingat: S dulu, M kemudian!",
  'Kumpul semua doa dalam Kitab Doa untuk dapat lencana Pengumpul Doa.'
];
