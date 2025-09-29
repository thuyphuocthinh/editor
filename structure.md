editor-project/
│── index.html            # file demo chạy editor
│── style.css             # css chính cho editor + toolbar
│── main.js               # entrypoint khởi tạo editor
│
├── core/                 # các thành phần lõi
│   ├── editor.js         # class Editor (quản lý init, events)
│   ├── selection.js      # helper cho Selection & Range
│   ├── commands.js       # định nghĩa các command (bold, italic…)
│   ├── history.js        # undo/redo stack
│   └── model.js          # data model (delta/json) - dùng ở tháng 3
│
├── modules/              # tính năng mở rộng (plugin-like)
│   ├── clipboard.js      # xử lý paste & sanitize
│   ├── image.js          # insert image
│   ├── codeblock.js      # insert code block
│   ├── highlight.js      # search highlight
│   └── counter.js        # word counter, autosave...
│
├── ui/                   # UI components
│   ├── toolbar.js        # render toolbar + event
│   ├── buttons.js        # định nghĩa button (bold, italic…)
│   └── modal.js          # popup insert link/image
│
├── utils/                # tiện ích nhỏ
│   ├── dom.js            # hàm thao tác DOM
│   ├── sanitize.js       # lọc html
│   └── events.js         # quản lý sự kiện keydown/keyup
│
└── assets/
    ├── css/              # style tách riêng nếu cần
    └── icons/            # icon toolbar (svg/png)
