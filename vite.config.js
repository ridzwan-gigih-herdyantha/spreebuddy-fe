/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import seoPlugin, { resolveSiteUrl } from "./seo.plugin.js";

const ENV_PREFIX = ["VITE_", "ENABLE_"];
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX);
  const isStorybook = Boolean(process.env.STORYBOOK);
  const siteUrl =
    resolveSiteUrl(env) ??
    (command === "serve" || isStorybook ? "http://localhost:5173" : null);

  // A build without a site URL would ship "%VITE_SITE_URL%" into every share
  // tag and canonical link, which is exactly what production was serving.
  if (!siteUrl) {
    throw new Error(
      "Set VITE_SITE_URL (e.g. https://spreebuddy.ridzwangigih.com) before building.",
    );
  }

  // Values already in process.env outrank .env files, so this one resolved URL
  // is what both index.html and import.meta.env receive.
  process.env.VITE_SITE_URL = siteUrl;

  return {
    plugins: [react(), svgr(), ...(isStorybook ? [] : [seoPlugin()])],
    envPrefix: ENV_PREFIX,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            environment: "node",
            include: ["tests/**/*.test.{js,jsx}"],
            restoreMocks: true,
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, ".storybook"),
            }),
          ],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  };
});
