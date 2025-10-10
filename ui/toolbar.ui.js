const listToolbar = [
  { id: "boldBtn", title: "Emphasize text", label: "B" },
  { id: "italicBtn", title: "Italicize text", label: "I" },
  { id: "underlineBtn", title: "Underline text", label: "U" },
  { id: "linkBtn", title: "Insert link", label: "Link" },
  { id: "previewBtn", title: "Preview content", label: "Preview" },
  { id: "clearBtn", title: "Clear content", label: "Clear" },
  { id: "resetBtn", title: "Reset content", label: "Reset" },
];

export function toolbarUi() {
  return `
        ${listToolbar
          .map(
            (btn) =>
              `<button id="${btn.id}" title="${btn.title}">${btn.label}</button>`
          )
          .join("")}
      `;
}
