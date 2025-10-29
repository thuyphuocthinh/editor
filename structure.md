/src
  /core
    Editor.js              # class trung tâm: quản lý document, selection, command
    DocumentModel.js       # model biểu diễn nội dung (mảng delta, text node, v.v.)
    Delta.js               # mô tả sự thay đổi của document (insert, delete, format)
    CommandManager.js      # hệ thống command (bold, italic, undo,...)
    SelectionManager.js    # quản lý vùng chọn
    UndoRedoStack.js       # stack cho undo/redo
  /view
    EditorView.js          # render DocumentModel -> DOM
    Toolbar.js             # thanh công cụ (tùy chọn)
  /plugins
    HistoryPlugin.js       # theo dõi các thay đổi, push vào undo/redo stack
    PasteSanitizer.js      # xử lý paste HTML -> sạch
  /utils
    dom.js                 # hàm thao tác DOM nhỏ
    sanitize.js            # xóa script, style,... trong HTML
    events.js              # event bus đơn giản
  index.js                 # entry point (export Editor)

/tests
  core.spec.js
  selection.spec.js

/dist
README.md
vite.config.js
package.json
