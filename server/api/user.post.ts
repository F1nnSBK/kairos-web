// server/api/user.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  if (!body.user_id) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "KAIROS_IDENTITY_ERROR: No user_id provided for synchronization.",
    });
  }

  try {
    const response = await $fetch(`${config.kairosEngineUrl}/user`, {
      method: "POST",
      body: {
        user_id: body.user_id,
        interests: body.categories || [],
        onboarded: body.onboarded || false,
      },
    });

    console.log(
      `[BFF] Synced User ${body.user_id.slice(0, 8)} | Interests: ${body.interests?.length || 0} | Onboarded: ${body.onboarded}`,
    );

    return response;
  } catch (error: any) {
    console.error(
      "[BFF] Julia Engine Connection Error:",
      error.data || error.message,
    );

    throw createError({
      statusCode: 502,
      statusMessage: "Intelligence Engine Synchronization Failed",
      data: error.data,
    });
  }
});
