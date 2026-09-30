'use strict';
const server = document.querySelector('#server');
const playerToken = document.querySelector('#token');
const generateToken = document.querySelector('#generate-token');
const status = document.querySelector('#preview-status');
const subscriptionUrl = document.querySelector('#subscription-url');
const error = document.querySelector('#error');
const download = document.querySelector('#download');
const copyLink = document.querySelector('#copy-link');
const toggleToken = document.querySelector('#toggle-token');
server.value = 'https://api.raivex.xyz';
let currentLink = '';

function valid() {
  const base = server.value.trim().replace(/\/+$/, '');
  let parsed;
  try { parsed = new URL(base); } catch (_) { return '请填写有效的接收服务地址。'; }
  if (!['http:','https:'].includes(parsed.protocol) || (parsed.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(parsed.hostname))) return '公网接收地址必须使用 HTTPS。';
  if (!/^[0-9a-f]{64}$/i.test(playerToken.value.trim())) return '请生成 64 位随机令牌。';
  return '';
}
function refresh() {
  const message = valid();
  error.textContent = playerToken.value ? message : '';
  const ready = !message;
  generateToken.textContent=/^[0-9a-f]{64}$/i.test(playerToken.value.trim())?'重新生成':'生成令牌';
  [download,copyLink].forEach(button => { button.disabled = !ready; });
  if (!ready) {
    currentLink = '';
    status.textContent = '等待生成';
    status.className = 'status';
    subscriptionUrl.textContent = '生成令牌后，这里会显示你的订阅地址';
    subscriptionUrl.className = 'subscription-url';
    return;
  }
  const base = server.value.trim().replace(/\/+$/, '');
  const credential = playerToken.value.trim().toLowerCase();
  currentLink = `${base}/mysekaibot_cn.sgmodule?token=${credential}`;
  status.textContent = '配置已生成';
  status.className = 'status ready';
  subscriptionUrl.textContent = currentLink;
  subscriptionUrl.className = 'subscription-url ready';
}
for (const input of [server,playerToken]) input.addEventListener('input', refresh);
generateToken.addEventListener('click', () => {
  if (/^[0-9a-f]{64}$/i.test(playerToken.value.trim()) && !confirm('重新生成会更换令牌。原订阅地址不会自动更新，确认继续？')) return;
  try {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  playerToken.value = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  refresh();
  } catch (_) { error.textContent='随机令牌生成失败，请使用 HTTPS 打开本页。'; }
});
toggleToken.addEventListener('click',()=>{
  const show=playerToken.type==='password'; playerToken.type=show?'text':'password';
  toggleToken.textContent=show?'隐藏令牌':'显示令牌'; toggleToken.setAttribute('aria-pressed',String(show));
});
copyLink.addEventListener('click', async () => {
  if(!currentLink) return;
  try { await navigator.clipboard.writeText(currentLink); status.textContent = '订阅地址已复制'; error.textContent=''; }
  catch (_) {
    const range=document.createRange(); range.selectNodeContents(subscriptionUrl);
    const selection=window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    error.textContent='浏览器未允许复制，请长按或手动复制已选中的地址。';
  }
});
download.addEventListener('click', () => {
  if(!currentLink) return;
  const anchor = document.createElement('a'); anchor.href=currentLink;
  anchor.download='mysekaibot_cn.sgmodule'; anchor.rel='noreferrer'; anchor.click();
});
refresh();
