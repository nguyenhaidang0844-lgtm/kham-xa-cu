(() => {
  document.getElementById("featured").innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 4).map((p) => cardHTML(p, { asLink: true })).join("");
  fillCuts();

  // Thử màu xà cừ ngay trên trang chủ: đổi màu trực tiếp trên ảnh mockup thật
  const cfg = normalizeCfg({ product: "kep-oval", base: "sonmai", motif: "hoabuom", nacre: "ngoc" });
  const stage = document.getElementById("teaserStage");
  const sw = document.getElementById("teaserNacre");
  const cta = document.getElementById("teaserCta");
  let ticket = 0;

  async function paintStage() {
    const my = ++ticket;
    const canvas = await Recolor.render(cfg, 900);
    if (my !== ticket) return;
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    img.alt = "Kẹp bầu dục khảm xà cừ " + findBy(STUDIO.nacres, cfg.nacre).name.toLowerCase();
    stage.replaceChildren(img);
    cta.href = studioLink(cfg);
  }

  async function paintSwatches() {
    const urls = await Promise.all(STUDIO.nacres.map((n) => Recolor.swatch(n.id)));
    sw.innerHTML = STUDIO.nacres.map((n, i) => `
      <div class="swatch-wrap">
        <button class="swatch" type="button" data-v="${n.id}" aria-pressed="${n.id === cfg.nacre}" aria-label="${n.name}" style="background-image:url(${urls[i]})"></button>
        <span>${n.name}</span>
      </div>`).join("");
  }

  sw.addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    cfg.nacre = b.dataset.v;
    sw.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    paintStage();
  });

  paintStage();
  paintSwatches();
})();
