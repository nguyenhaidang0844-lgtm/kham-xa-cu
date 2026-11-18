/* =========================================================
   DỮ LIỆU WEBSITE KHẢM. Sửa thông tin, sản phẩm, giá ở đây.
   ========================================================= */

const SITE = {
  brand: "Khảm",
  // TODO: thay bằng thông tin thật
  instagram: "https://instagram.com/",
  instagramHandle: "@kham.xacu",
  zalo: "https://zalo.me/0900000000",
  phone: "0900 000 000",
  email: "hello@kham.vn",
  freeShipFrom: 500000,
  shippingFee: 30000,
};

const CATEGORIES = {
  luoc: "Lược",
  kep: "Kẹp tóc",
  guong: "Gương",
};

/* Sản phẩm có sẵn.
   woods: các loại gỗ khách chọn được (giá không đổi).
   studio: cấu hình mở sẵn trong Studio khi bấm "Tùy chỉnh mẫu này". */
const PRODUCTS = [
  {
    id: "luoc-song-hoa-chuong", cat: "luoc", price: 350000, featured: true,
    name: "Lược sóng Hoa Chuông",
    imgs: ["img/mockup/m01-sq.jpg", "img/mockup/m02-sq.jpg", "img/mockup/m10-sq.jpg", "img/mockup/m09-sq.jpg"],
    desc: "Dáng lược lượn như sóng, một dây hoa chuông khảm xà cừ chạy dọc sống lược. Răng thưa, chải êm cho tóc dài.",
    material: "Gỗ mun, gỗ hương hoặc gỗ bách · xà cừ trắng và hồng · phủ dầu tự nhiên",
    woods: ["mun", "huong", "bach"],
    studio: { product: "luoc-song", base: "mun", motif: "chuong", nacre: "hong" },
  },
  {
    id: "luoc-trang-may-sao", cat: "luoc", price: 320000, featured: true,
    name: "Lược bán nguyệt Mây Sao",
    imgs: ["img/mockup/m04-sq.jpg", "img/mockup/m03-sq.jpg"],
    desc: "Lược hình trăng khuyết, những vòng mây cuộn và ngôi sao bốn cánh bằng xà cừ trắng ánh ngọc.",
    material: "Gỗ mun hoặc gỗ hương · xà cừ trắng · phủ dầu tự nhiên",
    woods: ["mun", "huong"],
    studio: { product: "luoc-trang", base: "mun", motif: "maysao", nacre: "ngoc" },
  },
  {
    id: "kep-son-mai-hoa-chuong", cat: "kep", price: 240000, featured: true,
    name: "Kẹp sơn mài Hoa Chuông",
    imgs: ["img/mockup/m05-sq.jpg"],
    desc: "Kẹp bầu dục sơn mài đen bóng, nhành hoa chuông hồng khảm xà cừ nghiêng theo dáng kẹp.",
    material: "Sơn mài đen trên cốt gỗ · xà cừ hồng và trắng · lò xo thép không gỉ",
    studio: { product: "kep-oval", base: "sonmai", motif: "chuong", nacre: "hong" },
  },
  {
    id: "kep-son-mai-mai-trang", cat: "kep", price: 250000, featured: true,
    name: "Kẹp sơn mài Hoa Bướm",
    imgs: ["img/mockup/m06-sq.jpg"],
    desc: "Một bông hoa lớn, một bông nhỏ và cánh bướm xà cừ ánh xanh trên nền sơn mài đen.",
    material: "Sơn mài đen trên cốt gỗ · xà cừ trắng ánh ngọc · lò xo thép không gỉ",
    studio: { product: "kep-oval", base: "sonmai", motif: "hoabuom", nacre: "ngoc" },
  },
  {
    id: "kep-son-mai-mai-hong", cat: "kep", price: 260000,
    name: "Kẹp sơn mài Mai Hồng",
    imgs: ["img/mockup/m07-sq.jpg"],
    desc: "Cành mai trải dài theo kẹp, xen hoa hồng nhạt và trắng, điểm chấm xà cừ như phấn hoa.",
    material: "Sơn mài đen trên cốt gỗ · xà cừ hồng và trắng · lò xo thép không gỉ",
    studio: { product: "kep-oval", base: "sonmai", motif: "mai", nacre: "ngoc" },
  },
  {
    id: "kep-son-mai-xuan", cat: "kep", price: 260000,
    name: "Kẹp sơn mài Xuân Thì",
    imgs: ["img/mockup/m08-sq.jpg"],
    desc: "Hai cụm hoa ở hai đầu kẹp, giữa là khoảng sơn đen để trống cho mắt nghỉ.",
    material: "Sơn mài đen trên cốt gỗ · xà cừ hồng và trắng · lò xo thép không gỉ",
    studio: { product: "kep-oval", base: "sonmai", motif: "xuan", nacre: "ngoc" },
  },
  {
    id: "guong-hoa-suong", cat: "guong", price: 450000,
    name: "Gương cầm tay Hoa Sương",
    imgs: ["img/products/guong-01.jpg"],
    desc: "Viền gương khảm xà cừ trắng ánh hồng, cành hoa chạy dọc tay cầm, kèm dây treo ngọc trai.",
    material: "Khung hợp kim mạ vàng nhạt · xà cừ trắng · ngọc trai nhân tạo",
  },
  {
    id: "luoc-anh-dao", cat: "luoc", price: 420000,
    name: "Lược Anh Đào",
    imgs: ["img/products/luoc-01.jpg"],
    desc: "Lược dáng lượn, cành hoa khảm xà cừ nổi trên nền trong, kèm dây tua ngọc trai.",
    material: "Nhựa acetate trong · xà cừ trắng và hồng · ngọc trai nhân tạo",
  },
  {
    id: "luoc-go-roi-ngoc-no", cat: "luoc", price: 190000,
    name: "Lược gỡ rối Ngọc Nơ",
    imgs: ["img/products/luoc-02.jpg"],
    desc: "Lược chải gỡ rối, thân khảm xà cừ ô vuông óng ánh, điểm nơ đính đá ở tay cầm.",
    material: "Thân nhựa ABS · xà cừ ghép ô · đệm cao su, răng nhựa đầu tròn",
  },
  {
    id: "kep-trang-sao", cat: "kep", price: 240000,
    name: "Kẹp Trăng Sao",
    imgs: ["img/products/kep-02.jpg"],
    desc: "Vầng trăng khuyết khảm xà cừ trắng, điểm ngôi sao nhỏ khảm bào ngư.",
    material: "Khung hợp kim · xà cừ trắng · vỏ bào ngư",
  },
  {
    id: "kep-no-bien", cat: "kep", price: 260000,
    name: "Kẹp nơ Sắc Biển",
    imgs: ["img/products/kep-01.jpg"],
    desc: "Kẹp nơ khảm vỏ bào ngư ánh xanh tím, màu đổi theo góc nhìn.",
    material: "Khung hợp kim · vỏ bào ngư",
  },
  {
    id: "kep-no-ngoc", cat: "kep", price: 220000,
    name: "Kẹp nơ Ngọc Trắng",
    imgs: ["img/products/kep-03.jpg"],
    desc: "Kẹp nơ viền vàng, khảm xà cừ trắng ngà, hợp đi học, đi làm lẫn dự tiệc.",
    material: "Khung hợp kim mạ vàng · xà cừ trắng",
  },
  {
    id: "kep-hoa-mai", cat: "kep", price: 65000,
    name: "Kẹp hoa Mai Ngọc",
    imgs: ["img/products/kep-04.jpg"],
    desc: "Bông hoa năm cánh khảm xà cừ, nhụy ngọc trai, nhỏ xinh dễ phối đồ.",
    material: "Khung hợp kim · xà cừ trắng · ngọc trai nhân tạo",
  },
  {
    id: "kep-buom", cat: "kep", price: 60000,
    name: "Kẹp Bướm Ngà",
    imgs: ["img/products/kep-05.jpg"],
    desc: "Cánh bướm khảm xà cừ trắng ngà, viền kim loại vàng nhạt.",
    material: "Khung hợp kim · xà cừ trắng",
  },
  {
    id: "kep-cang-cua", cat: "kep", price: 70000,
    name: "Kẹp càng cua Ánh Ngà",
    imgs: ["img/products/kep-06.jpg"],
    desc: "Kẹp càng cua dáng chữ nhật tối giản, bề mặt xà cừ óng ánh, giữ tóc chắc.",
    material: "Nhựa acetate · lớp xà cừ ép",
  },
];

