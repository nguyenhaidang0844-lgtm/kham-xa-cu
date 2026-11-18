(() => {
  let lang = localStorage.getItem("lang") === "en" ? "en" : "vi";
  const state = { cat: "all", tier: "all" };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const fmtPrice = (n) =>
    lang === "vi" ? n.toLocaleString("vi-VN") + "₫" : n.toLocaleString("en-US") + " VND";

  /* ---------- Thông tin liên hệ từ SITE ---------- */
  function applySiteConfig() {
    $$("[data-brand]").forEach((el) => (el.textContent = SITE.brand));
    $$("[data-text]").forEach((el) => (el.textContent = SITE[el.dataset.text] || ""));
    $$("[data-link]").forEach((el) => {
      const key = el.dataset.link;
      el.href = key === "email" ? "mailto:" + SITE.email : SITE[key] || "#";
    });
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- Song ngữ ---------- */
  const VI = {};
  $$("[data-i18n]").forEach((el) => (VI[el.dataset.i18n] = el.innerHTML));

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => {
      const k = el.dataset.i18n;
      const v = lang === "en" ? EN[k] : VI[k];
      if (v !== undefined) el.innerHTML = v;
    });
    $("#langToggle").textContent = lang === "vi" ? "EN" : "VI";
    renderProducts();
  }

  $("#langToggle").addEventListener("click", () => {
    lang = lang === "vi" ? "en" : "vi";
    localStorage.setItem("lang", lang);
    applyLang();
  });

  /* ---------- Sản phẩm ---------- */
  const grid = $("#productGrid");

  function renderProducts() {
    const list = PRODUCTS.filter(
      (p) => (state.cat === "all" || p.cat === state.cat) && (state.tier === "all" || p.tier === state.tier)
    );
    grid.innerHTML = list
      .map(
        (p, i) => `
      <button class="card" data-id="${p.id}" style="animation-delay:${i * 60}ms">
        <div class="card__media">
          <img src="${p.img}" alt="${p.name[lang]}" loading="lazy" />
          <span class="card__tag">${TIERS[p.tier][lang]}</span>
        </div>
        <div class="card__body">
          <div>
            <div class="card__name">${p.name[lang]}</div>
            <div class="card__cat">${CATEGORIES[p.cat][lang]}</div>
          </div>
          <div class="card__price">${fmtPrice(p.price)}</div>
        </div>
      </button>`
      )
      .join("");
    $("#emptyMsg").hidden = list.length > 0;
  }

  function bindFilter(groupId, key, attr) {
    $(groupId).addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      state[key] = btn.dataset[attr];
      $$(".chip", $(groupId)).forEach((b) => b.classList.toggle("is-active", b === btn));
      renderProducts();
    });
  }
  bindFilter("#catFilter", "cat", "cat");
  bindFilter("#tierFilter", "tier", "tier");

  /* ---------- Modal chi tiết ---------- */
  const modal = $("#productModal");
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const p = PRODUCTS.find((x) => x.id === card.dataset.id);
    $("#modalImg").src = p.img;
    $("#modalImg").alt = p.name[lang];
    $("#modalCat").textContent = `${CATEGORIES[p.cat][lang]} · ${TIERS[p.tier][lang]}`;
    $("#modalTitle").textContent = p.name[lang];
    $("#modalPrice").textContent = fmtPrice(p.price);
    $("#modalDesc").textContent = p.desc[lang];
    modal.showModal();
  });
  $("#modalClose").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  /* ---------- Menu mobile ---------- */
  const burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); }
  });

  /* ---------- Header khi cuộn ---------- */
  const header = $(".header");
  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 10), { passive: true });

  /* ---------- Hiệu ứng xuất hiện ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  applySiteConfig();
  applyLang();
})();
