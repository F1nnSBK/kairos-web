// server/api/user.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  if (!body.user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing user_id in registration payload",
    });
  }

  try {
    const response = await $fetch(`${config.kairosEngineUrl}/user`, {
      method: "POST",
      body: {
        user_id: body.user_id,
      },
    });

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
