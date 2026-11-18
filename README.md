# Website Khảm Xà Cừ

Web tĩnh (HTML/CSS/JS), không cần cài đặt gì.

## Sửa nhanh
| Muốn sửa | Mở file |
|---|---|
| Tên thương hiệu, Instagram, Zalo, email, link Google Form | `js/data.js` → `SITE` |
| Thêm/sửa sản phẩm, giá, mô tả | `js/data.js` → `PRODUCTS` |
| Nội dung tiếng Việt | `index.html` |
| Nội dung tiếng Anh | `js/i18n.js` |
| Màu sắc, font | `css/style.css` → `:root` |

**Lưu ý:** tên thương hiệu còn xuất hiện trong thẻ `<title>` và `og:title` ở đầu `index.html`, nhớ sửa cả ở đó.

## Thay ảnh
Chép ảnh mới đè lên file **cùng tên** trong `img/products/` (`guong-01.jpg`, `luoc-01.jpg`, `kep-01.jpg`…).
Ảnh nên là JPG, cạnh dài tối đa khoảng 1200px, dung lượng dưới 300KB, khung dọc 4:5 là đẹp nhất.
Muốn thêm sản phẩm mới thì thêm ảnh rồi thêm một mục vào `PRODUCTS`.

## Xem thử trên máy
Mở `index.html` bằng trình duyệt, hoặc chạy:
```
npx http-server website -p 5500
```

## Đưa lên mạng (miễn phí)
1. Vào https://app.netlify.com/drop
2. Kéo thả cả thư mục `website` vào trang đó
3. Netlify cấp link dạng `xxx.netlify.app`. Có thể đổi tên link hoặc gắn tên miền riêng trong phần cài đặt.
