# ✨ Mini Editor

Mini Editor là một ứng dụng web cho phép chỉnh sửa nội dung phong phú (rich-text) với nhiều tính năng mạnh mẽ như quản lý ảnh, chuyển đổi HTML ↔ JSON, xem trước nội dung,… Phù hợp cho các hệ thống CMS hoặc công cụ tạo nội dung dạng page builder.

---

## Tính năng nổi bật

### Chỉnh sửa văn bản trực quan (Rich Text Editor)
- Cho phép nhập và chỉnh sửa nội dung HTML trực tiếp.
- Hỗ trợ bôi đậm, in nghiêng, gạch chân, căn trái/phải/giữa.
- Đồng bộ nội dung giữa editor và JSON.

### Chuyển đổi nội dung giữa HTML ↔ JSON
- Tự động phân tích innerHTML thành JSON có cấu trúc.
- Export JSON ra file `.json`.
- Import JSON để dựng lại toàn bộ nội dung editor.
- Hỗ trợ map block theo từng thẻ HTML.

### Upload & quản lý hình ảnh
- Cho phép kéo–thả hoặc chọn file để upload.
- Hiển thị ảnh trong editor.
- Lưu metadata của ảnh vào JSON.

### Xem ảnh toàn màn hình (ViewerJS)
- Click vào ảnh để mở chế độ xem full-screen.
- Zoom, lật ảnh, slideshow.
- Tương thích mobile & desktop.

### 5. Xuất / Nhập nội dung
- Export nội dung dưới dạng JSON.
- Hữu ích cho backup hoặc chia sẻ template.

### Clean DOM & chuẩn hóa
- Loại bỏ thẻ dư thừa, line-break không cần thiết.
- Chuẩn hóa HTML trước khi chuyển sang JSON.
- Tách rõ block, text, image, container.

### Chọn & thao tác phần tử trực tiếp
- Click để chọn từng block.
- Highlight khi hover hoặc khi được chọn.
- Dùng để debug nhanh cấu trúc.

### Xem trước nội dung (Preview)
- Render nội dung giống như giao diện thực tế.
- Cập nhật ngay sau mỗi lần chỉnh sửa.

### Tùy chỉnh component & mở rộng
- Thêm block mới dễ dàng: video, button, slider,...
- Code theo kiểu module: Editor → Parser → Renderer → Storage → UI.
- Dễ maintain và mở rộng cho CMS lớn.

---

## Công nghệ sử dụng
- HTML5, CSS3, JavaScript
- ViewerJS
- FileReader API
- Kiến trúc hướng module

---

## Hướng dẫn chạy
```bash
npm install
npm run dev
