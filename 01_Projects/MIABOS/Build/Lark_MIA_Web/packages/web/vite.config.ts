import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_DEV_API_TARGET || "http://localhost:3000";

  // Tunneling (ngrok / cloudflared) cho phép Lark Desktop reach localhost.
  // Vite block unknown hosts mặc định — whitelist các tunnel TLDs + extras từ env.
  const extraHosts = (env.VITE_DEV_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedHosts = [
    "localhost",
    "127.0.0.1",
    ".ngrok-free.dev",
    ".ngrok-free.app",
    ".ngrok.io",
    ".trycloudflare.com",
    ".loca.lt",
    ...extraHosts,
  ];

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5180,
      strictPort: true,
      allowedHosts,
      // HMR sang ngrok cần dùng wss qua tunnel — nếu không dùng tunnel thì để default.
      hmr: env.VITE_DEV_TUNNEL_HOST
        ? {
            host: env.VITE_DEV_TUNNEL_HOST,
            protocol: "wss",
            clientPort: 443,
          }
        : undefined,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 5180,
      strictPort: true,
      allowedHosts,
    },
  };
});
