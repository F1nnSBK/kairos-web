<template>
  <div class="min-h-screen relative bg-obsidian text-on-surface">
    <div class="fixed inset-0 pointer-events-none scanline z-50"></div>

    <main v-if="user" class="pt-24 pb-32 px-6 max-w-7xl mx-auto relative z-10">
      <header
        class="mb-16 border-l-8 border-rose-muted pl-8 py-4 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 text-rose-muted mb-2 font-black uppercase tracking-[0.4em] text-xs">
            <span class="material-symbols-outlined animate-pulse">sensors</span>
            Neural_Stream_Ready
          </div>
          <h1 class="text-6xl md:text-8xl font-black uppercase leading-[0.85]">
            Intelligence<br /><span class="text-rose-muted">Feed</span>
          </h1>
        </div>

        <div class="bg-surface border-4 border-white p-4 shadow-hard-white min-w-[280px]">
          <p class="text-[10px] font-bold text-outline uppercase mb-1">Operator_Identity</p>
          <p class="text-[11px] font-mono text-white truncate mb-4">{{ user.email }}</p>
          <div class="flex justify-between items-center pt-3 border-t border-outline">
            <button @click="logout"
              class="text-[10px] font-black text-rose-muted hover:text-white uppercase transition-colors underline underline-offset-4">
              Terminate_Session
            </button>
            <button @click="loadRecommendations"
              class="material-symbols-outlined text-white hover:rotate-180 transition-transform">refresh</button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="md:col-span-8 space-y-8">
          <div v-if="loading" class="text-rose-muted font-mono animate-pulse uppercase tracking-widest">
            > FETCHING_VECTORS...
          </div>

          <ArticleCard v-for="article in recommendations" :key="article.id" :article="article"
            @interact="handleInteraction" />
        </div>

        <aside class="md:col-span-4">
          <div class="sticky top-24 bg-rose-muted border-4 border-black p-6 shadow-hard-obsidian text-obsidian">
            <h3 class="text-sm font-black mb-4 tracking-widest uppercase">Engine_Status</h3>
            <div class="text-[10px] font-bold space-y-2 uppercase leading-tight">
              <p>Algorithm: SovereignLinUCB</p>
              <p>Confidence: $\mu + \alpha \sigma$</p>
              <p>Node_ID: {{ user.id.slice(0, 12) }}...</p>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-rose-muted font-mono animate-pulse uppercase tracking-[0.4em]">
        > ESTABLISHING_SECURE_LINK...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ layout: false })

const supabase = useSupabase()
const user = ref<any>(null)
const recommendations = ref<any[]>([])
const loading = ref(false)

const loadRecommendations = async () => {
  if (!user.value?.id) return
  loading.value = true
  try {
    const data = await $fetch<{ recommendations: any[] }>('/api/recommend', {
      query: { user_id: user.value.id }
    })
    recommendations.value = data?.recommendations || []
  } finally {
    loading.value = false
  }
}

const handleInteraction = async (articleId: string) => {
  if (!user.value?.id) return
  await $fetch('/api/click', {
    method: 'POST',
    body: { user_id: user.value.id, article_id: articleId }
  })
  loadRecommendations()
}

const logout = async () => {
  await supabase.auth.signOut()
  user.value = null
  navigateTo('/login')
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    navigateTo('/login')
    return
  }
  user.value = session.user
  loadRecommendations()
})
</script>