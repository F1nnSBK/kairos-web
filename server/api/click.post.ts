// server/api/click.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Body parsen (user_id, article_id und optional action)
  const body = await readBody(event);

  // Validierung: Ohne ID geht gar nichts im Vektorraum
  if (!body.user_id || !body.article_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "KAIROS_ERROR: Missing payload for interaction update",
    });
  }

  try {
    /**
     * 2. Signal an die Kairos Engine propagieren.
     * Wir nutzen jetzt den neuen /interact Endpunkt.
     * Wenn keine action mitgeschickt wird (z.B. vom alten Frontend),
     * defaulten wir auf "click".
     */
    const response = await $fetch(`${config.kairosEngineUrl}/interact`, {
      method: "POST",
      body: {
        user_id: body.user_id,
        article_id: body.article_id,
        action: body.action || "click",
      },
    });

    // Logging für den Operator (gut für das Debugging im Terminal)
    console.log(
      `[Kairos-BFF] ${body.action || "click"} recorded for user ${body.user_id.slice(0, 8)}`,
    );

    return {
      status: "SIGNAL_PROPAGATED",
      engine_response: response,
    };
  } catch (error: any) {
    // Wenn die Julia-Engine im Allgäu oder in Toronto nicht erreichbar ist
    console.error("[BFF] Engine Connection Error:", error.message);

    throw createError({
      statusCode: 502,
      statusMessage: "ENGINE_DISCONNECTED: Learning update failed",
      data: {
        detail: error.message,
      },
    });
  }
});
