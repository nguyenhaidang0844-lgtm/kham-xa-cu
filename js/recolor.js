/* =========================================================
   ĐỔI MÀU TRÊN ẢNH MOCKUP THẬT
   Mỗi sản phẩm có 2 file trong img/studio/:
     <id>.jpg       : ảnh gốc đã cắt
     <id>-mask.png  : R = vùng xà cừ, G = vùng nền gỗ/sơn, B = độ trong suốt
   Nền: ánh xạ độ sáng của ảnh sang dải màu vật liệu (giữ vân gỗ, độ bóng).
   Xà cừ: nhuộm màu nhưng giữ lại ánh óng của ảnh.
   ========================================================= */
const Recolor = (() => {
  const loaded = {};
  const outCache = new Map();

  const loadImg = (src) => new Promise((res, rej) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Không tải được " + src)); i.src = src;
  });
  const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));

  function pixels(img, w, h) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(img, 0, 0, w, h);
    return x.getImageData(0, 0, w, h).data;
  }

  /* Nạp ảnh + mặt nạ, tính độ sáng và ngưỡng chuẩn hóa của vùng nền */
  function source(id) {
    if (loaded[id]) return loaded[id];
    return (loaded[id] = (async () => {
      const [img, mask] = await Promise.all([loadImg(`img/studio/${id}.jpg`), loadImg(`img/studio/${id}-mask.png`)]);
      const w = img.naturalWidth, h = img.naturalHeight;
      const rgb = pixels(img, w, h), m = pixels(mask, w, h);
      const n = w * h, L = new Float32Array(n), hist = new Uint32Array(256);
      let count = 0;
      for (let p = 0, i = 0; p < n; p++, i += 4) {
        L[p] = 0.299 * rgb[i] + 0.587 * rgb[i + 1] + 0.114 * rgb[i + 2];
        if (m[i + 1] > 230 && m[i + 2] > 250) { hist[L[p] | 0]++; count++; }
      }
      const pct = (q) => { let s = 0; for (let v = 0; v < 256; v++) { s += hist[v]; if (s >= count * q) return v; } return 255; };
      return { w, h, rgb, m, L, lo: pct(0.05), hi: Math.max(pct(0.95), pct(0.05) + 20) };
    })());
  }

  /* Vân gỗ thật để phủ lên kẹp sơn mài khi chọn chất liệu gỗ */
  let grainP;
  function grain(w, h) {
    if (!grainP) grainP = loadImg("img/texture/wood-huong.jpg");
    return grainP.then((img) => {
      const d = pixels(img, w, h), g = new Float32Array(w * h);
      let lo = 255, hi = 0;
      for (let p = 0, i = 0; p < w * h; p++, i += 4) { const v = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; g[p] = v; if (v < lo) lo = v; if (v > hi) hi = v; }
      for (let p = 0; p < g.length; p++) g[p] = (g[p] - lo) / (hi - lo || 1);
      return g;
    });
  }

  function ramp(stops, t) {
    const [a, b, c] = stops;
    if (t <= 0.5) { const k = t / 0.5; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
    const k = (t - 0.5) / 0.5; return [b[0] + (c[0] - b[0]) * k, b[1] + (c[1] - b[1]) * k, b[2] + (c[2] - b[2]) * k];
  }

  /* Vẽ cấu hình ra canvas. maxW: chiều rộng tối đa (ảnh nhỏ cho thẻ, giỏ hàng) */
  async function render(cfg, maxW = 1000) {
    const prod = findBy(STUDIO.products, cfg.product);
    const motif = prod.motifs.includes(cfg.motif) ? cfg.motif : prod.motifs[0];
    const id = `${prod.id}-${motif}`;
    const original = cfg.original === true;
    const key = [id, original ? "goc" : cfg.base, original ? "goc" : cfg.nacre, maxW].join("|");
    if (outCache.has(key)) return outCache.get(key);

    const job = (async () => {
      const src = await source(id);
      const base = findBy(STUDIO.bases, cfg.base);
      const nacre = findBy(STUDIO.nacres, cfg.nacre);
      const stops = base.ramp.map(hex);
      const tint = !original && nacre.tint ? hex(nacre.tint) : null;
      const woodOnLacquer = prod.surface === "lacquer" && base.kind === "wood";
      const lacquerOnWood = prod.surface === "wood" && base.kind === "lacquer";
      const g = woodOnLacquer ? await grain(src.w, src.h) : null;
      const { w, h, rgb, m, L, lo, hi } = src;
      const out = new ImageData(w, h), o = out.data;

      for (let p = 0, i = 0; p < w * h; p++, i += 4) {
        let r = rgb[i], gg = rgb[i + 1], b = rgb[i + 2];
        const nw = m[i] / 255;             // R: trọng số xà cừ
        const bw = m[i + 1] / 255;         // G: trọng số nền
        const a = m[i + 2];                // B: độ trong suốt
        if (!original && bw > 0.01) {
          let t = (L[p] - lo) / (hi - lo);
          if (lacquerOnWood) t = t * 0.35 + 0.08;          // làm phẳng vân gỗ thành mặt sơn
          if (g) t = Math.min(1, t * 0.6 + g[p] * 0.55);   // thêm vân gỗ thật lên mặt sơn
          t = Math.max(0, Math.min(1, t));
          let [nr, ng, nb] = ramp(stops, t);
          if (L[p] > hi + 15) {                             // giữ điểm bóng sáng của ảnh
            const k = Math.min(1, (L[p] - hi - 15) / (255 - hi - 15)) * (base.kind === "lacquer" ? 1 : 0.6);
            nr += (r - nr) * k; ng += (gg - ng) * k; nb += (b - nb) * k;
          }
          r += (nr - r) * bw; gg += (ng - gg) * bw; b += (nb - b) * bw;
        }
        if (tint && nw > 0.01) {
          const l = L[p] / 255, k = 0.68 * nw;
          const tr = tint[0] * (0.35 + l * 0.85) + r * 0.12;
          const tg = tint[1] * (0.35 + l * 0.85) + gg * 0.12;
          const tb = tint[2] * (0.35 + l * 0.85) + b * 0.12;
          r += (Math.min(255, tr) - r) * k; gg += (Math.min(255, tg) - gg) * k; b += (Math.min(255, tb) - b) * k;
        }
        o[i] = r; o[i + 1] = gg; o[i + 2] = b; o[i + 3] = a;
      }

      const full = document.createElement("canvas"); full.width = w; full.height = h;
      full.getContext("2d").putImageData(out, 0, 0);
      if (maxW >= w) return full;
      const s = document.createElement("canvas");
      s.width = maxW; s.height = Math.round((h * maxW) / w);
      const sx = s.getContext("2d"); sx.imageSmoothingQuality = "high"; sx.drawImage(full, 0, 0, s.width, s.height);
      return s;
    })();
    outCache.set(key, job);
    if (outCache.size > 80) outCache.delete(outCache.keys().next().value);
    return job;
  }

  /* Ảnh dạng data URL (cho thẻ <img>, giỏ hàng) */
  const dataUrl = async (cfg, maxW = 400) => (await render(cfg, maxW)).toDataURL("image/png");

  /* Ô màu xà cừ: vân xà cừ thật, nhuộm bằng đúng công thức trên sản phẩm */
  let swP;
  async function swatch(nacreId, size = 88) {
    if (!swP) swP = loadImg("img/texture/nacre-pastel.jpg");
    const img = await swP;
    const nacre = findBy(STUDIO.nacres, nacreId);
    const c = document.createElement("canvas"); c.width = c.height = size;
    const x = c.getContext("2d");
    x.drawImage(img, img.naturalWidth * 0.2, img.naturalHeight * 0.35, img.naturalWidth * 0.5, img.naturalWidth * 0.5, 0, 0, size, size);
    if (nacre.tint) {
      const d = x.getImageData(0, 0, size, size), o = d.data, t = hex(nacre.tint);
      for (let i = 0; i < o.length; i += 4) {
        const l = (0.299 * o[i] + 0.587 * o[i + 1] + 0.114 * o[i + 2]) / 255;
        for (let k = 0; k < 3; k++) o[i + k] += (Math.min(255, t[k] * (0.35 + l * 0.85) + o[i + k] * 0.12) - o[i + k]) * 0.68;
      }
      x.putImageData(d, 0, 0);
    }
    return c.toDataURL("image/jpeg", 0.9);
  }

  return { render, dataUrl, swatch, preload: (cfg) => render(cfg) };
})();
