// function personalizeMessage(name, message) {
  // return message.replace('[nama]', name);
// }

// Contoh penggunaan:
// const message = 'Hei [nama], ingatlah bahwa perasaan sedih hanya sementara. Mari hadapi hari ini dengan semangat baru dan keberanian! 💕😊';
// console.log(personalizeMessage('John', message));

const SAD = {
  positive: {
    attention: [
      'Liat pocong jalannya loncat, tetap semangat kamu hebat! 🫡',
      'Kamu lebih kuat dari yang kamu pikirkan 💪',
      'Sedih boleh, nyerah jangan 💪🔥',
      'Hei [nama], ingatlah bahwa perasaan sedih hanya sementara. Mari hadapi hari ini dengan semangat baru dan keberanian! 💕😊',
      'Halo [nama], tetap tegar dan segera bangkit lagi yaa!!✨💖'
    ],
    relevance: [
      'Ga masalah kok kalau kamu sedih, karena pelangi yang indah itu akan muncul setelah hujan 😊',
      'Tidak perlu khawatir, merasa sedih adalah bagian dari tantangan perjalanan belajar 😁',
      'Memang berat untuk tetap fokus saat kondisi seperti ini, terus berjuang ya!', 
      'Ayo bertahan untuk mendapatkan semua tujuan!',
      'Dengan melewati masa ini kamu pasti akan lebih kuat lagi 🤗'
    ],
    confidence: [
      'Kamu akan baik-baik aja kok, ayo bangkit lagi! 😊',
      'Semua pasti bakal berlalu, kamu pasti bisa lewatin rasa sedih ini! 🤗',
      'Semua akan baik-baik aja, kamu pasti bisa melewatinya 😊',
      'Sedih itu kaya guru kesabaran, lewatin dengan bijak yaa buat dapetin hikmah dan kebijaksanaan 😇',
      'Kamu pasti bisa bertahan sedikit lagi, kasih paham tipis tipis 🤝🏼'
    ],
    satisfaction: [
      'Kalau cape nanti istirahat yaa, karena kamu layak buat dapetinnya 😉',
      'Kamu keren udah bertahan sampai di titik ini! 🫡🔥',
      'Udah ini jangan lupa cuci muka, gosok gigi, evaluasi, dan tidur sejenak menemui esok pagi yahh 🤙',
      'Kamu gapapa? Selesai dari sini, jangan lupa self reward ya! 😉',
      'Meski terasa sulit, kamu hebat udah bertahan sampai saat ini 😎'
    ]
  },
  negative: {
    attention: [
      'Ke coffe shop buat nongki, jangan sedih deadline menanti 😔',
      'Liat ujang sakit perut, ih kamu jangan cemberut ☹️',
      'Halo [nama], kalau kamu terlalu larut dalam kesedihan, itu bikin kamu sulit konsentrasi. 😔',
      '[nama], jangan sedih terus yaa apa ga cape 😣',
      '[nama], senyum dongg jangan cemberut 😁',
    ],
    relevance: [
      'Jangan sedih dong, nanti kamu jadi gapaham materinya 😥',
      'Jangan berlarut-larut, selalu ingat semua tujuanmu itu 😣',
      'Memang kadang-kadang belajar itu bikin pusing, tapi kamu jangan sedih dong 😅',
      'Kalau sedih terus nanti kamu ketinggalan materi loh 😣',
      'Jangan sedih, nanti fokusmu keganggu 😓'
    ],
    confidence: [
      'Rasa sedih ini ngehambat produktivitas kamu. Jadi hadapi kesedihan ini yaa, kamu kan kuat!',
      'Larut dalam kesedihan bisa ngehambat kamu mencapai kemajuan. Tetap fokus dan hilangkan rasa sedih itu ya! 😉',
      'Lupakan rasa sedih itu, kasih paham tipis tipis 🤝🏼',
      'Udahhh, jangan cemberut terus, ayo kasih tau dunia kalau kamu gapapa 😄',
      'Semua pasti berlalu, gausah sedih, gass terosss 🏍️🏎️⚡'
    ],
    satisfaction: [
      'Kamu pasti bisa menghadapi semuanya, tapi jangan sedih terus yaa itu tugas ngeliatin 😅',
      'Kamu kuat, ayo buang rasa sedih itu, jangan kasi kendor abangkuu 🔥',
      'Jangan sedih terus ya, udah ini kamu harus ciptain kebahagiaan kamu sendiri ✨',
      'Dewasa itu memang sulit, kamu gaboleh sedih lama-lama! 😞',
      'Jangan sedih terus sobat, kamu itu hebat pasti kamu kuat 🫡'
    ]
  }
}

