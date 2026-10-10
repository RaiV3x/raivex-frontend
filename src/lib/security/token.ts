export function normalizeToken(value: string): string | null {
  const token = value.trim().toLowerCase();
  return /^[0-9a-f]{64}$/.test(token) ? token : null;
}
export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
