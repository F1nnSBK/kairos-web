// server/api/click.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Body parsen (enthält user_id und article_id)
  const body = await readBody(event);

  if (!body.user_id || !body.article_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "KAIROS_ERROR: Missing payload for reward update",
    });
  }

  try {
    // 2. Signal an Julia senden (POST /click)
    const response = await $fetch(`${config.kairosEngineUrl}/click`, {
      method: "POST",
      body: {
        user_id: body.user_id,
        article_id: body.article_id,
      },
    });

    return {
      status: "SIGNAL_PROPAGATED",
      engine_response: response,
    };
  } catch (error: any) {
    console.error("[BFF] Click Tracking Error:", error.message);
    throw createError({
      statusCode: 502,
      statusMessage: "ENGINE_DISCONNECTED: Learning update failed",
    });
  }
});