const ANGRY = {
  positive: {
    attention: [
      '[nama], proses belajar emang bisa bikin frustasi, tapi kalau kamu sabar dan tekun pasti akan membuahkan keberhasilan 😉',
      'Semua ini pasti segera berakhir, sabar yaa 🥰',
      'Kalau Avatar bisa mengendalikan air, api, udara, dan tanah, kalau kamu pasti bisa mengendalikan amarahmu 😸',
      'Heii [nama], fokus lagi yukk! 🫵😃',
      'Sabarr yaa abangkuu 🔥'
    ],
    relevance: [
      'Memang tidak mudah untuk mengontrol amarah, tapi kamu pasti bisa mengatasinya! 😉',
      'Tetap tenang, selalu ingat tujuanmu di awal! 💪',
      'Setelah tantangan yang berat, kamu pasti akan lebih kuat 💪',
      'Semua masalah pasti akan ada jalan keluarnya, ini tantangan agar kamu bisa lebih baik lagi',
      'Chill dulu lah, cuman berapa sks doang nanti juga beres🤙'
    ],
    confidence: [
      'Amarah ini tidak akan membebanimu, alihkan energi itu untuk menumbuhkan semangat 🔥',
      'Masa-masa ini pasti akan bisa kamu lewati! 💪',
      'Jadikan ledakan amarahmu, kaya ledakan petir yang menyinari kegelapan! ⚡',
      'Udah-udah ayo kamu pasti bisa fokus lagi 🙄',
      'Chill dulu lahh 🤙'
    ],
    satisfaction: [
      'Terima kasih karena sudah bertahan, tetap semangat! 😃',
      'Kamu hebat, tapi tetap kendalikan dirimu yaa! 😃',
      'Cape ga si marah terus? Mending tenangin diri dulu yaa 😓',
      'Tunjukkin kalau kamu itu orangnya sabarrrr 😇',
      'Kamu itu kerenn, sabarrr capt tetap percaya proses 🔥🔥'
    ]
  },
  negative: {
    attention: [
      '[nama], tetap fokus!! Masih banyak materi yang harus dipahami😅',
      'Jangan marah dongg santai dulu ga sih 😣',
      'Sabar-sabar, orang sabar pahalanya besar 😅',
      'Dua tiga ikan hiu, loh kamu jangan begitu 🫵😣',
      'Hey [nama], amarah itu mengganggu belajarmu😡, Ayo dinginkan kepalamu 🥶'
    ],
    relevance: [
      'Amarah bisa merusak suasana belajarmu. Kamu akan sulit paham kalau terus begitu 😣',
      'Amarah gaakan membantu dan hanya memperburuk suasana hatimu! Jadi sabar lah duluu 😥',
      'Daripada marah-marah, mendingan fokus lagi yuk! 😃',
      'Amarah cuman ngerugiin kamu, tetap tenang!',
      'Jangan marah terus sobat, udah gede malu 😔'
    ],
    confidence: [
      'Marah itu cuman menganggu pikiranmu. Jadi tetap kendalikan diri agar materi bisa dipahami 😉',
      'Kamu pegang kendali atas dirimu, jadi jangan sampai amarah yang ngendaliin kamu! 😉',
      'Udahh ayo kamu pasti bisa fokus lagi, jangan marah gitu ah 🙄',
      'Udah stop ya jangan marah terus, kamu harus fokus belajar lagi 😮‍💨‍',
      'Gaperlu emosi, chill dulu lahh 🤙'
    ],
    satisfaction: [
      'Kamu itu keren, kamu harus mengubah amarahmu menjadi kekuatan untuk mencapai tujuanmu! 💪😠',
      'Kamu cape ga si marah terus? Mending udahan marahnya 😮‍💨',
      'Jangan marah, tunjukkin kalau kamu itu orangnya sabarrrr 😇',
      'Gaperlu marah-marah, nikmati terus prosesnya capt 😎',
      'Tahan capt jangan meledak, sabar lah dulu 😮‍💨',
    ]
  }
}

