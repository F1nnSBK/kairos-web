export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return; // SSR komplett ignorieren

  const user = useSupabaseUser();
  const isLoginPage = to.path === "/login";

  if (!user.value && !isLoginPage) return navigateTo("/login");
  if (user.value && isLoginPage) return navigateTo("/");
});
