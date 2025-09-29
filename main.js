/*
    Làm sao mà từ const editor = new Editor(element, config)
    => element: phần tử DOM mà editor sẽ mount vào
    => config: object config các tính năng của editor

    => editor: đối tượng editor đã được khởi tạo và có thể sử dụng các phương thức của nó
    Khi gọi new Editor(element, config) thì trình biên dịch sẽ thực hiện các bước sau:
    1. Tạo một đối tượng mới từ lớp Editor
    2. Gọi hàm khởi tạo (constructor) của lớp Editor với tham số element và config
    3. Trong hàm khởi tạo, thực hiện các bước sau:
        a. Gán element và config vào các thuộc tính của đối tượng editor
        b. Khởi tạo các thành phần cần thiết cho editor (như toolbar, content area, ...)
        c. Thiết lập các sự kiện và hành vi dựa trên config
    4. Trả về đối tượng editor đã được khởi tạo và vẽ ra giao diện trên element
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$$("#toolbar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    document.execCommand(cmd, false, null);
  });
});

$("#editor").addEventListener("input", () => {
  console.log(document.getElementById("editor").innerHTML);
});
