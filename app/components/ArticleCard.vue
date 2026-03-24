<template>
  <div
    class="bg-surface border-4 border-white p-6 shadow-hard-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col justify-between group h-full relative overflow-hidden">
    <div
      class="absolute top-0 right-0 w-16 h-16 bg-white/5 -mr-8 -mt-8 rotate-45 group-hover:bg-rose-muted/10 transition-colors">
    </div>

    <div>
      <div class="flex justify-between items-start mb-6">
        <span class="text-[10px] font-black text-rose-muted uppercase tracking-[0.3em]">
          Source // Tagesschau
        </span>
        <span class="text-[9px] font-mono text-outline uppercase tracking-tighter">
          {{ formatTime(article.timestamp) }}
        </span>
      </div>

      <h2
        class="text-2xl md:text-3xl font-black leading-none uppercase mb-6 group-hover:text-rose-muted transition-colors">
        {{ article.title }}
      </h2>
    </div>

    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <div class="bg-obsidian border-2 border-outline px-3 py-1 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-rose-muted">analytics</span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-white">Match_Found</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-outline/30">
        <a :href="article.url" target="_blank" @click="$emit('interact', article.id)"
          class="flex-1 bg-white text-obsidian text-center py-3 font-black uppercase text-xs tracking-widest hover:bg-rose-muted transition-colors border-2 border-white">
          Read_Full_Report
        </a>
        <button @click="$emit('interact', article.id)"
          class="px-4 py-3 border-2 border-white text-white hover:bg-white hover:text-obsidian transition-all uppercase font-black text-[10px] tracking-widest">
          Mark_Seen
        </button>
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
    timestamp: string;
  }
}>();

defineEmits(['interact']);

const formatTime = (ts: string) => {
  return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
};
</script>