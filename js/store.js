/* Giỏ hàng, thiết kế đã lưu, đơn hàng: lưu trong localStorage của trình duyệt. */
const Store = (() => {
  const KEYS = { cart: "kham-cart-v1", saved: "kham-saved-v1", orders: "kham-orders-v1" };
  const read = (k) => { try { return JSON.parse(localStorage.getItem(KEYS[k])) || []; } catch { return []; } };
  const write = (k, v) => { localStorage.setItem(KEYS[k], JSON.stringify(v)); emit(); };
  const emit = () => document.dispatchEvent(new CustomEvent("store:change"));

  /* Mỗi dòng giỏ hàng:
     { key, kind: "shop" | "custom", productId?, wood?, config?, name, spec, img?, price, qty } */
  function lineFromProduct(p, wood) {
    const woodName = wood ? findBy(STUDIO.bases, wood).name : null;
    return {
      key: "shop:" + p.id + (wood ? ":" + wood : ""),
      kind: "shop", productId: p.id, wood,
      name: p.name, spec: woodName ? woodName + " · " + p.material.split(" · ").slice(1).join(" · ") : p.material,
      img: p.imgs[0], price: p.price,
    };
  }

  function lineFromConfig(cfg) {
    const prod = findBy(STUDIO.products, cfg.product);
    return {
      key: "custom:" + [cfg.product, cfg.base, cfg.motif, cfg.nacre].join(":"),
      kind: "custom", config: { ...cfg },
      name: prod.name + " thiết kế riêng", spec: studioSpec(cfg), price: studioPrice(cfg),
    };
  }

  return {
    cart: () => read("cart"),
    count: () => read("cart").reduce((s, l) => s + l.qty, 0),
    subtotal: () => read("cart").reduce((s, l) => s + l.qty * l.price, 0),
    add(line, qty = 1) {
      const cart = read("cart");
      const hit = cart.find((l) => l.key === line.key);
      if (hit) hit.qty = Math.min(99, hit.qty + qty); else cart.push({ ...line, qty });
      write("cart", cart);
    },
    setQty(key, qty) {
      const cart = read("cart");
      const hit = cart.find((l) => l.key === key);
      if (!hit) return;
      hit.qty = Math.max(1, Math.min(99, qty));
      write("cart", cart);
    },
    remove(key) { write("cart", read("cart").filter((l) => l.key !== key)); },
    clearCart() { write("cart", []); },
    lineFromProduct, lineFromConfig,

    saved: () => read("saved"),
    save(cfg) {
      const list = read("saved").filter((s) => JSON.stringify(s.config) !== JSON.stringify(cfg));
      list.unshift({ id: Date.now().toString(36), config: { ...cfg }, at: Date.now() });
      write("saved", list.slice(0, 12));
    },
    unsave(id) { write("saved", read("saved").filter((s) => s.id !== id)); },

    placeOrder(info) {
      const cart = read("cart");
      const sub = cart.reduce((s, l) => s + l.qty * l.price, 0);
      const ship = sub >= SITE.freeShipFrom || sub === 0 ? 0 : SITE.shippingFee;
      const order = {
        code: "KH" + Date.now().toString().slice(-6),
        at: new Date().toISOString(), info, lines: cart, subtotal: sub, shipping: ship, total: sub + ship,
      };
      write("orders", [order, ...read("orders")]);
      write("cart", []);
      return order;
    },
  };
})();
