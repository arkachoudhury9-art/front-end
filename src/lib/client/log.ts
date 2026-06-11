/** Client-side logging for API and WebSocket traffic (temporary until server migration). */
export function logClient(
  channel: string,
  label: string,
  payload?: unknown,
): void {
  if (payload === undefined) {
    console.log(`[client][${channel}] ${label}`);
    return;
  }

  console.log(`[client][${channel}] ${label}`, payload);
}
