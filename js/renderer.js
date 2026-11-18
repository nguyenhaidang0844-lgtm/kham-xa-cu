/* =========================================================
   BỘ VẼ SẢN PHẨM (SVG) CHO STUDIO
   render(cfg, { animate }) trả về chuỗi <svg>. cfg = { product, base, motif, nacre }
   - Thân: màu gỗ / sơn mài + vân gỗ (feTurbulence) + lớp bóng
   - Mảnh khảm: ảnh vân xà cừ thật, nhuộm màu bằng feColorMatrix
   - Ánh xà cừ: dải sáng chạy qua mảnh khảm (tắt khi animate = false)
   ========================================================= */
const Renderer = (() => {
  let uid = 0;
  const NACRE_IMG = "img/texture/nacre-pastel.jpg";
  const W = 800, H = 500;

  /* ---------- đo đường cong ---------- */
  const ns = "http://www.w3.org/2000/svg";
  let probe;
  const cache = {};
  function sampler(d) {
    if (cache[d]) return cache[d];
    if (!probe) {
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("width", 0); svg.setAttribute("height", 0);
      svg.style.position = "absolute"; svg.style.visibility = "hidden";
      probe = document.createElementNS(ns, "path");
      svg.appendChild(probe); document.body.appendChild(svg);
    }
    probe.setAttribute("d", d);
    const len = probe.getTotalLength();
    const pts = [];
    for (let i = 0; i <= 200; i++) { const p = probe.getPointAtLength((len * i) / 200); pts.push([p.x, p.y]); }
    const at = (t) => {
      const i = Math.max(0, Math.min(199, Math.floor(t * 200)));
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      const f = t * 200 - i;
      const a = Math.atan2(y1 - y0, x1 - x0);
      return { x: x0 + (x1 - x0) * f, y: y0 + (y1 - y0) * f, a, deg: (a * 180) / Math.PI,
        nx: -Math.sin(a), ny: Math.cos(a) }; // (nx, ny) chỉ xuống dưới đường cong
    };
    return (cache[d] = { at, len });
  }
  // điểm lệch khỏi đường cong: side < 0 là phía trên
  const off = (p, dist) => ({ x: p.x + p.nx * dist, y: p.y + p.ny * dist });
  const r1 = (n) => Math.round(n * 10) / 10;

  /* ---------- hình dáng sản phẩm ---------- */
  function teeth(x0, x1, top, maxLen, step = 19, w = 11) {
    let s = "";
    const mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
    for (let x = x0; x <= x1 + 0.1; x += step) {
      const k = Math.abs(x - mid) / half;
      const len = maxLen * (1 - 0.38 * k * k * k);
      s += `<rect x="${r1(x - w / 2)}" y="${top - 6}" width="${w}" height="${r1(len + 6)}" rx="${w / 2}"/>`;
    }
    return s;
  }

  const SHAPES = {
    "luoc-trang": {
      spine: `<path d="M80 300 C 96 92, 704 92, 720 300 Z"/>`,
      teeth: teeth(116, 684, 300, 124, 22, 12),
      motif: "M132 284 C 196 146, 604 146, 668 284",
      scale: 1.45, bottom: 430,
    },
    "luoc-song": {
      spine: `<path d="M66 300 C 56 204, 166 166, 268 194 C 362 220, 420 150, 522 138 C 642 124, 740 190, 734 300 Z"/>`,
      teeth: teeth(98, 702, 300, 120, 22, 12),
      motif: "M100 278 C 104 226, 196 206, 276 226 C 362 248, 432 190, 524 180 C 624 170, 694 222, 700 278",
      scale: 1.4, bottom: 426,
    },
    "kep-oval": {
      spine: `<ellipse cx="400" cy="250" rx="330" ry="128"/>`,
      teeth: "",
      motif: "M118 292 C 228 336, 318 204, 446 230 C 562 254, 612 166, 694 192",
      scale: 1.75, bottom: 378,
    },
    "kep-thanh": {
      spine: `<rect x="84" y="190" width="632" height="124" rx="62"/>`,
      teeth: "",
      motif: "M130 262 C 232 210, 330 296, 430 250 C 528 206, 604 290, 680 244",
      scale: 1.35, bottom: 314,
    },
  };

  /* ---------- các mảnh khảm ---------- */
  const F = `stroke="none"`;                       // mảnh tô kín
  const S = (w) => `fill="none" stroke-width="${r1(w)}" stroke-linecap="round" stroke-linejoin="round"`; // nét

  const leaf = (x, y, deg, len) =>
    `<path ${F} transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)})" d="M0 0 C ${r1(len * .25)} ${r1(-len * .34)}, ${r1(len * .75)} ${r1(-len * .3)}, ${r1(len)} 0 C ${r1(len * .72)} ${r1(len * .3)}, ${r1(len * .25)} ${r1(len * .3)}, 0 0Z"/>`;

  const bell = (x, y, s) =>
    `<path ${S(1.6 * s)} d="M${r1(x)} ${r1(y)} q ${r1(5 * s)} ${r1(4 * s)} ${r1(4 * s)} ${r1(10 * s)}"/>` +
    `<path ${F} transform="translate(${r1(x + 4 * s)} ${r1(y + 14 * s)}) scale(${r1(s)})" d="M-8 0 C-8 -3,-5 -5,0 -5 C5 -5,8 -3,8 0 C8 6,9 10,11 13 C6 11,4 14,0 12 C-4 14,-6 11,-11 13 C-9 10,-8 6,-8 0Z"/>`;

  const flower = (x, y, r, rot = 0) => {
    let s = `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${rot})">`;
    for (let i = 0; i < 5; i++)
      s += `<path ${F} transform="rotate(${i * 72})" d="M0 0 C ${r1(-r * .5)} ${r1(-r * .3)}, ${r1(-r * .46)} ${r1(-r)}, 0 ${r1(-r)} C ${r1(r * .46)} ${r1(-r)}, ${r1(r * .5)} ${r1(-r * .3)}, 0 0Z"/>`;
    return s + `<circle cx="0" cy="0" r="${r1(r * .2)}" fill="#e9d29a" stroke="none"/></g>`;
  };

  const star = (x, y, r) =>
    `<path ${F} transform="translate(${r1(x)} ${r1(y)}) scale(${r1(r / 10)})" d="M0 -10 L2.2 -2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2 -2.2Z"/>`;

  const dot = (x, y, r) => `<circle ${F} cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/>`;

  const swirl = (x, y, r, dir = 1, w = 2.4) => {
    let d = "";
    const turns = 2.4 * Math.PI;
    for (let i = 0; i <= 48; i++) {
      const th = (turns * i) / 48;
      const rr = r * (1 - th / (turns * 1.08));
      const px = x + Math.cos(th * dir) * rr, py = y + Math.sin(th * dir) * rr;
      d += (i ? " L" : "M") + r1(px) + " " + r1(py);
    }
    return `<path ${S(w)} d="${d}"/>`;
  };

  const lotus = (x, y, s) => {
    let g = `<g transform="translate(${r1(x)} ${r1(y)}) scale(${r1(s)})">`;
    [[-62, .78], [62, .78], [-32, .92], [32, .92], [0, 1]].forEach(([a, k]) => {
      g += `<path ${F} transform="rotate(${a}) scale(${k})" d="M0 0 C -8 -10, -7 -27, 0 -36 C 7 -27, 8 -10, 0 0Z"/>`;
    });
    return g + `<path ${F} d="M-24 2 C -14 11, 14 11, 24 2 C 12 6, -12 6, -24 2Z"/></g>`;
  };

  const bud = (x, y, s, deg) =>
    `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)}) scale(${r1(s)})">` +
    `<path ${F} d="M0 0 C -7 -8, -6 -20, 0 -27 C 6 -20, 7 -8, 0 0Z"/>` +
    `<path ${S(1.6)} d="M0 0 C 2 8, 1 16, -2 24"/></g>`;

  const pad = (x, y, rx, ry) => `<ellipse ${F} cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}"/>`;

  /* ---------- bố cục từng họa tiết dọc đường cong ---------- */
  const MOTIFS = {
    chuong(d, s) {
      const P = sampler(d).at;
      let g = `<path ${S(2.8 * s)} d="${d}"/>`;
      let side = 1;
      for (let t = 0.05; t < 0.96; t += 0.075) {
        const p = P(t);
        g += leaf(p.x, p.y, p.deg + (side > 0 ? -38 : 38), 19 * s);
        side = -side;
      }
      [0.17, 0.37, 0.57, 0.77].forEach((t) => { const p = P(t); g += bell(p.x, p.y, 1.05 * s); });
      [0.27, 0.47, 0.67, 0.9].forEach((t, i) => { const q = off(P(t), -(13 + (i % 2) * 6) * s); g += dot(q.x, q.y, 2.2 * s); });
      return g;
    },
    maysao(d, s) {
      const P = sampler(d).at;
      let g = `<path ${S(2.2 * s)} d="${d}"/>`;
      [[0.14, 15, -1], [0.4, 22, 1], [0.66, 17, -1], [0.88, 12, 1]].forEach(([t, r, side]) => {
        const q = off(P(t), side * -r * 0.95 * s);
        g += swirl(q.x, q.y, r * s, side, 2.3 * s);
      });
      [[0.06, -26, 7], [0.27, -30, 10], [0.33, 20, 6], [0.53, -28, 8], [0.58, 22, 6], [0.78, -26, 9], [0.95, -18, 6]]
        .forEach(([t, o, r]) => { const q = off(P(t), o * s); g += star(q.x, q.y, r * s); });
      [[0.2, -18], [0.48, 16], [0.72, 18], [0.83, -30]].forEach(([t, o]) => { const q = off(P(t), o * s); g += dot(q.x, q.y, 2 * s); });
      return g;
    },
    mai(d, s) {
      const P = sampler(d).at;
      let g = `<path ${S(3 * s)} d="${d}"/>`;
      [[0.36, -1], [0.66, 1]].forEach(([t, side]) => {
        const p = P(t), q = off(p, side * -26 * s), e = off(P(t + 0.07), side * -34 * s);
        g += `<path ${S(2 * s)} d="M${r1(p.x)} ${r1(p.y)} Q ${r1(q.x)} ${r1(q.y)} ${r1(e.x)} ${r1(e.y)}"/>`;
      });
      [[0.32, -4, 20, 8], [0.6, 4, 15, 30], [0.86, -3, 12, 50], [0.12, 2, 12, 20]].forEach(([t, o, r, rot]) => {
        const q = off(P(t), o * s); g += flower(q.x, q.y, r * s, rot);
      });
      [[0.2, -11], [0.46, 12], [0.73, -12], [0.95, 8]].forEach(([t, o]) => { const q = off(P(t), o * s); g += dot(q.x, q.y, 4 * s); });
      [[0.42, 1], [0.76, -1]].forEach(([t, side]) => { const p = P(t); g += leaf(p.x, p.y, p.deg + side * 40, 18 * s); });
      return g;
    },
    sen(d, s) {
      const P = sampler(d).at;
      let g = `<path ${S(1.8 * s)} d="${d}"/>`;
      [0.08, 0.3, 0.68, 0.93].forEach((t) => {
        const p = off(P(t), 7 * s);
        g += `<path ${S(1.4 * s)} d="M${r1(p.x - 12 * s)} ${r1(p.y)} q ${r1(6 * s)} ${r1(-4 * s)} ${r1(12 * s)} 0 t ${r1(12 * s)} 0"/>`;
      });
      const c = off(P(0.5), -4 * s); g += lotus(c.x, c.y, 1.05 * s);
      const b = P(0.25); g += bud(b.x, b.y - 20 * s, 0.85 * s, -10);
      const b2 = P(0.83); g += bud(b2.x, b2.y - 14 * s, 0.6 * s, 14);
      [[0.13, 20, 7], [0.72, 24, 8], [0.95, 14, 5]].forEach(([t, rx, ry]) => { const p = P(t); g += pad(p.x, p.y, rx * s, ry * s); });
      [[0.38, -24], [0.6, -30], [0.66, -16]].forEach(([t, o]) => { const q = off(P(t), o * s); g += dot(q.x, q.y, 2 * s); });
      return g;
    },
  };

  /* ---------- nhuộm màu xà cừ ---------- */
  function tintMatrix(hex) {
    if (!hex) hex = "#f6f2ff";
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const a = 0.6, k = 1.55;
    const lum = [0.3, 0.59, 0.11];
    const rows = c.map((ci, r) =>
      lum.map((l, j) => r1((r === j ? 1 - a : 0) * 100) / 100 + Math.round(a * ci * l * k * 1000) / 1000).join(" ") + " 0 0.02"
    );
    return rows.join("  ") + "  0 0 0 1 0";
  }

  /* ---------- ghép SVG ---------- */
  function render(cfg, opts = {}) {
    const id = "k" + ++uid;
    const shape = SHAPES[cfg.product] || SHAPES["luoc-song"];
    const base = findBy(STUDIO.bases, cfg.base);
    const nacre = findBy(STUDIO.nacres, cfg.nacre);
    const build = MOTIFS[cfg.motif] || MOTIFS.chuong;
    const body = shape.spine + shape.teeth;
    const animate = opts.animate !== false;
    const label = opts.label || "";

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="${ns}" role="img"${label ? ` aria-label="${label}"` : ' aria-hidden="true"'}>
  <defs>
    <clipPath id="${id}-spine">${shape.spine}</clipPath>
    <clipPath id="${id}-body">${body}</clipPath>
    <filter id="${id}-grain" x="0" y="0" width="1" height="1">
      <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.12" numOctaves="3" seed="${cfg.base.length * 7}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -0.58"/>
    </filter>
    <filter id="${id}-shadow" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="${id}-tint" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${tintMatrix(nacre.tint)}"/></filter>
    <filter id="${id}-inlay" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="0.9" stdDeviation="0.7" flood-color="#000" flood-opacity="0.55"/></filter>
    <pattern id="${id}-nacre" patternUnits="userSpaceOnUse" width="240" height="240">
      <image href="${NACRE_IMG}" width="240" height="240" preserveAspectRatio="xMidYMid slice" filter="url(#${id}-tint)"/>
    </pattern>
    <linearGradient id="${id}-gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="${base.grain ? 0.16 : 0.3}"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${id}-sheen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="240" y2="90">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.9"/>
      <stop offset="0.55" stop-color="#e7dcff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      ${animate ? `<animateTransform attributeName="gradientTransform" type="translate" values="-320 0; 900 0" dur="6s" repeatCount="indefinite"/>` : ""}
    </linearGradient>
    ${base.tex ? `<pattern id="${id}-wood" patternUnits="userSpaceOnUse" width="${base.tex[1]}" height="${base.tex[2]}"><image href="${base.tex[0]}" width="${base.tex[1]}" height="${base.tex[2]}" preserveAspectRatio="none"${base.texTint ? ` filter="url(#${id}-wt)"` : ""}/></pattern>` : ""}
    ${base.texTint ? `<filter id="${id}-wt" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${base.texTint}"/></filter>` : ""}
    <g id="${id}-motif">${build(shape.motif, shape.scale)}</g>
  </defs>
  <ellipse cx="400" cy="${shape.bottom + 22}" rx="300" ry="16" fill="#2a1222" opacity="0.22" filter="url(#${id}-shadow)"/>
  <g fill="${base.tex ? `url(#${id}-wood)` : base.color}">${body}</g>
  ${base.grain && !base.tex ? `<rect width="${W}" height="${H}" clip-path="url(#${id}-body)" filter="url(#${id}-grain)" opacity="0.55"/>` : ""}
  <rect width="${W}" height="${H}" clip-path="url(#${id}-body)" fill="url(#${id}-gloss)"/>
  <g clip-path="url(#${id}-spine)">
    <g filter="url(#${id}-inlay)"><use href="#${id}-motif" fill="url(#${id}-nacre)" stroke="url(#${id}-nacre)"/></g>
    ${animate ? `<use class="sheen" href="#${id}-motif" fill="url(#${id}-sheen)" stroke="url(#${id}-sheen)" opacity="0.38" style="mix-blend-mode:screen"/>` : ""}
  </g>
  <g fill="none" stroke="#fff" stroke-opacity="0.14" stroke-width="1.5">${shape.spine}</g>
</svg>`;
  }

  /* Ô màu xà cừ: vân xà cừ thật nhuộm đúng màu như trên sản phẩm */
  function swatch(nacreId) {
    const id = "s" + ++uid;
    const n = findBy(STUDIO.nacres, nacreId);
    return `<svg viewBox="0 0 44 44" aria-hidden="true"><defs>
      <filter id="${id}-t" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${tintMatrix(n.tint)}"/></filter>
      <clipPath id="${id}-c"><circle cx="22" cy="22" r="22"/></clipPath></defs>
      <g clip-path="url(#${id}-c)"><image href="${NACRE_IMG}" x="-50" y="-30" width="150" height="150" preserveAspectRatio="xMidYMid slice" filter="url(#${id}-t)"/></g></svg>`;
  }

  return { render, swatch };
})();
