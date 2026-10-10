import { normalizeToken } from '../security/token';
const PUBLIC_API = 'https://api.raivex.xyz';
export function subscriptionUrl(value: string): string | null {
  const token = normalizeToken(value);
  if (!token) return null;
  const url = new URL('/mysekaibot_cn.sgmodule', PUBLIC_API);
  url.searchParams.set('token', token);
  return url.href;
}
// Navigate to the server-rendered module, without fetching private data.
export function downloadSubscription(url: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.referrerPolicy = 'no-referrer';
  anchor.rel = 'noopener noreferrer';
  anchor.target = '_blank';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}
