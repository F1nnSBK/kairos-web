// server/api/user.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Body vom Frontend lesen (enthält { user_id: '...' })
  const body = await readBody(event);

  if (!body.user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing user_id in registration payload",
    });
  }

  try {
    // 2. Weiterleitung an die Julia Engine
    // Wir nutzen die URL aus der Runtime Config
    const response = await $fetch(`${config.kairosEngineUrl}/user`, {
      method: "POST",
      body: {
        user_id: body.user_id,
      },
    });

    // 3. Antwort von Julia an Nuxt-Frontend zurückgeben
    return response;
  } catch (error: any) {
    console.error(
      "[BFF] Julia Engine Connection Error:",
      error.data || error.message,
    );

    throw createError({
      statusCode: 502, // Bad Gateway (Julia ist down oder antwortet falsch)
      statusMessage: "Intelligence Engine Synchronization Failed",
      data: error.data,
    });
  }
});
