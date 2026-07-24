<template>
  <div
    class="min-h-screen relative bg-obsidian text-on-surface overflow-x-hidden font-sans selection:bg-rose-muted selection:text-obsidian">
    <div class="fixed inset-0 pointer-events-none scanline z-50"></div>

    <main v-if="user" class="pt-12 md:pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10">

      <header
        class="mb-12 md:mb-16 border-l-4 md:border-l-8 border-rose-muted pl-4 md:pl-8 py-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div class="w-full">
          <div
            class="flex items-center gap-3 text-rose-muted mb-3 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
            <span class="material-symbols-outlined text-sm animate-pulse">sensors</span>
            Neural_Stream_Ready
          </div>
          <h1 class="text-5xl sm:text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter">
            Intelligence<br /><span class="text-rose-muted">Feed</span>
          </h1>
        </div>

        <div class="bg-surface border-4 border-white p-4 shadow-hard-white w-full md:min-w-[320px] md:w-auto">
          <p class="text-[9px] font-bold text-outline uppercase mb-1">Operator_Identity</p>
          <p class="text-[11px] font-mono text-white truncate mb-4 select-all">{{ user.email }}</p>
          <div class="flex justify-between items-center pt-3 border-t border-outline/30">
            <button @click="navigateTo('/user/' + user.id)"
              class="text-[10px] font-black text-rose-muted hover:text-white uppercase transition-colors underline underline-offset-4 decoration-2">
              View_Profile
            </button>
            <button @click="logout"
              class="text-[10px] font-black text-rose-muted hover:text-white uppercase transition-colors underline underline-offset-4 decoration-2">
              Terminate_Session
            </button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

        <div class="md:col-span-8 order-2 md:order-1">
          <div v-if="loading" class="mb-8 text-rose-muted font-mono animate-pulse uppercase tracking-[0.2em] text-xs">
            > INITIALIZING_VECTORS...
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ArticleCard v-for="article in recommendations" :key="article.id" :article="article"
              @interact="handleInteraction" />
          </div>

          <div v-if="!loading && recommendations.length === 0"
            class="p-12 border-4 border-dashed border-outline/30 text-center text-outline uppercase font-black text-xs tracking-widest">
            End_Of_Stream // No_Data_Found
          </div>
        </div>

        <aside class="md:col-span-4 order-1 md:order-2">
          <div class="md:sticky md:top-24 space-y-6">
            <div class="bg-rose-muted border-4 border-black p-6 shadow-hard-obsidian text-obsidian">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-black tracking-widest uppercase">Engine_Status</h3>
                <div class="w-2 h-2 bg-obsidian rounded-full animate-ping"></div>
              </div>
              <div class="text-[10px] font-bold space-y-3 leading-tight font-mono">
                <div class="flex justify-between border-b border-obsidian/10 pb-1">
                  <span>Algorithm:</span>
                  <span class="bg-obsidian text-rose-muted px-1">LinUCB</span>
                </div>
                <div class="flex justify-between">
                  <span>Node_ID:</span>
                  <span>{{ nodeId }}</span>
                </div>
              
              </div>
            </div>

            <div
              class="hidden md:block p-4 border-2 border-outline/20 text-[9px] uppercase font-bold tracking-widest">
              <a href="https://github.com/F1nnSBK/Project-Kairos" target="_blank" rel="noopener noreferrer" class="text-outline hover:text-rose-muted transition-colors flex items-center justify-between">
                <span>GitHub // Project_Kairos</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <div v-else class="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div class="w-12 h-12 border-4 border-rose-muted border-t-transparent animate-spin mb-6"></div>
      <div class="text-rose-muted font-mono animate-pulse uppercase tracking-[0.4em] text-xs">
        > ESTABLISHING_SECURE_LINK...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


definePageMeta({ layout: false })

// --- State ---
const client = useSupabase()
const user = ref<any>(null)
const recommendations = ref<any[]>([])
const loading = ref(false)

// --- Computed ---
const nodeId = computed(() => user.value?.id ? user.value.id.slice(0, 12).toUpperCase() : 'UNKNOWN')

// --- Actions ---
const loadRecommendations = async (silent = false) => {
  if (!user.value?.id) return
  if (!silent) loading.value = true

  try {
    const data = await $fetch<{ recommendations: any[] }>('/api/recommend', {
      query: { user_id: user.value.id }
    })

    const newRecs = data?.recommendations || []

    if (silent) {
      const existingIds = new Set(recommendations.value.map(a => a.id))
      const uniqueNew = newRecs.filter(a => !existingIds.has(a.id))
      recommendations.value = [...recommendations.value, ...uniqueNew]
    } else {
      recommendations.value = newRecs
    }
  } catch (err) {
    console.error("Vector Fetch Error:", err)
  } finally {
    loading.value = false
  }
}

const handleInteraction = async (articleId: string, action: string = 'click') => {
  if (!user.value?.id) return

  if (action === 'dismiss') {
    recommendations.value = recommendations.value.filter(a => a.id !== articleId)
  }

  try {
    await $fetch('/api/click', {
      method: 'POST',
      body: {
        user_id: user.value.id,
        article_id: articleId,
        action: action
      }
    })

    if (action === 'click') {
      await loadRecommendations()
    } else if (action === 'dismiss') {
      if (recommendations.value.length <= 3) {
        console.log("!!! REFILL_TRIGGERED // Low_Vector_Count")
        await loadRecommendations(true)
      }
    }
  } catch (err) {
    console.error("Signal propagation failed:", err)
  }
}

const logout = async () => {
  await client.auth.signOut()
  user.value = null
  navigateTo('/login')
}

// --- Lifecycle ---
onMounted(async () => {
  const { data: { session } } = await client.auth.getSession()

  if (!session) {
    navigateTo('/login')
    return
  }

  user.value = session.user
  await loadRecommendations()
})
</script>

<style>
.scanline {
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.03) 50%,
      rgba(255, 255, 255, 0) 100%);
  background-size: 100% 4px;
}

.text-outline {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
  color: transparent;
}
</style>