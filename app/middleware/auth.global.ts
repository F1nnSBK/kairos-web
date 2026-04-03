// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  console.log("!!! Middleware Triggered to:", to.path); // MUSS erscheinen

  const client = useSupabase();

  // Wir holen die Session direkt vom Singleton-Client
  const {
    data: { session },
  } = await client.auth.getSession();
  const user = session?.user;

  const isLoginPage = to.path === "/login";
  const isOnboardingPage = to.path === "/onboarding";

  if (!user) {
    if (!isLoginPage) return navigateTo("/login");
    return;
  }

  // Ab hier: User ist eingeloggt
  if (isLoginPage) return navigateTo("/");

  // Store für den Onboarding-Status
  const onboardingState = useState<boolean | null>(
    "onboarding_status",
    () => null,
  );

  if (onboardingState.value === null) {
    const { data: profile } = await client
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single();

    onboardingState.value = profile?.onboarded ?? false;
  }

  console.log("-> Current Onboarding Status:", onboardingState.value);

  if (onboardingState.value === false && !isOnboardingPage) {
    return navigateTo("/onboarding");
  }

  if (onboardingState.value === true && isOnboardingPage) {
    return navigateTo("/");
  }
});