const FEAR = {
  positive: {
    attention: [
      'Makan indomi sambil nonton Anya, kamu pasti bisa melewatinya! 🤩',
      '[nama], kamu pasti bisa melawan rasa itu, ayoo semangat! 🐱',
      'Hai [nama], takut itu wajar. Ayo atasi rasa takut ini dengan keberanian! 💪🚀',
      'Hei [nama], jangan biarkan rasa takut membuatmu ragu. Ayo hadapi tantangan ini dengan semangat yang tinggi! 😊💖',
      'Dua tiga anak kera, kamu tenang dulu yaa 🤗'
    ],
    relevance: [
      'Apa yang kamu rasakan saat ini adalah sebuah tantangan, tetap optimis kamu bisa mengatasinya 😊',
      'Tetap melangkah maju, pelajaran hari ini akan jadi petualangan baru! 🚀',
      'Semangat menghadapi prosesnya untuk meraih banyak ilmu 🙌',
      'Setelah tantangan yang berat, kamu pasti akan lebih kuat 💪',
      'Gapapa kok, pasti ga seseram yang kamu pikirkan 😉'
    ],
    confidence: [
      'Rasa takut itu tantangan yang harus dihadapi, bukan rintangan yang harus dihindari. Ayoo semangat! 🔥',
      'Belajar hal baru emang kadang menakutkan, tapi kamu pasti bisa menghadapinya!',
      'Tetap semangat!! Setiap langkah adalah tantangan untuk tumbuh dan berkembang 🌱🌞',
      'Proses belajar memang penuh tantangan, kamu pasti bisa bertahan! 🤗',
      'Memang tidak mudah untuk merasa baik-baik saja, tapi kamu pasti bisa mengatasinya! 😉'
    ],
    satisfaction: [
      'Kamu lebih hebat dari yang kamu pikirkan, tetap bertahan yaa 🤗',
      'Tidak masalah jika kamu merasa tidak nyaman, setidaknya kamu sudah berusaha 😉',
      'Tetep inget kata CJR kalau kamu kamu kamu kamu terhebat 😎',
      'Hadapi teruss, kasih paham tetap ilmu padi capt 🤯🌾',
      'Ayoo sobatt kasih paham kalau gini doang mah gampangg 😏'
    ]
  },
  negative: {
    attention: [
      '[nama], kalau kamu takut belajar hal baru itu artinya kamu akan semakin ketinggalan banyak ilmu 😣',
      'Si Heru mancing ikan nila 🎣, kamu gaboleh putus asa 🫵😎',
      'Kamu harus beraniii! 🫵💪',
      '[nama], jangan takut dongg ini kan bukan film horor 😫👻',
      'Heii [nama], gitu aja kok takut 🫵😏'
    ],
    relevance: [
      'Jangan takut, tetap fokus! Selalu ingat banyak impian yang harus dicapai 😉',
      'Jangan sampai rasa takut itu mengekangmu untuk mengeksplorasi pengetahuan baru! 🙄',
      'Jangan takut, takutlah hanya saat kamu tidak pernah mencoba 😃',
      'Buang rasa takutmu dan hadapi prosesnya untuk meraih banyak ilmu 🙌',
      'Takut itu wajar, tapi jangan sampe kamu menghindar'
    ],
    confidence: [
      'Ayo bangkit, jangan takut hidup memang penuh rintangan! 🙃',
      'Tetap tenang dan fokus yaa, rasa takut itu hanya sementara 😉',
      'Lawan rasa takut itu, selalu ingat tujuan utamamu di awal! 💪',
      'Ga perlu takut, kamu ga sendirian kok, ada playlist spotify menemani 😉',
      'Rasa takut itu diciptakan dari pikiranmu, jadi ubah pola pikirmu jangan buat dia menguasaimu!'
    ],
    satisfaction: [
      'Ayo hadapi, tunjukkan dong kalau kamu pemberani 😎',
      'Jangan takut, kalau kata CJR, kamu kamu kamu kamu terhebat 😎',
      'Gamasalah kalau takut, tapi inget kata D’MASIV, jangan menyerah 💪😠',
      'Jangan takut anak muda, kasih paham kalo gini doang mah gampangg 😏',
      'Kenapa harus takut, kamu kan biasa segini doang mah kecill 🥱'
    ]
  }
}

