# Website Khảm

Web tĩnh (HTML, CSS, JavaScript thuần), không cần cài đặt. Giỏ hàng, thiết kế đã lưu và đơn hàng được lưu trong trình duyệt (localStorage).

## Các trang
| Trang | File |
|---|---|
| Trang chủ | `index.html` |
| Cửa hàng | `cua-hang.html` (thêm `?cat=kep` để lọc, `?item=<id>` để mở sẵn sản phẩm) |
| Studio thiết kế | `studio.html` (thêm `?product=&base=&motif=&nacre=` để mở sẵn một thiết kế) |
| Câu chuyện | `cau-chuyen.html` |
| Giỏ hàng và đặt hàng | `gio-hang.html` |

## Sửa nhanh
| Muốn sửa | Mở file |
|---|---|
| Instagram, Zalo, email, phí giao hàng | `js/data.js` → `SITE` |
| Sản phẩm, giá, mô tả, chất liệu | `js/data.js` → `PRODUCTS` |
| Lựa chọn và giá trong Studio | `js/data.js` → `STUDIO` |
| Hình dáng sản phẩm, cách vẽ họa tiết | `js/renderer.js` |
| Header, footer | `js/layout.js` |
| Màu, font | `css/style.css` → `:root` |

Quy tắc thiết kế xem ở `../DESIGN-SYSTEM.md`.

## Xem thử trên máy
```
npx http-server website -p 5500
```
