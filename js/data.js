/* =========================================================
   CẤU HÌNH & DỮ LIỆU WEBSITE
   Chỉ cần sửa file này để đổi thông tin liên hệ / sản phẩm.
   ========================================================= */

const SITE = {
  // TODO: thay bằng tên thương hiệu chính thức
  brand: "Ánh Ngọc",
  tagline: { vi: "Khảm xà cừ Việt", en: "Vietnamese mother-of-pearl" },

  // TODO: thay bằng thông tin thật
  instagram: "https://instagram.com/",      // vd: https://instagram.com/anhngoc.khamxacu
  instagramHandle: "@anhngoc.khamxacu",
  zalo: "https://zalo.me/0900000000",       // vd: https://zalo.me/09xxxxxxxx
  phone: "0900 000 000",
  email: "hello@example.com",
  customOrderForm: "https://forms.gle/",    // link Google Form đặt thiết kế riêng
};

/* Phân loại sản phẩm */
const CATEGORIES = {
  guong: { vi: "Gương", en: "Mirrors" },
  luoc:  { vi: "Lược", en: "Combs" },
  kep:   { vi: "Kẹp tóc", en: "Hair clips" },
};

const TIERS = {
  pho_thong: { vi: "Phổ thông", en: "Essential" },
  cau_ky:    { vi: "Cầu kỳ", en: "Signature" },
};

/* Danh sách sản phẩm.
   - img: đặt ảnh trong img/products/ (thay file cùng tên là xong)
   - price: giá bán (VNĐ). TODO: cập nhật giá chính thức từng mẫu */
const PRODUCTS = [
  {
    id: "guong-hoa-suong", cat: "guong", tier: "cau_ky", price: 450000,
    img: "img/products/guong-01.jpg",
    name: { vi: "Gương cầm tay Hoa Sương", en: "Dew Blossom Hand Mirror" },
    desc: {
      vi: "Viền gương khảm xà cừ trắng ánh hồng, cành hoa và sao nhỏ chạy dọc tay cầm, kèm dây treo ngọc trai và mặt hoa xà cừ.",
      en: "A frame inlaid with pink-white mother-of-pearl, a flowering branch running down the handle, finished with a pearl charm.",
    },
  },
  {
    id: "luoc-anh-dao", cat: "luoc", tier: "cau_ky", price: 420000,
    img: "img/products/luoc-01.jpg",
    name: { vi: "Lược Anh Đào", en: "Cherry Blossom Comb" },
    desc: {
      vi: "Lược dáng lượn sóng, cành anh đào khảm xà cừ nổi trên nền trong suốt, kèm dây tua ngọc trai.",
      en: "A wave-shaped comb with an inlaid cherry-blossom branch and a pearl tassel.",
    },
  },
  {
    id: "luoc-ngoc-no", cat: "luoc", tier: "pho_thong", price: 190000,
    img: "img/products/luoc-02.jpg",
    name: { vi: "Lược gỡ rối Ngọc Nơ", en: "Pearl Bow Paddle Brush" },
    desc: {
      vi: "Lược chải gỡ rối, thân khảm xà cừ ô vuông óng ánh, điểm nơ đính đá ở tay cầm.",
      en: "Detangling brush with a checkered mother-of-pearl body and a jewelled bow on the handle.",
    },
  },
  {
    id: "kep-no-bien", cat: "kep", tier: "cau_ky", price: 260000,
    img: "img/products/kep-01.jpg",
    name: { vi: "Kẹp nơ Sắc Biển", en: "Ocean Shimmer Bow Clip" },
    desc: {
      vi: "Kẹp nơ khảm vỏ bào ngư ánh xanh tím, sắc màu đổi theo góc nhìn.",
      en: "A bow clip inlaid with blue-violet abalone shell that shifts colour with the light.",
    },
  },
  {
    id: "kep-trang-sao", cat: "kep", tier: "cau_ky", price: 240000,
    img: "img/products/kep-02.jpg",
    name: { vi: "Kẹp Trăng Sao", en: "Moon & Star Clip" },
    desc: {
      vi: "Vầng trăng khuyết khảm xà cừ trắng, điểm ngôi sao nhỏ khảm bào ngư.",
      en: "A crescent moon in white mother-of-pearl with a small abalone star.",
    },
  },
  {
    id: "kep-no-ngoc", cat: "kep", tier: "cau_ky", price: 220000,
    img: "img/products/kep-03.jpg",
    name: { vi: "Kẹp nơ Ngọc Trắng", en: "Pearl White Bow Clip" },
    desc: {
      vi: "Kẹp nơ viền vàng, khảm xà cừ trắng ngà, hợp đi học, đi làm lẫn dự tiệc.",
      en: "Gold-rimmed bow clip in ivory mother-of-pearl, for school, work or evenings out.",
    },
  },
  {
    id: "kep-hoa-mai", cat: "kep", tier: "pho_thong", price: 65000,
    img: "img/products/kep-04.jpg",
    name: { vi: "Kẹp hoa Mai Ngọc", en: "Pearl Blossom Clip" },
    desc: {
      vi: "Bông hoa năm cánh khảm xà cừ, nhụy ngọc trai, nhỏ xinh dễ phối đồ.",
      en: "A five-petal mother-of-pearl flower with a pearl centre, small and easy to wear.",
    },
  },
  {
    id: "kep-buom", cat: "kep", tier: "pho_thong", price: 60000,
    img: "img/products/kep-05.jpg",
    name: { vi: "Kẹp Bướm Ngà", en: "Ivory Butterfly Clip" },
    desc: {
      vi: "Cánh bướm khảm xà cừ trắng ngà, viền kim loại vàng nhạt.",
      en: "Butterfly wings in ivory mother-of-pearl with a light gold frame.",
    },
  },
  {
    id: "kep-cang-cua", cat: "kep", tier: "pho_thong", price: 70000,
    img: "img/products/kep-06.jpg",
    name: { vi: "Kẹp càng cua Ánh Ngà", en: "Ivory Shimmer Claw Clip" },
    desc: {
      vi: "Kẹp càng cua dáng chữ nhật tối giản, bề mặt xà cừ óng ánh, giữ tóc chắc.",
      en: "A minimal rectangular claw clip with a shimmering mother-of-pearl surface and a firm hold.",
    },
  },
];