const DISGUST = {
  positive: {
    attention: [
      'Semangatt, anggap aja perasaan ini seperti sebuah tantangan yang harus kamu taklukan! 🤗',
      'Buah yang lagi sakit itu alpucat, cepat buktikan kalau kamu hebat 🥑😎',
      'Halo [nama], jangan biarkan perasaan jijik menghentikan langkahmu! 🫵😣',
      '[nama], ayo ubah perspektif dan hadapi perasaan ini dengan semangat ya! 🌟😊',
      'Tetap semangat dan tetap menyalaa abangkuu 🔥🔥🔥'
    ],
    relevance: [
      'Ketekunan adalah kunci keberhasilan, maka ayo tamatkan semua ini 😵',
      'Rasa jijik itu nggak bisa dibawa terus-terusan, jadi ayo keluar dari zona nyaman 😃',
      'Kuliah adalah kesempatan untuk melampaui batasan diri, jadi tetaplah bertahan 😉',
      'Tenang aja, setiap perasaan yang berat adalah bagian dari perjalanan menuju hebat!',
      'Belajar itu kaya makanan, ada yang enak ada yang engga, tapi yang pasti semuanya bikin kenyang 😋'
    ],
    confidence: [
      'Emang sih perasaan ini tidak enak, tapi kamu pasti bisa bertahan! 💪',
      'Jadikan rasa tidak nyaman ini sebagai motivasi untuk lebih tangguh! 😉',
      'Pikirkan hal-hal yang membuatmu bahagia, kamu pasti bisa! 🐱',
      'Semua pasti berlalu, ayoo semangat gass teross 🏍️🏎️⚡',
      'Ayo anak muda kamu pasti bisa lebih semangat lagii 🫵🔛🔝'
    ],
    satisfaction: [
      'Semakin kuat kamu bertahan, semakin hebat dirimu! 😎',
      'Tidak masalah untuk mengalami perasaan ini karena kamu telah berusaha untuk menghadapinya 🤗',
      'Inget kata-kata tulus, manusia-manusia kuat itu kita 🦾',
      'Ayo anak muda buktikan kalau segini doang mah kecill 😏',
      'Semangat terus abangku, tetap percaya proses 🙌'
    ]
  },
  negative: {
    attention: [
      'Banyak yang lebih parah dari kamu dan mereka berhasil bertahan hingga akhir, masa kamu kalah! 😃',
      'Si dadang beli kopeah, kamu harus sabar yah 😅',
      'Hei [nama], kalau kamu terus merasa begitu, itu bisa ganggu fokus belajarmu!! 🤢',
      'Heii [nama], jangan begitu teruss, ayo fokus!! 🫵😫',
      'Ayo lawan rasa itu abangkuu 🔥'
    ],
    relevance: [
      'Mau sampai kapan kamu kaya gitu? Kalau begini terus kamu gaakan pernah maju 😪',
      'Perasaan ini hanya sesaat, tetap hadapi untuk mendapatkan ilmu yang abadi 📖',
      'Rasa jijik mengganggu fokusmu, jadi hilangkan rasa itu! 🫵🙄',
      'Rasa jijik itu jangan dibawa terus-terusan, kamu gaakan berkembang kalau terus di zona nyaman 🥱',
      'Jangan fokus pada hal-hal yang bikin jijik. Lihat sisi positifnya, semua pengalaman membentuk kita 🏋️‍♂️🏋️‍♀️'
    ],
    confidence: [
      'Zona nyaman itu membosankan, jadi kamu harus hadapi tantangan 😬',
      'Ini adalah ujian dalam pembelajaran, kamu payah kalau ga bisa bertahan 😅',
      'Tetap hadapi perasaan itu dan kamu akan mengerti makna di dalamnya! 😇',
      'Jangan biarkan rasa tidak nyaman ini mematahkan semangat belajar mu anak muda 🫵😠',
      'Udah ya cukup untuk kamu merasa seperti itu, ayo fokus belajar lagi!'
    ],
    satisfaction: [
      'Tetap fokus, tahan rasa itu dan buktikan kalau kamu itu tangguh! 💪',
      'Ayo anak muda jangan putus asa, buktikan kalau segini doang mah kecill 😏',
      'Jangan kasih kendorr abangku, tetap percaya proses 🙌',
      'Jangan berhenti anak muda ayo teruskan perjuanganmu dalam menuntut ilmu 🫵😠',
      'Tetaplah ingat, tidak ada kata menyerah di kamusmu itu!! 🫵😠'
    ]
  }
}


module.exports = {
  SAD, ANGRY, FEAR, DISGUST
}
