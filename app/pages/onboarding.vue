<script setup lang="ts">
// --- Data ---
const CATEGORIES = {
  "Global Markets": ["Wirtschaft", "Börse", "Finanzen", "DAX", "Rezession", "Zinsen"],
  "Frontier Tech": ["KI", "Technologie", "Innovation", "Informatik", "Halbleiter", "OpenAI"],
  "Geopolitics": ["Geopolitik", "Sicherheitspolitik", "NATO", "UN", "Diplomatie"],
  "Life Sciences": ["Biotechnologie", "Pharma", "Medizin", "Forschung", "Genetik"],
  "Space & Defense": ["Raumfahrt", "Weltraum", "Verteidigung", "Bundeswehr", "Rüstung", "SpaceX"],
  "Sustainability": ["Klimawandel", "Energie", "Nachhaltigkeit", "Solar", "Wasserstoff"],
  "Digital Society": ["Digitalisierung", "Cybersecurity", "Netzpolitik", "Datenschutz"],
  "Infrastructure": ["Mobilität", "Logistik", "Industrie", "Bahn", "Automobil"]
}

// --- State ---
const client = useSupabase() // Dein eigenes Composable
const user = ref<any>(null)
const loading = ref(false)
const selectedTags = ref<string[]>([])

// --- Actions ---
const toggleTag = (category: string) => {
  if (selectedTags.value.includes(category)) {
    selectedTags.value = selectedTags.value.filter(t => t !== category)
  } else {
    selectedTags.value.push(category)
  }
}

const submitOnboarding = async () => {
  // Check, ob wir eine ID haben
  const currentUserId = user.value?.id
  const onboardingState = useState<boolean | null>('onboarding_status');
  if (!currentUserId || loading.value) return

  loading.value = true

  try {
    const { error } = await client
      .from('profiles')
      .update({
        onboarded: true,
        categories: selectedTags.value,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentUserId)

    if (!error) {
      // Hard Redirect, damit die Middleware auf jeden Fall neu triggert
      onboardingState.value = true;
      return navigateTo('/');
    } else {
      console.error("Supabase Update Error:", error)
    }
  } catch (err) {
    console.error("Alignment Failed:", err)
  } finally {
    loading.value = false
  }
}

// --- Lifecycle ---
onMounted(async () => {
  // Wir holen uns den User direkt über deinen Client
  const { data: { session } } = await client.auth.getSession()
  if (session) {
    user.value = session.user
  } else {
    // Falls keine Session da ist, ab zum Login
    navigateTo('/login')
  }
})
</script>

<template>
  <div
    class="min-h-screen bg-obsidian text-white font-sans selection:bg-rose-muted selection:text-obsidian flex items-center justify-center p-4 relative overflow-hidden">
    <div class="fixed inset-0 pointer-events-none scanline z-50"></div>

    <div v-if="user"
      class="max-w-3xl w-full bg-surface border-4 border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_#ffffff] relative z-10">
      <header class="mb-10">
        <div class="flex items-center gap-3 text-rose-muted mb-4 font-black uppercase tracking-[0.3em] text-xs">
          <span class="material-symbols-outlined text-sm animate-pulse">target</span>
          Neural_Alignment_Required
        </div>
        <h1 class="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter mb-4">
          Vector <span class="text-rose-muted">Priming</span>
        </h1>
        <p class="text-outline uppercase font-bold text-[10px] md:text-xs tracking-widest leading-relaxed">
          Wähle deine strategischen Cluster für das Initial_Vektor_Setup.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <button v-for="(keywords, category) in CATEGORIES" :key="category" @click="toggleTag(category)" :class="[
          'group relative p-4 border-2 text-left transition-all duration-200',
          selectedTags.includes(category)
            ? 'bg-rose-muted border-white text-obsidian translate-x-1 translate-y-1 shadow-none'
            : 'bg-obsidian border-outline/30 text-white hover:border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]'
        ]">
          <div class="flex justify-between items-start mb-2">
            <span class="font-black uppercase text-xs tracking-tighter">{{ category }}</span>
            <span v-if="selectedTags.includes(category)" class="material-symbols-outlined text-sm">check_circle</span>
          </div>
          <div class="text-[9px] font-mono opacity-40 uppercase leading-tight line-clamp-1">
            {{ keywords.join(" // ") }}
          </div>
        </button>
      </div>

      <footer class="flex flex-col md:flex-row items-center gap-6 border-t border-outline/20 pt-8">
        <button @click="submitOnboarding" :disabled="selectedTags.length === 0 || loading"
          class="w-full md:w-auto bg-white text-obsidian px-10 py-4 font-black uppercase tracking-widest hover:bg-rose-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all active:translate-y-1">
          {{ loading ? 'Synchronizing...' : 'Initialize_Neural_Link' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Styles wie gehabt */
.bg-surface {
  background-color: #0a0a0a;
}

.text-outline {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
  color: transparent;
}

.border-outline {
  border-color: rgba(255, 255, 255, 0.3);
}

.scanline {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0) 100%);
  background-size: 100% 4px;
}
</style>