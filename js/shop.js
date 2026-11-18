(() => {
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  let cat = CATEGORIES[params.get("cat")] ? params.get("cat") : "all";

  /* ---------- Bộ lọc ---------- */
  function paintFilters() {
    const items = [["all", "Tất cả", PRODUCTS.length], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v, PRODUCTS.filter((p) => p.cat === k).length])];
    $("#filters").innerHTML = items
      .map(([k, label, n]) => `<button class="filter${k === cat ? " is-active" : ""}" type="button" data-cat="${k}" aria-pressed="${k === cat}">${label}<sup>${n}</sup></button>`)
      .join("");
  }
  function paintGrid() {
    const list = PRODUCTS.filter((p) => cat === "all" || p.cat === cat);
    $("#grid").innerHTML = list.map((p) => cardHTML(p)).join("");
  }
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    cat = b.dataset.cat;
    const url = new URL(location); cat === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", cat);
    url.searchParams.delete("item");
    history.replaceState(null, "", url);
    paintFilters(); paintGrid();
  });

  /* ---------- Chi tiết sản phẩm ---------- */
  const dlg = $("#dlg");
  let current = null, wood = null;
  const qtyInput = $("#dlgQty");
  const getQty = () => Math.max(1, Math.min(99, parseInt(qtyInput.value, 10) || 1));

  function setImg(src) {
    $("#dlgImg").src = src;
    $("#dlgThumbs").querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.src === src));
  }

  function open(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    current = p;
    wood = p.woods ? p.woods[0] : null;
    $("#dlgCat").textContent = CATEGORIES[p.cat];
    $("#dlgName").textContent = p.name;
    $("#dlgPrice").textContent = fmtVND(p.price);
    $("#dlgDesc").textContent = p.desc;
    $("#dlgMat").textContent = p.material;
    $("#dlgImg").alt = p.name;
    $("#dlgThumbs").innerHTML = p.imgs.length > 1
      ? p.imgs.map((src, i) => `<button type="button" data-src="${src}" aria-label="Ảnh ${i + 1}"><img src="${src}" alt="" /></button>`).join("")
      : "";
    setImg(p.imgs[0]);
    $("#dlgWoodWrap").hidden = !p.woods;
    if (p.woods) paintWoods();
    qtyInput.value = 1;
    const st = $("#dlgStudio");
    st.hidden = !p.studio;
    if (p.studio) st.href = studioLink({ ...p.studio, ...(wood ? { base: wood } : {}) });
    if (!dlg.open) dlg.showModal();
    const url = new URL(location); url.searchParams.set("item", p.id); history.replaceState(null, "", url);
  }

  function paintWoods() {
    $("#dlgWoods").innerHTML = current.woods.map((w) => {
      const b = findBy(STUDIO.bases, w);
      return `<button class="chip" type="button" data-wood="${w}" aria-pressed="${w === wood}"><i style="background:${b.color}"></i>${b.name}</button>`;
    }).join("");
  }

  $("#grid").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) open(c.dataset.id); });
  $("#dlgThumbs").addEventListener("click", (e) => { const b = e.target.closest("[data-src]"); if (b) setImg(b.dataset.src); });
  $("#dlgWoods").addEventListener("click", (e) => {
    const b = e.target.closest("[data-wood]");
    if (!b) return;
    wood = b.dataset.wood; paintWoods();
    if (current.studio) $("#dlgStudio").href = studioLink({ ...current.studio, base: wood });
  });
  dlg.querySelector(".qty").addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (b) qtyInput.value = Math.max(1, Math.min(99, getQty() + Number(b.dataset.step)));
  });
  qtyInput.addEventListener("change", () => (qtyInput.value = getQty()));
  $("#dlgAdd").addEventListener("click", () => {
    Store.add(Store.lineFromProduct(current, wood), getQty());
    dlg.close();
    toast(`Đã thêm ${getQty()} × ${current.name} vào giỏ. <a href="gio-hang.html">Xem giỏ hàng</a>`);
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  dlg.addEventListener("close", () => { const url = new URL(location); url.searchParams.delete("item"); history.replaceState(null, "", url); });

  paintFilters();
  paintGrid();
  if (params.get("item")) open(params.get("item"));
})();
