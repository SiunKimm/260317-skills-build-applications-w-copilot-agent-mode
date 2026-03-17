export function extractCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

export function logFetchedCollection(resourceName, endpoint, payload, collection) {
  console.log(`[OctoFit] ${resourceName} endpoint:`, endpoint);
  console.log(`[OctoFit] ${resourceName} payload:`, payload);
  console.log(`[OctoFit] ${resourceName} items:`, collection);
}