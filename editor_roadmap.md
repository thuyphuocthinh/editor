# TODO: Code mot editor nhu quill bang javascript vanilla

🗓️ Roadmap 3 tháng build Editor bằng JS thuần

📍 Tháng 1: Làm chủ contentEditable + Selection

## Tuần 1 - Tìm hiểu
contenteditable. - Tạo 1
```{=html}
<div contenteditable="true">
```
. - Làm toolbar với Bold, Italic, Underline bằng
document.execCommand(). - Xuất/nhập dữ liệu: innerHTML.

👉 Kết quả: Textarea rich text cơ bản.

## Tuần 2

-   Học window.getSelection() và Range.
-   Thay execCommand bằng thao tác DOM thật (Range.surroundContents).
-   Hiểu cách giữ/cập nhật cursor khi format text.
-   Làm thêm nút Highlight + Link.

👉 Kết quả: Bạn có custom format text bằng Range.
=> Custom lại Bold, Italic, Highlight, Link, giữ con trỏ, bôi đen thêm popup.

## Tuần 3

-   Làm Undo/Redo stack: lưu innerHTML sau mỗi thay đổi.
-   Thêm phím tắt (Ctrl+B/I/U).
-   Quản lý keydown/keyup để chặn/cho phép một số hành vi.

👉 Kết quả: Editor đã có Undo/Redo + hotkey.

## Tuần 4

-   Thêm block-level: Heading (h1/h2), List (ul/ol).
-   Xử lý Enter trong heading/lists → xuống dòng hợp lý.
-   Làm nút Clear Format.

👉 Kết quả: Editor xử lý được cả inline + block format.

📍 Tháng 2: Chỉnh chu, thêm tính năng thực tế

## Tuần 5 - Học xử lý sự kiện paste.
- Viết hàm sanitize: giữ lại b, i, u, a, img, bỏ span style rác.
- Cho phép copy/paste text từ Word/Google Docs.

👉 Kết quả: Editor paste sạch sẽ.

## Tuần 6

-   Thêm hỗ trợ Insert Image (dán link hoặc upload file).
-   Thêm Code Block (pre/code).
-   Học cách wrap block đặc biệt (blockquote, divider).

👉 Kết quả: Có embed cơ bản.

## Tuần 7

-   Làm highlight search (nhập từ khoá → highlight trong editor).
-   Làm nút Clear All → reset toàn bộ.
-   Tối ưu Undo/Redo (chỉ lưu diff thay vì full HTML).

👉 Kết quả: Editor nhẹ hơn, usable hơn.

## Tuần 8

-   Thêm theme CSS cho editor (light/dark mode).
-   Responsive: test trên mobile (contentEditable vẫn chạy).
-   Fix caret issue khi copy-paste nhiều dòng.

👉 Kết quả: Editor ổn định hơn, usable trên nhiều môi trường.

📍 Tháng 3: Lên tầm "mini-Quill" \## Tuần 9 - Thiết kế data model riêng
thay vì dùng HTML trực tiếp. - Ví dụ kiểu Quill Delta:

``` json
[
  { "insert": "Hello ", "attributes": { "bold": true } },
  { "insert": "world\n" }
]
```

👉 Kết quả: Editor có thể sync data chuẩn hơn.

## Tuần 10

-   Gắn Undo/Redo vào model (lưu operations).
-   Thêm API xuất ra JSON, nhập từ JSON → render.

👉 Kết quả: Editor có data format riêng, dễ dùng lại.

## Tuần 11 => refactor thành OOP + đóng gói thư viện

-   Viết plugin nhỏ: word counter, auto-save mỗi 5s.
-   Thêm plugin API để mở rộng (gắn toolbar custom).

👉 Kết quả: Editor có plugin system mini.

## Tuần 12

-   Làm Demo final:
    -   Rich text + heading + list + code block + image.\
    -   Undo/Redo + Paste clean.\
    -   Xuất/nhập JSON.\
-   Viết doc nhỏ giải thích kiến trúc.

👉 Kết quả: Bạn có **một editor mini (chưa bằng Quill nhưng usable)**,
và quan trọng nhất là bạn nắm hết: DOM API, Range, Undo/Redo, Data
model, Plugin architecture.
