// vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    // 테스트 환경 설정
    environment: "jsdom", // DOM 관련 테스트를 위해 jsdom 사용
    globals: true, // 전역 변수를 사용할 수 있도록 설정
    // 추가적인 설정
    setupFiles: "./setupTests.ts", // 테스트 설정 파일 경로
    // exclude: ['**/*.spec.ts', 'node_modules'],

    include: ["src/**/*.test.tsx", "src/__tests__/**", "src/libs/**.spec.ts"],
    // ... Specify options here.
    reporters: ["default", "html"],
    coverage: {
      enabled: true,
    },
    benchmark: {
      reporters: "verbose",
      outputFile: "html",
    },
  },
  //@ts-ignore
  plugins: [tsconfigPaths()],
});
