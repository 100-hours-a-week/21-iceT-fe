import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const isQA = env.VITE_IS_QA === 'qa';

  return {
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    base: isQA ? '/admin-preview/' : '/',
  };
});
