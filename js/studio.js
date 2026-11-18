(() => {
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const valid = (list, id) => list.some((x) => x.id === id);

  const cfg = { ...STUDIO.defaults };
  [["product", STUDIO.products], ["base", STUDIO.bases], ["motif", STUDIO.motifs], ["nacre", STUDIO.nacres]].forEach(([k, list]) => {
    const v = params.get(k);
    if (v && valid(list, v)) cfg[k] = v;
  });

  /* ---------- Xem trước: chồng lớp mới lên, lớp cũ mờ dần ---------- */
  const stage = $("#stage");
  function paintStage() {
    const prod = findBy(STUDIO.products, cfg.product);
    const layer = document.createElement("div");
    layer.className = "studio__layer";
    layer.innerHTML = Renderer.render(cfg, { label: `${prod.name}, ${studioSpec(cfg)}` });
    const old = [...stage.children];
    stage.appendChild(layer);
    old.forEach((el) => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 420); });
  }

  /* ---------- Các lựa chọn ---------- */
  const pressed = (on) => `aria-pressed="${on}"`;

  function paintOptions() {
    $("#optProduct").innerHTML = STUDIO.products.map((p) => `
      <button class="opt" type="button" data-k="product" data-v="${p.id}" ${pressed(p.id === cfg.product)}>
        ${Renderer.render({ ...cfg, product: p.id }, { animate: false })}
        <b>${p.name}</b><small>${p.type} · ${p.note} · từ ${fmtVND(p.price)}</small>
      </button>`).join("");

    $("#optBase").innerHTML = STUDIO.bases.map((b) => `
      <button class="chip" type="button" data-k="base" data-v="${b.id}" ${pressed(b.id === cfg.base)}>
        <i style="background:${b.color}"></i>${b.name}${b.add ? ` <small class="muted">+${b.add / 1000}k</small>` : ""}
      </button>`).join("");

    $("#optMotif").innerHTML = STUDIO.motifs.map((m) => `
      <button class="opt" type="button" data-k="motif" data-v="${m.id}" ${pressed(m.id === cfg.motif)}>
        ${Renderer.render({ ...cfg, motif: m.id }, { animate: false })}
        <b>${m.name}</b><small>+${fmtVND(m.add)}</small>
      </button>`).join("");

    $("#optNacre").innerHTML = STUDIO.nacres.map((n) => `
      <div class="swatch-wrap">
        <button class="swatch" type="button" data-k="nacre" data-v="${n.id}" ${pressed(n.id === cfg.nacre)} aria-label="${n.name}">${Renderer.swatch(n.id)}</button>
        <span>${n.name}${n.add ? `<br><small class="muted">+${n.add / 1000}k</small>` : ""}</span>
      </div>`).join("");
  }

  function paintText() {
    const prod = findBy(STUDIO.products, cfg.product);
    const base = findBy(STUDIO.bases, cfg.base);
    const motif = findBy(STUDIO.motifs, cfg.motif);
    const nacre = findBy(STUDIO.nacres, cfg.nacre);
    $("#lblProduct").textContent = prod.name;
    $("#lblBase").textContent = base.name;
    $("#lblMotif").textContent = motif.name;
    $("#lblNacre").textContent = nacre.name;
    $("#motifNote").textContent = motif.meaning;
    $("#capName").textContent = prod.name + " thiết kế riêng";
    $("#capSpec").textContent = studioSpec(cfg);
    const qty = getQty();
    const unit = studioPrice(cfg);
    const row = (a, b) => `<div><span>${a}</span><span>${b}</span></div>`;
    $("#summary").innerHTML =
      row(prod.name, fmtVND(prod.price)) +
      row(base.name, base.add ? "+" + fmtVND(base.add) : "0₫") +
      row("Họa tiết " + motif.name.toLowerCase(), "+" + fmtVND(motif.add)) +
      row("Xà cừ " + nacre.name.toLowerCase(), nacre.add ? "+" + fmtVND(nacre.add) : "0₫") +
      (qty > 1 ? row("Số lượng", "× " + qty) : "") +
      `<div class="total"><span>Tạm tính</span><span>${fmtVND(unit * qty)}</span></div>`;
    history.replaceState(null, "", "?" + new URLSearchParams(cfg).toString());
  }

  function update(full = true) {
    paintStage();
    if (full) paintOptions();
    paintText();
  }

  document.querySelector(".studio__panel").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-k]");
    if (!btn) return;
    const { k, v } = btn.dataset;
    if (cfg[k] === v) return;
    cfg[k] = v;
    update();
    // giữ focus trên lựa chọn vừa bấm sau khi vẽ lại
    document.querySelector(`[data-k="${k}"][data-v="${v}"]`)?.focus({ preventScroll: true });
  });

  /* ---------- Số lượng ---------- */
  const qtyInput = $("#qty");
  const getQty = () => Math.max(1, Math.min(99, parseInt(qtyInput.value, 10) || 1));
  document.querySelector(".studio__actions .qty").addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    qtyInput.value = Math.max(1, Math.min(99, getQty() + Number(b.dataset.step)));
    paintText();
  });
  qtyInput.addEventListener("change", () => { qtyInput.value = getQty(); paintText(); });

  /* ---------- Giỏ hàng, lưu, đặt lại ---------- */
  $("#addCart").addEventListener("click", () => {
    Store.add(Store.lineFromConfig(cfg), getQty());
    document.querySelectorAll("[data-cart-count]").forEach((el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    toast(`Đã thêm ${getQty()} × ${findBy(STUDIO.products, cfg.product).name} vào giỏ. <a href="gio-hang.html">Xem giỏ hàng</a>`);
  });

  $("#saveDesign").addEventListener("click", () => {
    Store.save(cfg);
    paintSaved();
    toast("Đã lưu thiết kế. Bạn có thể mở lại ở mục Thiết kế đã lưu.");
  });

  $("#resetDesign").addEventListener("click", () => {
    Object.assign(cfg, STUDIO.defaults);
    qtyInput.value = 1;
    update();
  });

  function paintSaved() {
    const list = Store.saved();
    $("#savedList").innerHTML = list.length
      ? list.map((s) => `
        <div class="saved__item">
          <button class="load" type="button" data-load="${s.id}" aria-label="Mở thiết kế ${findBy(STUDIO.products, s.config.product).name}">
            ${Renderer.render(s.config, { animate: false })}
          </button>
          <small>${findBy(STUDIO.products, s.config.product).name} · ${fmtVND(studioPrice(s.config))}</small>
          <button class="del" type="button" data-del="${s.id}" aria-label="Xóa thiết kế đã lưu">×</button>
        </div>`).join("")
      : `<p class="empty-note" style="grid-column:1/-1">Chưa có thiết kế nào. Bấm "Lưu thiết kế" để giữ lại và so sánh.</p>`;
  }
  $("#savedList").addEventListener("click", (e) => {
    const load = e.target.closest("[data-load]");
    const del = e.target.closest("[data-del]");
    if (del) { Store.unsave(del.dataset.del); paintSaved(); return; }
    if (load) {
      const s = Store.saved().find((x) => x.id === load.dataset.load);
      if (s) { Object.assign(cfg, s.config); update(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    }
  });

  update();
  paintSaved();
})();
