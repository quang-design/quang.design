// Personalized invitation reads `?lang` and `?to` query params, so it can't be
// prerendered to static HTML. Render on the server per request instead.
export const prerender = false;
