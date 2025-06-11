import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/flowt/', // 👈 Add this line – must match your repo name
  plugins: [vue(), tailwindcss()],
})

