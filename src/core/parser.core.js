import { EVENTS } from "../constants/index.js";

export class Parser {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.listen();
  }

  listen() {
    this.eventBus.on(EVENTS.ACTION.GET_HTML, this.htmlToJson.bind(this));
  }

  wrapIfInlineOnly(nodes) {
    const hasBlock = nodes.some((n) => n.type && n.type !== undefined);

    if (!hasBlock) {
      return [
        {
          type: "paragraph",
          children: nodes,
        },
      ];
    }

    return nodes;
  }

  htmlToJson(html) {
    const domParser = new DOMParser();
    const root = domParser.parseFromString(html, "text/html");
    let json = this.dfs(root.body);
    json = this.wrapIfInlineOnly(json);
  }

  dfs(root) {
    const result = [];

    for (const node of root.childNodes) {
      const type = node.nodeType;

      // ===== TEXT NODE =====
      if (type === Node.TEXT_NODE) {
        const raw = node.textContent;
        if (raw && raw.trim() !== "") {
          result.push({ text: raw });
        }
        continue;
      }

      // ===== ELEMENT NODE =====
      if (type === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();

        // --- Paragraph-like tags ---
        if (tag === "p" || tag === "div") {
          result.push({
            type: "paragraph",
            children: this.dfs(node),
          });
          continue;
        }

        if (tag === "span") {
          const style = node.getAttribute("style") || "";
          if (style) {
            const styles = style.split(";").map((s) => s.trim());
            const children = this.dfs(node);
            children.forEach((c) => {
              styles.forEach((s) => {
                if (s === "font-weight: bold") c.bold = true;
                if (s === "font-style: italic") c.italic = true;
                if (s === "text-decoration: underline") c.underline = true;
              });
            });
            result.push(...children);
            continue;
          }
        }

        // --- Lists ---
        if (tag === "ul" || tag === "ol") {
          const listType = tag === "ul" ? "bulleted-list" : "numbered-list";
          const items = [];

          for (const li of node.children) {
            if (li.tagName.toLowerCase() === "li") {
              items.push({
                type: "list-item",
                children: this.dfs(li),
              });
            }
          }

          result.push({ type: listType, children: items });
          continue;
        }

        // --- Heading h1-h6 ---
        if (/^h[1-6]$/.test(tag)) {
          result.push({
            type: "heading",
            level: Number(tag[1]),
            children: this.dfs(node),
          });
          continue;
        }

        // --- Inline Formatting (bold / italic / underline) ---
        if (["b", "strong", "i", "em", "u"].includes(tag)) {
          const children = this.dfs(node);

          children.forEach((c) => {
            if (["b", "strong"].includes(tag)) c.bold = true;
            if (["i", "em"].includes(tag)) c.italic = true;
            if (tag === "u") c.underline = true;
          });

          result.push(...children);
          continue;
        }

        // --- <br> newline ---
        if (tag === "br") {
          result.push({ text: "\n" });
          continue;
        }

        // --- <a> hyperlink ---
        if (tag === "a") {
          const href = node.getAttribute("href") || "";
          const children = this.dfs(node);

          children.forEach((c) => {
            c.link = href;
            c.type = "link";
          });

          result.push(...children);
          continue;
        }

        // --- <img> image ---
        if (tag === "img") {
          const src = node.getAttribute("src") || "";
          result.push({
            type: "image",
            url: src,
            children: [{ text: "" }],
          });
          continue;
        }

        // --- <blockquote> ---
        if (tag === "blockquote") {
          result.push({
            type: "block-quote",
            children: this.dfs(node),
          });
          continue;
        }

        // --- <pre> code block ---
        if (tag === "pre") {
          result.push({
            type: "code-block",
            children: [{ text: node.textContent || "" }],
          });
          continue;
        }

        // Default: unwrap children
        result.push(...this.dfs(node));
      }
    }

    return result;
  }
}

/*
<div>
Thủy<b> Phước Thịnh</b>
</div>
*/
