import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import * as path from "path";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const MODE = process.env.NODE_ENV || "production";
  const PATH = MODE === "development" ? "/" : "/todo-list/";

  dotenv.config({
    path: path.join(path.resolve(), ".env"),
  });
  dotenv.config({
    path: path.join(path.resolve(), `.env.${MODE}`),
  });

  const HOST = process.env.HOST || "0.0.0.0";
  const PORT = +(process.env.PORT || 5000);
  const BRAND = process.env.BRAND || "TASKY";
  const VERSION = pkg.version;

  const env = loadEnv(mode, process.cwd(), "");

  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      "process.env": {
        MODE,
        HOST,
        PORT,
        BRAND,
        VERSION,
        PATH,
      },
    },
    server: {
      host: HOST,
      port: PORT,
    },
    base: PATH,
    plugins: [react(), tsconfigPaths()],
  };
});
