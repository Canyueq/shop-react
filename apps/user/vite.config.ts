import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      // 匹配以 /api 开头的请求
      "/user": {
        target: "http://localhost:8080", // 后端接口地址
        changeOrigin: true, // 开启跨域
        rewrite: (path) => path.replace(/^\/api/, ""), // 去掉 /api 前缀（后端接口无 /api 时需要）
      },
    },
  },
});
