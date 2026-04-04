<script setup lang="ts">
const route = useRoute();
const client = useSupabase();
const profile = ref<any>(null);
const isLoading = ref(true);

// Globaler Store für den schnellen Vergleich
const myProfile = useState<any>("user_profile");

onMounted(async () => {
  const userId = route.params.id;

  if (myProfile.value && myProfile.value.id === userId) {
    profile.value = myProfile.value;
    isLoading.value = false;
  } else {
    const { data } = await client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    profile.value = data;
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="p-6 bg-obsidian min-h-screen text-white">
    <div v-if="isLoading" class="animate-pulse text-rose-muted font-mono text-sm uppercase">
      Loading...
    </div>

    <div v-else-if="profile" class="max-w-xl border-4 border-white p-6 bg-surface">
      <h1 class="text-2xl font-black uppercase mb-6">Profile</h1>

      <div class="space-y-4 font-mono text-xs">
        <div class="flex flex-col gap-1 border-b border-white/20 pb-3">
          <span class="text-outline uppercase text-[10px]">User ID</span>
          <span class="break-all">{{ profile.id }}</span>
        </div>

        <div class="border-b border-white/20 pb-3">
          <p class="text-outline uppercase text-[10px] mb-2">Interests</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="cat in profile.categories" :key="cat"
              class="bg-rose-muted text-obsidian px-2 py-1 font-black text-[10px]">
              {{ cat }}
            </span>
          </div>
        </div>

        <button @click="navigateTo('/')"
          class="text-[10px] font-black text-rose-muted hover:text-white uppercase transition-colors underline underline-offset-4 decoration-2">
          ← Back
        </button>
      </div>
    </div>
  </div>
</template>