/* Header, footer, toast dùng chung cho mọi trang.
   Mỗi trang đặt <body data-page="..."> để đánh dấu menu đang mở. */
(() => {
  const page = document.body.dataset.page;
  const nav = [
    ["cua-hang", "cua-hang.html", "Cửa hàng"],
    ["studio", "studio.html", "Studio"],
    ["cau-chuyen", "cau-chuyen.html", "Câu chuyện"],
  ];
  const navHtml = nav
    .map(([id, href, label]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<a class="skip" href="#main">Bỏ qua menu</a>
    <header class="header" id="top">
      <div class="header__inner">
        <button class="burger" id="burger" aria-label="Mở menu" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
        <nav class="nav" id="nav" aria-label="Chính">${navHtml}</nav>
        <a href="index.html" class="logo" aria-label="Khảm, về trang chủ"><img src="img/brand/logo-ivory.png" alt="Khảm" width="96" height="51" /></a>
        <div class="header__right">
          <a href="gio-hang.html" class="cart-link"${page === "gio-hang" ? ' aria-current="page"' : ""}>
            <span class="cart-link__text">Giỏ hàng</span> <span class="cart-count" data-cart-count>0</span>
          </a>
        </div>
      </div>
    </header>`
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer class="footer">
      <div class="band band--inverse" aria-hidden="true"></div>
      <div class="container footer__inner">
        <div class="footer__brand">
          <img src="img/brand/logo-ivory.png" alt="Khảm" width="120" height="64" />
          <p>Khảm xà cừ thủ công Việt Nam, trong những món đồ bạn tự thiết kế.</p>
        </div>
        <div>
          <h4>Mua sắm</h4>
          <ul>
            <li><a href="cua-hang.html">Cửa hàng</a></li>
            <li><a href="studio.html">Studio thiết kế</a></li>
            <li><a href="gio-hang.html">Giỏ hàng</a></li>
          </ul>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <ul>
            <li><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram ${SITE.instagramHandle}</a></li>
            <li><a href="${SITE.zalo}" target="_blank" rel="noopener">Zalo ${SITE.phone}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          </ul>
        </div>
        <div>
          <h4>Chính sách</h4>
          <ul>
            <li>Miễn phí giao hàng từ ${fmtVND(SITE.freeShipFrom)}</li>
            <li>Thiết kế riêng hoàn thành trong 7–14 ngày</li>
            <li>Đổi trong 7 ngày nếu có lỗi chế tác</li>
          </ul>
        </div>
      </div>
      <div class="container footer__bottom">
        <span>© ${new Date().getFullYear()} Khảm</span>
        <a href="#top">Lên đầu trang</a>
      </div>
    </footer>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <div class="aurora" aria-hidden="true"></div>`
  );

  // Đếm giỏ hàng
  const renderCount = () => {
    const n = Store.count();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.classList.toggle("is-empty", n === 0);
    });
  };
  document.addEventListener("store:change", renderCount);
  window.addEventListener("storage", renderCount);
  renderCount();

  // Menu mobile
  const burger = document.getElementById("burger");
  const navEl = document.getElementById("nav");
  burger.addEventListener("click", () => {
    const open = navEl.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });

  // Header khi cuộn
  const header = document.querySelector(".header");
  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

  // Toast
  let t;
  window.toast = (html) => {
    const el = document.getElementById("toast");
    el.innerHTML = html;
    el.classList.add("is-on");
    clearTimeout(t);
    t = setTimeout(() => el.classList.remove("is-on"), 3600);
  };
})();
