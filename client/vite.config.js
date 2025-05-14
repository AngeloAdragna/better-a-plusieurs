import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Permet de gérer le routage côté client
    host: true, // ou '0.0.0.0' pour toutes les interfaces
    port: 5173, // (ou un autre port)
    allowedHosts: ['srvetd-webgrp05.univ-avignon.fr']
  },
});