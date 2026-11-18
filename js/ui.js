/* Thành phần dùng chung: thẻ sản phẩm */
function cardHTML(p, { asLink = false } = {}) {
  const tag = asLink ? "a" : "button";
  const attr = asLink ? `href="cua-hang.html?item=${p.id}"` : `type="button" data-id="${p.id}"`;
  const cut = p.studio && typeof Recolor !== "undefined";
  const second = !cut && p.imgs[1] ? `<img src="${p.imgs[1]}" alt="" loading="lazy" />` : "";
  const first = cut
    ? `<img data-cut='${JSON.stringify({ product: p.studio.product, motif: p.studio.motif })}' alt="${p.name}" />`
    : `<img src="${p.imgs[0]}" alt="${p.name}" loading="lazy" />`;
  return `<${tag} class="card" ${attr}>
    <span class="card__media${cut ? " is-cut" : ""}">
      ${first}${second}
      ${p.studio ? `<span class="card__tag">Tùy chỉnh được</span>` : ""}
    </span>
    <span class="card__name">${p.name}</span>
    <span class="card__meta">${CATEGORIES[p.cat]} · ${p.material.split(" · ")[0]}</span>
    <span class="card__price">${fmtVND(p.price)}</span>
  </${tag}>`;
}

function studioLink(cfg) {
  return "studio.html?" + new URLSearchParams(cfg).toString();
}

/* Điền ảnh tách nền (ảnh mockup gốc, không đổi màu) vào các thẻ có data-cut */
function fillCuts(root = document) {
  root.querySelectorAll("img[data-cut]").forEach(async (img) => {
    const c = JSON.parse(img.dataset.cut);
    img.removeAttribute("data-cut");
    img.src = await Recolor.dataUrl({ ...normalizeCfg(c), original: true }, 600);
  });
}
