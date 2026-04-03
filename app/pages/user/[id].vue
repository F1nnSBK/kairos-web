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
  <div class="p-8 bg-obsidian min-h-screen text-white">
    <div v-if="isLoading" class="animate-pulse text-rose-muted font-mono uppercase">
      > FETCHING_USER_DATA...
    </div>

    <div v-else-if="profile" class="max-w-xl border-4 border-white p-8 shadow-hard-white bg-surface">
      <h1 class="text-4xl font-black uppercase mb-6">Operator_Profile</h1>

      <div class="space-y-4 font-mono text-xs">
        <div class="flex justify-between border-b border-white/20 pb-2">
          <span class="text-outline uppercase">UUID:</span>
          <span>{{ profile.id }}</span>
        </div>

        <div class="border-b border-white/20 pb-2">
          <p class="text-outline uppercase mb-2">Interests_Vector_Clusters:</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="cat in profile.categories" :key="cat" class="bg-rose-muted text-obsidian px-2 py-1 font-black">
              {{ cat }}
            </span>
          </div>
        </div>
        <div class="flex justify-between border-b border-obsidian/10 pb-1">
          <button @click="navigateTo('/')"
            class="text-[10px] font-black text-rose-muted hover:text-white uppercase transition-colors underline underline-offset-4 decoration-2">
            Back_To_Feed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>