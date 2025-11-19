import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // thư mục gốc chứa index.html
  build: {
    outDir: "dist", // thư mục build ra
    rollupOptions: {
      input: "./index.html", // file HTML chính
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
