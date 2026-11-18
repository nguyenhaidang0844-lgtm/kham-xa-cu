/* Thành phần dùng chung: thẻ sản phẩm */
function cardHTML(p, { asLink = false } = {}) {
  const tag = asLink ? "a" : "button";
  const attr = asLink ? `href="cua-hang.html?item=${p.id}"` : `type="button" data-id="${p.id}"`;
  const second = p.imgs[1] ? `<img src="${p.imgs[1]}" alt="" loading="lazy" />` : "";
  return `<${tag} class="card" ${attr}>
    <span class="card__media">
      <img src="${p.imgs[0]}" alt="${p.name}" loading="lazy" />${second}
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