/* ---------------- STUDIO ----------------
   Mỗi cặp sản phẩm + họa tiết ứng với một ảnh mockup thật trong img/studio/<sản phẩm>-<họa tiết>.jpg
   surface: chất liệu gốc trong ảnh (wood | lacquer), dùng để đổi màu cho đúng.
   ramp: 3 màu (tối, giữa, sáng) mà độ sáng của ảnh được ánh xạ sang. */
const STUDIO = {
  products: [
    { id: "kep-oval", name: "Kẹp bầu dục", type: "Kẹp tóc", price: 220000, note: "Dài 9 cm", surface: "lacquer", motifs: ["hoabuom", "mai", "xuan", "chuong"] },
    { id: "luoc-song", name: "Lược sóng", type: "Lược", price: 350000, note: "Dài 15 cm", surface: "wood", motifs: ["chuong"] },
    { id: "luoc-trang", name: "Lược bán nguyệt", type: "Lược", price: 320000, note: "Dài 14 cm", surface: "wood", motifs: ["maysao"] },
  ],
  bases: [
    { id: "sonmai", name: "Sơn mài đen", kind: "lacquer", swatch: "#0d0b0e", ramp: ["#030203", "#141116", "#6a6570"], add: 30000 },
    { id: "sonmai-tim", name: "Sơn mài tím mận", kind: "lacquer", swatch: "#3b1631", ramp: ["#0d0209", "#3d1433", "#a3729a"], add: 30000 },
    { id: "mun", name: "Gỗ mun", kind: "wood", swatch: "#2b1d18", ramp: ["#0b0706", "#2d1f18", "#6e5646"], add: 40000 },
    { id: "huong", name: "Gỗ hương", kind: "wood", swatch: "#6e3523", ramp: ["#1f0905", "#61261a", "#b36a45"], add: 20000 },
    { id: "bach", name: "Gỗ bách", kind: "wood", swatch: "#b5824f", ramp: ["#5c3b1b", "#b2803f", "#f0cf98"], add: 0 },
  ],
  motifs: [
    { id: "hoabuom", name: "Hoa và bướm", meaning: "Bướm tìm hoa: niềm vui, tình yêu đôi lứa.", add: 40000 },
    { id: "mai", name: "Cành mai", meaning: "Hoa của Tết phương Nam: khởi đầu mới và sung túc.", add: 30000 },
    { id: "xuan", name: "Xuân thì", meaning: "Hai cụm hoa ở hai đầu kẹp: tuổi xuân tươi đẹp.", add: 30000 },
    { id: "chuong", name: "Dây hoa chuông", meaning: "Dây leo không đứt, hoa rủ mềm: dịu dàng và bền lâu.", add: 30000 },
    { id: "maysao", name: "Mây sao", meaning: "Mây cuộn và sao bốn cánh: ước mơ, may mắn trên đường đi.", add: 20000 },
  ],
  nacres: [
    { id: "ngoc", name: "Trắng ánh ngọc", tint: null, add: 0 },
    { id: "tim", name: "Tím", tint: "#b49ae6", add: 20000 },
    { id: "hong", name: "Hồng", tint: "#f4a9c4", add: 20000 },
    { id: "xanh", name: "Xanh ngọc", tint: "#86dcc9", add: 20000 },
  ],
  defaults: { product: "kep-oval", base: "sonmai", motif: "hoabuom", nacre: "ngoc" },
};

