<template>
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-obsidian">
    <div class="absolute inset-0 opacity-20 pointer-events-none scanline"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-rose-muted/5 blur-[120px] rounded-full"></div>

    <div class="z-10 w-full max-w-lg">
      <div class="mb-12 border-l-4 border-rose-muted pl-6 transition-all duration-500">
        <h1 class="text-5xl font-black text-white leading-none tracking-tighter uppercase">
          Kairos <span class="text-rose-muted">// {{ isRegister ? 'Identity' : 'Auth' }}</span>
        </h1>
        <p class="text-outline font-bold tracking-[0.3em] text-[10px] uppercase mt-2">
          {{ isRegister ? 'Register new node in neural network' : 'Initialize secure link to engine' }}
        </p>
      </div>

      <div class="bg-surface border-4 border-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        <form @submit.prevent="handleAuth" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-rose-muted uppercase tracking-widest">User_Email</label>
            <input v-model="email" type="email" required
              class="w-full bg-obsidian border-4 border-outline focus:border-rose-muted text-white px-4 py-3 font-mono outline-none transition-all placeholder:text-outline/30"
              placeholder="OPERATOR@SOVEREIGN.IO" />
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-black text-rose-muted uppercase tracking-widest">Access_Cipher</label>
            <input v-model="password" type="password" required
              class="w-full bg-obsidian border-4 border-outline focus:border-rose-muted text-white px-4 py-3 font-mono outline-none transition-all placeholder:text-outline/30"
              placeholder="••••••••" />
          </div>

          <div v-if="errorMsg"
            class="p-4 border-4 border-rose-muted bg-rose-muted/10 text-rose-muted text-[10px] font-black uppercase flex items-center gap-3">
            <span class="material-symbols-outlined text-sm">warning</span>
            {{ errorMsg }}
          </div>

          <div class="pt-4">
            <button type="submit" :disabled="loading" class="group relative w-full h-16 outline-none">
              <div class="absolute inset-0 bg-black translate-x-2 translate-y-2 border-4 border-white"></div>
              <div :class="[
                'absolute inset-0 border-4 border-white flex items-center justify-center gap-3 transition-all duration-75',
                'group-hover:-translate-x-1 group-hover:-translate-y-1',
                'group-active:translate-x-1 group-active:translate-y-1 group-active:shadow-none',
                loading ? 'bg-surface text-outline' : 'bg-rose-muted text-obsidian'
              ]">
                <span v-if="loading" class="material-symbols-outlined animate-spin font-black">sync</span>
                <span v-else-if="isRegister" class="material-symbols-outlined font-black">person_add</span>
                <span class="font-black uppercase tracking-widest text-sm">
                  {{ loading ? 'Loading...' : (isRegister ? 'Register' : 'Login') }}
                </span>
              </div>
            </button>
          </div>
        </form>

        <div class="mt-8 pt-6 border-t-4 border-outline flex flex-col items-center gap-4">
          <p class="text-[10px] text-outline font-bold uppercase tracking-widest">
            {{ isRegister ? 'Already registered?' : 'Need a new node?' }}
          </p>
          <button @click="isRegister = !isRegister"
            class="text-white text-[11px] font-black uppercase tracking-widest hover:text-rose-muted transition-colors underline decoration-2 underline-offset-4">
            {{ isRegister ? 'Switch to Terminal Login' : 'Create new Operator Identity' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabase()
const isRegister = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) navigateTo('/')
})

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    let response
    if (isRegister.value) {
      response = await supabase.auth.signUp({ email: email.value, password: password.value })
    } else {
      response = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    }

    if (response.error) throw response.error

    const user = response.data.user
    if (user) {

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarded, categories')
        .eq('id', user.id)
        .single()

      await $fetch('/api/user', {
        method: 'POST',
        body: {
          user_id: user.id,
          categories: profile?.categories || [],
          onboarded: profile?.onboarded || false
        }
      })

      navigateTo('/')
    }
  } catch (error: any) {
    errorMsg.value = `Access Denied: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>