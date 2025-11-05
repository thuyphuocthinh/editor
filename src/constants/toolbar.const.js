export const TOOLBARS = {
  FORMAT: {
    type: "format",
    level: 2,
    BOLD: {
      type: "button",
      label: "B",
      dataCmd: "bold",
      elementName: "b",
    },
    ITALIC: {
      type: "button",
      label: "I",
      dataCmd: "italic",
      elementName: "i",
    },
    UNDERLINE: {
      type: "button",
      label: "U",
      dataCmd: "underline",
      elementName: "u",
    },
    LINK: {
      type: "button",
      label: "Link",
      dataCmd: "link",
      elementName: "a",
    },
  },

  ACTIONS: {
    type: "action",
    level: 2,
    PREVIEW: {
      type: "button",
      label: "Preview",
      dataCmd: "preview",
    },
    CLEAR: {
      type: "button",
      label: "Clear",
      dataCmd: "clear",
    },
    RESET: {
      type: "button",
      label: "Reset",
      dataCmd: "reset",
    },
    UNDO: {
      type: "button",
      label: "Undo",
      dataCmd: "undo",
    },
    REDO: {
      type: "button",
      label: "Redo",
      dataCmd: "redo",
    },
  },

  HEADING: {
    level: 1,
    type: "select",
    id: "heading",
    name: "Heading",
    options: [
      {
        label: "Choose heading",
        value: "",
        dataCmd: "",
        disabled: true,
      },
      {
        label: "H1",
        value: "h1",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "h1",
      },
      {
        label: "H2",
        value: "h2",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "h2",
      },
      {
        label: "H3",
        value: "h3",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "h3",
      },
      {
        label: "H4",
        value: "h4",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "h4",
      },
      {
        label: "H5",
        value: "h5",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "h5",
      },
      {
        label: "H6",
        value: "h6",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "h6",
      },
    ],
  },

  LIST: {
    level: 1,
    type: "select",
    id: "list",
    name: "List",
    options: [
      { label: "Choose list", value: "", dataCmd: "", disabled: true },
      {
        label: "Ordered List",
        value: "ol",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "ol",
      },
      {
        label: "Unordered List",
        value: "ul",
        dataCmd: "formatBlock",
        disabled: false,
        elementName: "ul",
      },
    ],
  },
};
