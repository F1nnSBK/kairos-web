import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // 1. Nuxt 4 / App-Dir Mode aktivieren
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // 2. CSS Pfad (Nutze Alias ~, da Nuxt 4 das app-Verzeichnis versteht)
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    // 3. Fix: Verhindert die "Vite discovered new dependencies" Reloads
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
  },

  modules: [],


  runtimeConfig: {
  public: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
  kairosEngineUrl: process.env.KAIROS_ENGINE_URL || 'http://localhost:8080',
}
});
