import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    // See https://dev.to/ysmnikhil/how-to-build-with-react-or-vue-with-vite-and-docker-1a3l, Step 2: Update Vite Config
    host: true,
    port: 5175,
    // next property is only for HMR in Windows
    // watch: {
    //   usePolling: true,
    // },
    proxy: {
      '/test': 'http://localhost:3000',
    },
  },
});
