(() => {
  document.getElementById("featured").innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 4).map((p) => cardHTML(p, { asLink: true })).join("");

  // Thử màu xà cừ ngay trên trang chủ (bản rút gọn của Studio)
  const cfg = { product: "luoc-trang", base: "mun", motif: "maysao", nacre: "ngoc" };
  const stage = document.getElementById("teaserStage");
  const sw = document.getElementById("teaserNacre");
  const cta = document.getElementById("teaserCta");

  function paint() {
    stage.innerHTML = Renderer.render(cfg, { label: "Xem trước lược khảm xà cừ " + findBy(STUDIO.nacres, cfg.nacre).name });
    sw.innerHTML = STUDIO.nacres.map((n) => `
      <div class="swatch-wrap">
        <button class="swatch" type="button" data-v="${n.id}" aria-pressed="${n.id === cfg.nacre}" aria-label="${n.name}">${Renderer.swatch(n.id)}</button>
        <span>${n.name}</span>
      </div>`).join("");
    cta.href = studioLink(cfg);
  }
  sw.addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    cfg.nacre = b.dataset.v;
    paint();
    sw.querySelector(`[data-v="${cfg.nacre}"]`).focus({ preventScroll: true });
  });
  paint();
})();
