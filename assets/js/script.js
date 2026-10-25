"use strict";

/* ====== KONFIGURASI: ubah di sini ====== */
const KONFIG = {
  waNomor: "628817020813", // format internasional tanpa + atau 0 di depan
  pesanAwal: "Halo SIP Studio, saya ingin berdiskusi mengenai kebutuhan website/sistem informasi untuk lembaga kami.",
  get sosial() {
      return [
          { 
              nama: "Instagram", 
              url: "https://instagram.com", 
              icon: "#i-instagram" 
          },
          { 
              nama: "TikTok", 
              url: "https://tiktok.com", 
              icon: "#i-tiktok" 
          },
          { 
              nama: "WhatsApp", 
              url: `https://wa.me/{this.waNomor}?text=${encodeURIComponent(this.pesanAwal)}`, 
              icon: "#i-whatsapp" 
          }
      ];
  }
};

const FAQ = [
    [
        "Lembaga apa saja yang dapat menggunakan layanan SIP Studio?",
        "Layanan kami diperuntukkan bagi sekolah, madrasah, pondok pesantren, yayasan, dan lembaga pendidikan lainnya, serta pelaku UMKM sebagai layanan pendukung."
    ],
    [
        "Apakah website dapat disesuaikan dengan identitas lembaga?",
        "Ya. Warna, logo, susunan halaman, dan konten disesuaikan dengan identitas serta kebutuhan lembaga Anda."
    ],
    [
        "Apakah SIP Studio menyediakan sistem PSB/PPDB online?",
        "Ya. Kami mengembangkan sistem penerimaan santri atau peserta didik baru secara daring. Fitur rincinya didiskusikan sesuai kebutuhan lembaga."
    ],
    [
        "Apakah website dapat dikelola oleh pihak lembaga?",
        "Website dirancang agar pengelolaannya mudah. Cakupan fitur pengelolaan dan pendampingan penggunaan disepakati pada tahap konsultasi."
    ],
    [
        "Bagaimana proses pemesanan layanan?",
        "Mulailah dengan berkonsultasi melalui WhatsApp. Setelah kebutuhan dipahami, kami menyusun usulan solusi dan ruang lingkup kerja untuk disepakati bersama."
    ],
    [
        "Apakah tersedia pemeliharaan setelah website diluncurkan?",
        "Tersedia pemeliharaan dan dukungan teknis sesuai kesepakatan layanan. Rinciannya dibahas sebelum pekerjaan dimulai."
    ],
    [
        "Bagaimana cara mengetahui estimasi biaya pengembangan?",
        "Biaya bergantung pada jenis layanan dan kompleksitas kebutuhan. Silakan konsultasikan kebutuhan Anda, lalu kami sampaikan estimasi setelah ruang lingkup jelas."
    ]
];

const NAV = [
    ["#beranda", "Beranda"],
    ["#tentang", "Tentang Kami"],
    ["#layanan", "Layanan"],
    ["#keunggulan", "Keunggulan"],
    ["#portofolio", "Portofolio"],
    ["#faq", "Pertanyaan Umum"]
];

/* ====== WhatsApp ====== */
const waUrl = t => "https://wa.me/" + KONFIG.waNomor + "?text=" + encodeURIComponent(t || KONFIG.pesanAwal);

document.querySelectorAll("a[data-wa]").forEach(a => {
    a.href = waUrl(a.dataset.wa);
});

document.querySelectorAll("button[data-wa]").forEach(b => {
    b.addEventListener("click", () => {
        window.open(waUrl(b.dataset.wa), "_blank", "noopener");
    });
});

/* ====== Navigasi tanpa hash ====== */
const header = document.getElementById("topbar");
const menu = document.getElementById("menu");
const burger = document.getElementById("burger");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");

function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    document.getElementById("bi").setAttribute("d", open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16");
}

burger.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
        setMenu(false);
        burger.focus();
    }
});

document.addEventListener("click", e => {
    if (menu.classList.contains("open") && !header.contains(e.target)) {
        setMenu(false);
    }
});

function scrollKe(sel) {
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({
        behavior: reduce.matches ? "auto" : "smooth",
        block: "start"
    });
}

document.addEventListener("click", e => {
    const t = e.target.closest("[data-scroll-target]");
    if (!t) return;
    e.preventDefault();
    setMenu(false);
    scrollKe(t.dataset.scrollTarget);
});

/* footer nav */
const fn = document.getElementById("foot-nav");

NAV.forEach(([s, n]) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.className = "fl";
    b.textContent = n;
    b.dataset.scrollTarget = s;
    li.appendChild(b);
    fn.appendChild(li);
});

/* indikator aktif */
const links = [...document.querySelectorAll(".nl")];

const setAktif = id => links.forEach(l => {
    const on = l.dataset.scrollTarget === "#" + id;
    l.classList.toggle("active", on);
    if (on) {
        l.setAttribute("aria-current", "true");
    } else {
        l.removeAttribute("aria-current");
    }
});

const peta = {
    alur: "keunggulan",
    kontak: "faq"
};

const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) {
        setAktif(peta[en.target.id] || en.target.id);
    }
}), {
    rootMargin: "-45% 0px -50% 0px"
});

document.querySelectorAll("main > section[id]").forEach(s => io.observe(s));
setAktif("beranda");

/* bersihkan hash lama tanpa memuat ulang */
try {
    if (location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
    }
} catch (_) {}

/* bayangan navbar */
const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ====== FAQ ====== */
const fl = document.getElementById("faq-list");

FAQ.forEach(([q, a], i) => {
    const d = document.createElement("div");
    d.className = "fq";
    d.innerHTML =
        '<h3><button type="button" aria-expanded="false" aria-controls="fa' + i + '" id="fb' + i + '"></button></h3>' +
        '<div class="fa" id="fa' + i + '" role="region" aria-labelledby="fb' + i + '"><div><p></p></div></div>';
    d.querySelector("button").textContent = q;
    d.querySelector("p").textContent = a;
    fl.appendChild(d);
});

fl.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    const open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", !open);
    document.getElementById(b.getAttribute("aria-controls")).classList.toggle("open", !open);
});

/* ====== Footer ====== */
document.getElementById("thn").textContent = new Date().getFullYear();

const so = document.getElementById("sosial");

if (KONFIG.sosial.length) {
    so.innerHTML = ""; // Bersihkan placeholder
    
    KONFIG.sosial.forEach(s => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.setAttribute("aria-label", s.nama);

        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        const use = document.createElementNS(NS, "use");
        use.setAttribute("href", s.icon);
        
        svg.appendChild(use);
        a.appendChild(svg);
        li.appendChild(a);
        so.appendChild(li);
    });
} else {
    so.innerHTML = "<li>Segera hadir.</li>";
}

/* ====== Animasi muncul ====== */
const rv = document.querySelectorAll(".rv");

if (reduce.matches || !("IntersectionObserver" in window)) {
    rv.forEach(r => r.classList.add("in"));
} else {
    const o = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("in");
            o.unobserve(e.target);
        }
    }), {
        threshold: .12
    });
    rv.forEach(r => o.observe(r));
}
