<template>
  <div
    class="bg-surface border-4 border-white p-0 shadow-hard-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col group relative overflow-hidden">

    <div class="relative w-full aspect-square border-b-4 border-white overflow-hidden bg-obsidian">
      <img :src="article.image_url || 'https://via.placeholder.com/840?text=NO_SIGNAL'"
        class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
        alt="Intelligence Data" />

      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-2 w-full animate-pulse pointer-events-none">
      </div>

      <div class="absolute bottom-4 left-4 bg-white border-2 border-obsidian px-2 py-1 shadow-hard-obsidian z-10">
        <span class="text-[10px] font-mono font-black text-obsidian tracking-tighter uppercase">
          {{ formatTime(article.timestamp) }}
        </span>
      </div>
    </div>

    <div class="p-6 flex flex-col justify-between flex-1 relative">
      <div
        class="absolute top-0 right-0 w-12 h-12 bg-white/5 -mr-6 -mt-6 rotate-45 group-hover:bg-rose-muted/10 transition-colors">
      </div>

      <div>
        <div class="flex justify-between items-start mb-4">
          <span class="text-[10px] font-black text-rose-muted uppercase tracking-[0.2em]">
            Source // Tagesschau
          </span>
          <span class="text-[9px] font-bold text-white/30 font-mono">
            ID_{{ article.id.slice(-6) }}
          </span>
        </div>

        <h2
          class="text-xl font-black leading-tight uppercase mb-6 group-hover:text-rose-muted transition-colors line-clamp-3">
          {{ article.title }}
        </h2>
      </div>

      <div class="space-y-4">
        <div class="bg-obsidian border-2 border-outline px-3 py-1 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-rose-muted">
            {{ article.metadata.is_discovery ? 'explore' : 'psychology' }}
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-white">
            {{ article.metadata.match_pct }}% Match
          </span>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-outline/30">
          <a :href="article.url" target="_blank" @click="$emit('interact', article.id, 'click')"
            class="flex-1 bg-white text-obsidian text-center py-2 font-black uppercase text-[10px] tracking-widest hover:bg-rose-muted transition-colors border-2 border-white shadow-hard-obsidian hover:shadow-none active:translate-x-0.5 active:translate-y-0.5">
            Open_Report
          </a>
          <button @click="$emit('interact', article.id, 'dismiss')"
            class="px-3 py-2 border-2 border-white text-white hover:bg-white hover:text-obsidian transition-all uppercase font-black text-[9px] tracking-widest">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  article: {
    id: string;
    title: string;
    url: string;
    image_url: string;
    timestamp: string;
    metadata: {
      is_discovery: boolean;
      match_pct: number;
      confidence: number;
    };
  }
}>();

defineEmits(['interact']);

const formatTime = (ts: string) => {
  return new Date(ts).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.text-outline {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
  color: transparent;
}
</style>