document.addEventListener("DOMContentLoaded", () => {
  // === Animasi Angka (Counter) ===
  const counters = document.querySelectorAll(".counter-value");
  const duration = 1800; // ms

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    let startTime = null;

    function animateCount(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);

      counter.textContent = current.toLocaleString("id-ID");

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        counter.textContent = target.toLocaleString("id-ID");
      }
    }

    requestAnimationFrame(animateCount);
  });

  // === Isi Sajak ===
  const POEM = `Kau memintaku untuk memuntahkan pilu.
Aku tertawa pula meminta hal yang sama padamu.
Padahal kita tahu betul bahwa tak akan bisa.
Ia masih ada, menari dan berdansa.

Lalu apa benar semesta menyatukan kita hanya untuk berbagi derita?
Sebuah komedi absurd tentang cinta mewajibkan kita berdamai dengan luka.
Maka secara sukarela kita memilih untuk saling mencinta.

Benarkah kita saling menerima? Benarkah kita saling berdamai? Benarkah kita saling membantu?
Niscaya akan kutanggung hingga batas keangkuhan ku mampu.

Tentu kau boleh mengalirinya di sela sela butir darahku
Membiarkannya meyusuri seluruh pembuluh darahku
Membiarkannya masuk dan tidur di setiap kamar jantungku
Menyapa setiap sel tubuhku sebagai tetangga baru.

Karena kelak suatu saat
Gelisahmu adalah gelisahku, sakitku adalah sakitmu
Lalu jadilah hal fana yang sangat kita cinta
Tak lagi dapat dipisah, maka berjalanlah kita bergandeng tiga.

Oh sayangku.
Sampai saat itu tiba, percayalah bahwa jarak itu tiada.
Pertemuan dan perpisahan lahir dari perasaan.

Janganlah kau ucap pisah dengan mudah sayangku.
Maka, sampai huruf terakhir sajak ini, Kau bertangung jawab atas air mataku.`;

  const TYPE_SPEED = 12; // ms per karakter

  // === Elemen Modal ===
  const modal = document.getElementById("poemModal");
  const modalBox = document.getElementById("modalBox");
  const notifyView = document.getElementById("notifyView");
  const letterView = document.getElementById("letterView");
  const poemText = document.getElementById("poemText");
  const typingCursor = document.getElementById("typingCursor");

  const openBtn = document.getElementById("openPoemBtn");
  const readLetterBtn = document.getElementById("readLetterBtn");
  const closeNotifyBtn = document.getElementById("closeNotifyBtn");
  const closeBtn = document.getElementById("closePoemBtn");
  const closeAltBtn = document.getElementById("closePoemAltBtn");

  let typingRaf = null;
  let typingDone = false;

  // --- Animasi mengetik ---
  function cancelTyping() {
    if (typingRaf) cancelAnimationFrame(typingRaf);
    typingRaf = null;
  }

  function finishTyping() {
    cancelTyping();
    poemText.textContent = POEM;
    typingDone = true;
    if (typingCursor) typingCursor.classList.add("is-done");
  }

  function startTyping() {
    cancelTyping();
    poemText.textContent = "";
    typingDone = false;
    if (typingCursor) typingCursor.classList.remove("is-done");

    let i = 0;
    let last = null;

    function step(ts) {
      if (last === null) last = ts;
      const chars = Math.floor((ts - last) / TYPE_SPEED);
      if (chars > 0) {
        last = ts;
        i = Math.min(i + chars, POEM.length);
        poemText.textContent = POEM.slice(0, i);
        if (i >= POEM.length) {
          finishTyping();
          return;
        }
      }
      typingRaf = requestAnimationFrame(step);
    }

    typingRaf = requestAnimationFrame(step);
  }

  // --- Ganti tampilan di dalam modal ---
  function showNotify() {
    cancelTyping();
    notifyView.classList.remove("hidden");
    letterView.classList.add("hidden");
    letterView.classList.remove("flex");
  }

  function showLetter() {
    notifyView.classList.add("hidden");
    letterView.classList.remove("hidden");
    letterView.classList.add("flex");
    if (modalBox) modalBox.scrollTop = 0;
    startTyping();
  }

  function openModal(view) {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto");
    modalBox.classList.remove("scale-95");
    modalBox.classList.add("scale-100");

    if (view === "letter") {
      showLetter();
    } else {
      showNotify();
    }
  }

  function closeModal() {
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modal.classList.add("opacity-0", "pointer-events-none");
    modalBox.classList.remove("scale-100");
    modalBox.classList.add("scale-95");
    cancelTyping();
  }

  // Munculkan pemberitahuan otomatis setelah 30 detik
  setTimeout(() => {
    if (modal.classList.contains("pointer-events-none")) openModal("notify");
  }, 5000);

  // --- Event tombol ---
  if (openBtn) openBtn.addEventListener("click", () => openModal("letter"));
  if (readLetterBtn) readLetterBtn.addEventListener("click", showLetter);
  if (closeNotifyBtn) closeNotifyBtn.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeAltBtn) closeAltBtn.addEventListener("click", closeModal);

  // Klik area sajak untuk langsung menyelesaikan animasi mengetik
  const poemBox = document.getElementById("poemBox");
  if (poemBox) {
    poemBox.addEventListener("click", () => {
      if (!typingDone) finishTyping();
    });
  }

  // Tutup saat klik area gelap di luar modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Tutup dengan tombol Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("pointer-events-none")) {
      closeModal();
    }
  });

  // === Tombol Unduh Surat ===
  const IMAGE_URL = "assets/surat-untukmu.png"; // lokasi file gambar
  const IMAGE_NAME = "Tamu Terhormat di Kamar Jantung.png"; // nama file saat diunduh

  const downloadBtn = document.getElementById("downloadImgBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = IMAGE_URL;
      link.download = IMAGE_NAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }
});
