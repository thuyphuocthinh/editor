const listToolbar = [
  { id: "boldBtn", title: "Emphasize text", label: "B", dataCmd: "bold" },
  { id: "italicBtn", title: "Italicize text", label: "I", dataCmd: "italic" },
  {
    id: "underlineBtn",
    title: "Underline text",
    label: "U",
    dataCmd: "underline",
  },
  { id: "linkBtn", title: "Insert link", label: "Link", dataCmd: "link" },
  {
    id: "previewBtn",
    title: "Preview content",
    label: "Preview",
    dataCmd: "preview",
  },
  { id: "clearBtn", title: "Clear content", label: "Clear", dataCmd: "clear" },
  { id: "resetBtn", title: "Reset content", label: "Reset", dataCmd: "reset" },
];

export function toolbarUi() {
  return `
        ${listToolbar
          .map(
            (btn) =>
              `<button id="${btn.id}" title="${btn.title}" data-cmd=${btn.dataCmd}>${btn.label}</button>`
          )
          .join("")}
      `;
}
