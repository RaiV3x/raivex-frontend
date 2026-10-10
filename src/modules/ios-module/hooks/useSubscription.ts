import { useState } from 'react';
import { generateToken } from '../../../lib/security/token';
import { downloadSubscription, subscriptionUrl } from '../../../lib/api/subscription';
export function useSubscription() {
  const [token, setToken] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const url = subscriptionUrl(token);
  const error = token && !url ? '请输入 64 位十六进制随机令牌。' : '';
  function changeToken(value: string) { setToken(value); setMessage(''); }
  function generate() {
    if (token && !window.confirm('生成新令牌会替换当前令牌，是否继续？')) return;
    try { changeToken(generateToken()); }
    catch { setMessage('无法生成安全令牌，请使用 HTTPS 浏览器重试。'); }
  }
  async function copy() {
    if (!url) return;
    try { await navigator.clipboard.writeText(url); setMessage('订阅地址已复制。'); }
    catch { setMessage('复制失败，请选中订阅地址手动复制。'); }
  }
  function download() { if (url) downloadSubscription(url); }
  return { token, visible, setVisible, changeToken, generate, copy, download, url, error, message };
}
export type SubscriptionState = ReturnType<typeof useSubscription>;
