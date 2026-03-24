// server/api/recommend.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. user_id aus den Query-Parametern extrahieren (z.B. ?user_id=abc)
  const query = getQuery(event);
  const userId = query.user_id;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "KAIROS_ERROR: Missing user_id for vector retrieval",
    });
  }

  try {
    // 2. Fetch von der Julia Engine (GET /recommend/{user_id})
    const data = await $fetch(`${config.kairosEngineUrl}/recommend/${userId}`, {
      method: "GET",
    });

    return data;
  } catch (error: any) {
    console.error("[BFF] Recommendation Fetch Error:", error.message);
    throw createError({
      statusCode: 502,
      statusMessage: "ENGINE_OFFLINE: Could not reach Julia Inferenz-Service",
    });
  }
});
