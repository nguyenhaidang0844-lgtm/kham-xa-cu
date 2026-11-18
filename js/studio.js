(() => {
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const cfg = normalizeCfg(Object.fromEntries(params));

  /* ---------- Xem trước: ảnh thật đã đổi màu, lớp mới chồng lên lớp cũ ---------- */
  const stage = $("#stage");
  let ticket = 0;
  async function paintStage() {
    const my = ++ticket;
    const canvas = await Recolor.render(cfg, 1000);
    if (my !== ticket) return;                         // người dùng đã bấm lựa chọn khác
    $("#stageLoading")?.remove();
    const prod = findBy(STUDIO.products, cfg.product);
    const layer = document.createElement("div");
    layer.className = "studio__layer";
    const view = document.createElement("canvas");
    view.width = canvas.width; view.height = canvas.height;
    view.getContext("2d").drawImage(canvas, 0, 0);
    view.setAttribute("role", "img");
    view.setAttribute("aria-label", `${prod.name}, ${studioSpec(cfg)}`);
    layer.appendChild(view);
    const old = [...stage.querySelectorAll(".studio__layer")];
    stage.appendChild(layer);
    old.forEach((el) => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 460); });
  }

  /* ---------- Các lựa chọn ---------- */
  const pressed = (on) => `aria-pressed="${on}"`;
  let optTicket = 0;

  async function paintOptions() {
    const my = ++optTicket;
    const prod = findBy(STUDIO.products, cfg.product);
    const [prodThumbs, motifThumbs, nacreUrls] = await Promise.all([
      Promise.all(STUDIO.products.map((p) => Recolor.dataUrl(normalizeCfg({ ...cfg, product: p.id }), 360))),
      Promise.all(prod.motifs.map((m) => Recolor.dataUrl({ ...cfg, motif: m }, 360))),
      Promise.all(STUDIO.nacres.map((n) => Recolor.swatch(n.id))),
    ]);
    if (my !== optTicket) return;

    $("#optProduct").innerHTML = STUDIO.products.map((p, i) => `
      <button class="opt" type="button" data-k="product" data-v="${p.id}" ${pressed(p.id === cfg.product)}>
        <span class="thumb"><img src="${prodThumbs[i]}" alt="" /></span>
        <b>${p.name}</b><small>${p.note} · từ ${fmtVND(p.price)}</small>
      </button>`).join("");

    $("#optBase").innerHTML = STUDIO.bases.map((b) => `
      <button class="chip" type="button" data-k="base" data-v="${b.id}" ${pressed(b.id === cfg.base)}>
        <i style="background:${b.swatch}"></i>${b.name}${b.add ? ` <small class="muted">+${b.add / 1000}k</small>` : ""}
      </button>`).join("");

    $("#optMotif").innerHTML = prod.motifs.map((id, i) => {
      const m = findBy(STUDIO.motifs, id);
      return `<button class="opt" type="button" data-k="motif" data-v="${m.id}" ${pressed(m.id === cfg.motif)}>
        <span class="thumb"><img src="${motifThumbs[i]}" alt="" /></span>
        <b>${m.name}</b><small>+${fmtVND(m.add)}</small>
      </button>`;
    }).join("") + (prod.motifs.length === 1 ? `<p class="empty-note" style="align-self:center">Dáng ${prod.name.toLowerCase()} hiện có một họa tiết. Kẹp bầu dục có bốn họa tiết để chọn.</p>` : "");

    $("#optNacre").innerHTML = STUDIO.nacres.map((n, i) => `
      <div class="swatch-wrap">
        <button class="swatch" type="button" data-k="nacre" data-v="${n.id}" ${pressed(n.id === cfg.nacre)} aria-label="${n.name}" style="background-image:url(${nacreUrls[i]})"></button>
        <span>${n.name}${n.add ? `<br><small>+${n.add / 1000}k</small>` : ""}</span>
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

  function update() {
    Object.assign(cfg, normalizeCfg(cfg));
    paintText();
    paintStage();
    paintOptions();
  }

  document.querySelector(".studio__panel").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-k]");
    if (!btn) return;
    const { k, v } = btn.dataset;
    if (cfg[k] === v) return;
    cfg[k] = v;
    // phản hồi ngay trên nút vừa bấm, trước khi ảnh thu nhỏ vẽ lại xong
    btn.parentElement.closest("[role=group]")?.querySelectorAll("[data-k]").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    update();
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

  async function paintSaved() {
    const list = Store.saved().map((s) => ({ ...s, config: normalizeCfg(s.config) }));
    if (!list.length) {
      $("#savedList").innerHTML = `<p class="empty-note" style="grid-column:1/-1">Chưa có thiết kế nào. Bấm "Lưu thiết kế" để giữ lại và so sánh.</p>`;
      return;
    }
    const thumbs = await Promise.all(list.map((s) => Recolor.dataUrl(s.config, 300)));
    $("#savedList").innerHTML = list.map((s, i) => `
      <div class="saved__item">
        <button class="load" type="button" data-load="${s.id}" aria-label="Mở thiết kế ${findBy(STUDIO.products, s.config.product).name}">
          <img src="${thumbs[i]}" alt="" />
        </button>
        <small>${findBy(STUDIO.products, s.config.product).name} · ${fmtVND(studioPrice(s.config))}</small>
        <button class="del" type="button" data-del="${s.id}" aria-label="Xóa thiết kế đã lưu">×</button>
      </div>`).join("");
  }
  $("#savedList").addEventListener("click", (e) => {
    const load = e.target.closest("[data-load]");
    const del = e.target.closest("[data-del]");
    if (del) { Store.unsave(del.dataset.del); paintSaved(); return; }
    if (load) {
      const s = Store.saved().find((x) => x.id === load.dataset.load);
      if (s) { Object.assign(cfg, normalizeCfg(s.config)); update(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    }
  });

  update();
  paintSaved();
})();