/* Đưa cấu hình về dạng hợp lệ (cấu hình cũ, đường dẫn sai, họa tiết không có cho sản phẩm) */
function normalizeCfg(c = {}) {
  const ok = (list, id) => list.some((x) => x.id === id);
  const out = { ...STUDIO.defaults };
  if (ok(STUDIO.products, c.product)) out.product = c.product;
  if (ok(STUDIO.bases, c.base)) out.base = c.base;
  if (ok(STUDIO.nacres, c.nacre)) out.nacre = c.nacre;
  const motifs = findBy(STUDIO.products, out.product).motifs;
  out.motif = motifs.includes(c.motif) ? c.motif : motifs[0];
  return out;
}

const fmtVND = (n) => n.toLocaleString("vi-VN") + "₫";
const findBy = (list, id) => list.find((x) => x.id === id) || list[0];

function studioPrice(cfg) {
  return (
    findBy(STUDIO.products, cfg.product).price +
    findBy(STUDIO.bases, cfg.base).add +
    findBy(STUDIO.motifs, cfg.motif).add +
    findBy(STUDIO.nacres, cfg.nacre).add
  );
}

function studioSpec(cfg) {
  return [
    findBy(STUDIO.bases, cfg.base).name,
    "họa tiết " + findBy(STUDIO.motifs, cfg.motif).name.toLowerCase(),
    "xà cừ " + findBy(STUDIO.nacres, cfg.nacre).name.toLowerCase(),
  ].join(" · ");
}
