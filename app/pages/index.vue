<script setup lang="ts">
// Cookie auslesen
const authCookie = useCookie('kairos_session_token');
const user = useSupabaseUser();
const user_id = computed(() => user.value?.id || 'unknown');

// Der Rest bleibt gleich – useFetch nutzt automatisch die user_id.value
const { data: news, pending, refresh } = await useFetch('/api/recommend', {
  query: { user_id: user_id.value }
});

const handleInteraction = async (articleId: string) => {
  await $fetch('/api/click', {
    method: 'POST',
    body: { user_id: user_id.value, article_id: articleId }
  });
  refresh();
}

// Logout-Funktion für das "Engine"-Gefühl
const logout = () => {
  authCookie.value = null;
  navigateTo('/login');
}
</script>

<template>
  <div
    class="bg-surface border-2 border-white px-4 py-1 text-xs font-bold uppercase tracking-widest flex items-center gap-4">
    <span>User: {{ user_id }}</span>
    <button @click="logout" class="text-rose-muted hover:text-white transition-colors underline">[EXIT]</button>
  </div>
</template>