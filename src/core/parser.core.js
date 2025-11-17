import { EVENTS } from "../constants";

export class Parser {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.listen();
  }

  listen() {
    this.eventBus.on(EVENTS.ACTION.GET_HTML, this.htmlToJson.bind(this));
  }

  htmlToJson(html) {
    const domParser = new DOMParser();
    const root = domParser.parseFromString(html, "text/html");
    const json = this.dfs(root.body);
    console.log(JSON.parse(JSON.stringify(json)));
  }

  dfs(root) {
    const result = [];
    const childNodes = root.childNodes;

    for (const childNode of childNodes) {
      switch (childNode.nodeType) {
        case 1: {
          const tag = childNode.tagName.toLowerCase();
          if (tag === "p" || tag === "div") {
            result.push({
              type: "paragraph",
              children: this.dfs(childNode),
            });
          } else if (tag.startsWith("h")) {
            result.push({
              type: "heading",
              children: this.dfs(childNode),
            });
          } else if (tag === "b" || tag === "strong") {
            const children = this.dfs(childNode);
            children.forEach((child) => {
              child.bold = true;
            });
            result.push(...children);
          } else if (tag === "i" || tag === "em") {
            const children = this.dfs(childNode);
            children.forEach((child) => {
              child.italic = true;
            });
            result.push(...children);
          } else {
            result.push(...this.dfs(childNode));
          }
          break;
        }

        case 3: {
          const text = childNode.textContent?.trim();
          if (text) {
            result.push({ text });
          }
          break;
        }

        default:
          break;
      }
    }

    return result;
  }
}

/*
[
  {
    "type": "paragraph",
    "children": [
      { "text": "Hello " },
      { "text": "Thịnh", "bold": true }
    ]
  },
  {
    "type": "heading",
    "level": 1,
    "children": [
      { "text": "Tiêu đề" }
    ]
  }
]
*/
