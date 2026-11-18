(() => {
  const view = document.getElementById("view");
  const form = { name: "", phone: "", address: "", note: "", pay: "cod" };

  const shipping = (sub) => (sub >= SITE.freeShipFrom || sub === 0 ? 0 : SITE.shippingFee);

  function lineHTML(l) {
    const thumb = l.kind === "custom"
      ? `<img data-cfg='${JSON.stringify(normalizeCfg(l.config))}' alt="${l.name}" />`
      : `<img src="${l.img}" alt="${l.name}" />`;
    const edit = l.kind === "custom"
      ? `<a class="text-btn" href="studio.html?${new URLSearchParams(normalizeCfg(l.config))}">Sửa thiết kế</a>`
      : `<a class="text-btn" href="cua-hang.html?item=${l.productId}">Xem sản phẩm</a>`;
    return `<li class="cart-line" data-key="${l.key}">
      <div class="cart-line__img${l.kind === "custom" ? " is-custom" : ""}">${thumb}</div>
      <div>
        ${l.kind === "custom" ? `<span class="badge">Thiết kế riêng</span>` : ""}
        <h3>${l.name}</h3>
        <p class="spec">${l.spec}</p>
        <div class="cart-line__actions">
          <div class="qty qty--sm" aria-label="Số lượng">
            <button type="button" data-step="-1" aria-label="Giảm số lượng"${l.qty <= 1 ? " disabled" : ""}>−</button>
            <input type="number" min="1" max="99" value="${l.qty}" inputmode="numeric" aria-label="Số lượng ${l.name}" />
            <button type="button" data-step="1" aria-label="Tăng số lượng">+</button>
          </div>
          ${edit}
          <button class="text-btn" type="button" data-remove>Xóa</button>
        </div>
      </div>
      <div class="cart-line__end">
        <strong>${fmtVND(l.price * l.qty)}</strong>
        ${l.qty > 1 ? `<small>${fmtVND(l.price)} / món</small>` : ""}
      </div>
    </li>`;
  }

  function summaryHTML() {
    const sub = Store.subtotal(), ship = shipping(sub);
    const left = Math.max(0, SITE.freeShipFrom - sub);
    const pct = Math.min(100, Math.round((sub / SITE.freeShipFrom) * 100));
    const row = (a, b) => `<div><span>${a}</span><span>${b}</span></div>`;
    return `<div class="summary" style="border:0;padding:0">
        ${row(`Tạm tính (${Store.count()} món)`, fmtVND(sub))}
        ${row("Giao hàng", ship ? fmtVND(ship) : "Miễn phí")}
        <div class="total"><span>Tổng cộng</span><span id="grand">${fmtVND(sub + ship)}</span></div>
      </div>
      <p class="ship-note">${left ? `Mua thêm ${fmtVND(left)} để được miễn phí giao hàng.` : "Đơn của bạn được miễn phí giao hàng."}</p>
      <div class="progress" aria-hidden="true"><i style="width:${pct}%"></i></div>`;
  }

  function fillThumbs() {
    document.querySelectorAll("img[data-cfg]").forEach(async (img) => {
      img.src = await Recolor.dataUrl(JSON.parse(img.dataset.cfg), 360);
      img.removeAttribute("data-cfg");
    });
  }

  function render() {
    const cart = Store.cart();
    document.getElementById("pageTitle").textContent = "Giỏ hàng";
    if (!cart.length) {
      view.innerHTML = `<div class="cart-empty">
        <p class="lead">Giỏ hàng đang trống.</p>
        <div class="row" style="justify-content:center">
          <a class="btn btn--primary" href="studio.html">Tự thiết kế</a>
          <a class="btn btn--ghost" href="cua-hang.html">Xem cửa hàng</a>
        </div></div>`;
      return;
    }
    view.innerHTML = `<div class="cart">
      <ul class="cart-lines" id="lines">${cart.map(lineHTML).join("")}</ul>
      <aside class="panel" aria-label="Thanh toán">
        <h2>Đơn hàng</h2>
        <div id="sum">${summaryHTML()}</div>
        <form class="form" id="checkout" novalidate>
          <label>Họ và tên<input name="name" autocomplete="name" required value="${form.name}" /><span class="err"></span></label>
          <label>Số điện thoại<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required value="${form.phone}" /><span class="err"></span></label>
          <label>Địa chỉ nhận hàng<input name="address" autocomplete="street-address" required value="${form.address}" /><span class="err"></span></label>
          <label>Ghi chú (không bắt buộc)<textarea name="note" rows="2">${form.note}</textarea></label>
          <fieldset class="pay">
            <legend>Thanh toán</legend>
            <label><input type="radio" name="pay" value="cod"${form.pay === "cod" ? " checked" : ""} /> Thanh toán khi nhận hàng</label>
            <label><input type="radio" name="pay" value="bank"${form.pay === "bank" ? " checked" : ""} /> Chuyển khoản (gửi thông tin sau khi đặt)</label>
          </fieldset>
          <button class="btn btn--primary btn--block" type="submit">Đặt hàng</button>
        </form>
      </aside>
    </div>`;
    fillThumbs();
  }

  function refreshLinesAndSum() {
    // vẽ lại danh sách nhưng giữ nguyên form để không mất chữ đang gõ
    const lines = document.getElementById("lines");
    if (!Store.cart().length) { render(); return; }
    lines.innerHTML = Store.cart().map(lineHTML).join("");
    fillThumbs();
    document.getElementById("sum").innerHTML = summaryHTML();
  }

  view.addEventListener("click", (e) => {
    const line = e.target.closest(".cart-line");
    if (!line) return;
    const key = line.dataset.key;
    const cur = Store.cart().find((l) => l.key === key);
    if (e.target.closest("[data-step]")) {
      Store.setQty(key, cur.qty + Number(e.target.closest("[data-step]").dataset.step));
      refreshLinesAndSum();
    } else if (e.target.closest("[data-remove]")) {
      Store.remove(key);
      refreshLinesAndSum();
      toast(`Đã xóa ${cur.name} khỏi giỏ.`);
    }
  });
  view.addEventListener("change", (e) => {
    if (e.target.matches(".cart-line input")) {
      Store.setQty(e.target.closest(".cart-line").dataset.key, parseInt(e.target.value, 10) || 1);
      refreshLinesAndSum();
    }
  });
  view.addEventListener("input", (e) => {
    if (e.target.form && e.target.form.id === "checkout" && e.target.name in form) form[e.target.name] = e.target.value;
  });

  /* ---------- Đặt hàng ---------- */
  const RULES = {
    name: (v) => (v.trim().length >= 2 ? "" : "Vui lòng nhập họ tên."),
    phone: (v) => (/^(0|\+84)\d{9,10}$/.test(v.replace(/[\s.]/g, "")) ? "" : "Số điện thoại chưa đúng, ví dụ 0912 345 678."),
    address: (v) => (v.trim().length >= 8 ? "" : "Vui lòng nhập địa chỉ đầy đủ."),
  };

  view.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    let firstBad = null;
    Object.entries(RULES).forEach(([k, rule]) => {
      const input = f.elements[k];
      const msg = rule(input.value);
      input.setAttribute("aria-invalid", !!msg);
      input.nextElementSibling.textContent = msg;
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); return; }
    const info = {
      name: f.elements.name.value.trim(), phone: f.elements.phone.value.trim(),
      address: f.elements.address.value.trim(), note: f.elements.note.value.trim(), pay: f.elements.pay.value,
    };
    const order = Store.placeOrder(info);
    showConfirm(order);
  });

  function orderText(o) {
    const lines = o.lines.map((l) => `- ${l.qty} × ${l.name} (${l.spec}): ${fmtVND(l.price * l.qty)}`).join("\n");
    return `Đơn hàng Khảm ${o.code}\n${lines}\nGiao hàng: ${o.shipping ? fmtVND(o.shipping) : "Miễn phí"}\nTổng: ${fmtVND(o.total)}\n` +
      `Người nhận: ${o.info.name}, ${o.info.phone}\nĐịa chỉ: ${o.info.address}\nThanh toán: ${o.info.pay === "cod" ? "Khi nhận hàng" : "Chuyển khoản"}` +
      (o.info.note ? `\nGhi chú: ${o.info.note}` : "");
  }

  function showConfirm(o) {
    document.getElementById("pageTitle").textContent = "Cảm ơn bạn";
    view.innerHTML = `<div class="confirm fade-in">
      <p class="label muted">Mã đơn hàng</p>
      <p class="code">${o.code}</p>
      <p class="lead">Khảm đã ghi nhận đơn của ${o.info.name}. Để xác nhận nhanh, bấm nút bên dưới: nội dung đơn được sao chép sẵn, bạn chỉ cần dán vào Zalo và gửi.</p>
      <table>${o.lines.map((l) => `<tr><td>${l.qty} × ${l.name}<br><small class="muted">${l.spec}</small></td><td>${fmtVND(l.price * l.qty)}</td></tr>`).join("")}
        <tr><td>Giao hàng</td><td>${o.shipping ? fmtVND(o.shipping) : "Miễn phí"}</td></tr>
        <tr><td><strong>Tổng cộng</strong></td><td><strong>${fmtVND(o.total)}</strong></td></tr>
      </table>
      <div class="row">
        <button class="btn btn--primary" type="button" id="sendZalo">Sao chép đơn và mở Zalo</button>
        <a class="btn btn--ghost" href="cua-hang.html">Tiếp tục mua sắm</a>
      </div>
    </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("sendZalo").addEventListener("click", async () => {
      const text = orderText(o);
      try { await navigator.clipboard.writeText(text); toast("Đã sao chép nội dung đơn. Dán vào Zalo để gửi."); }
      catch { prompt("Sao chép nội dung đơn dưới đây:", text); }
      window.open(SITE.zalo, "_blank", "noopener");
    });
  }

  render();
})();
