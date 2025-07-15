import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Загружаем env-переменные для текущего режима (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Если нужно явно определить переменные
    define: {
      'process.env.VITE_RHINO_API_KEY': JSON.stringify(env.VITE_RHINO_API_KEY)
    }
  };
});
