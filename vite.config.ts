import legacyPlugin from "@vitejs/plugin-legacy"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 向下相容
    legacyPlugin({
      targets: ["ie 11", "safari 10"],
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "/@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
})
