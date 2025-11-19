import { ERROR_DOMAIN, EVENTS } from "../constants/index.js";
import Viewer from "viewerjs";
import { formatError } from "../utils/index.js";
export class ImageUploader {
  constructor(container, eventBus) {
    this.container = container; // phần DOM chính của editor
    this.eventBus = eventBus;
    this.images = []; // danh sách base64
    this.previewCtn = null;
    this.viewer = null;
    this.init();
  }

  init() {
    this.createUploadInput();
    this.createPreviewContainer();
    this.viewer = new Viewer(this.previewCtn);
  }

  createUploadInput() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.style.display = "none";

    input.addEventListener("change", (e) => this.handleFiles(e.target.files));
    document.body.appendChild(input);

    this.eventBus.on(EVENTS.ACTION.UPLOAD_IMAGE, () => input.click());
  }

  createPreviewContainer() {
    this.previewCtn = document.createElement("div");
    this.previewCtn.classList.add("image-preview-container");
    Object.assign(this.previewCtn.style, {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      borderTop: "0px",
    });
    this.container.appendChild(this.previewCtn);
  }

  async handleFiles(files) {
    try {
      for (let file of files) {
        const base64 = await this.toBase64(file);
        this.images.push(base64);
      }
      this.renderPreview();
      this.eventBus.emit(EVENTS.IMAGE.UPLOADED, this.images);
    } catch (error) {
      formatError(ERROR_DOMAIN.UPLOAD, "uploaded error");
    }
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  renderPreview() {
    this.previewCtn.innerHTML = "";
    this.images.forEach((imgSrc, index) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      const img = document.createElement("img");
      img.src = imgSrc;
      Object.assign(img.style, {
        width: "80px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "8px",
        border: "1px solid #ddd",
        cursor: "pointer",
      });

      img.addEventListener("click", () => {
        if (this.viewer) {
          this.viewer.show(img);
        }
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "✕";
      Object.assign(removeBtn.style, {
        position: "absolute",
        top: "2px",
        right: "2px",
        border: "none",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        cursor: "pointer",
      });

      removeBtn.addEventListener("click", () => {
        this.images.splice(index, 1);
        this.renderPreview();
        this.eventBus.emit(EVENTS.IMAGE.REMOVED, this.images);
        this.viewer.update();
      });

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      this.previewCtn.appendChild(wrapper);
    });

    this.togglePreviewStyle(this.images.length > 0);
    this.viewer.update();
  }

  togglePreviewStyle(active) {
    Object.assign(
      this.previewCtn.style,
      active
        ? {
            padding: "8px",
            border: "1px solid #aaa",
            borderTop: "0px",
          }
        : {
            padding: "0",
            border: "none",
          }
    );
  }

  destroy() {
    this.previewCtn?.remove();
    this.images = [];
  }
}
