'use strict';
const server = document.querySelector('#server');
const uid = document.querySelector('#uid');
const playerToken = document.querySelector('#token');
const generateToken = document.querySelector('#generate-token');
const status = document.querySelector('#preview-status');
const error = document.querySelector('#error');
const claim = document.querySelector('#claim');
const claimStatus = document.querySelector('#claim-status');
const download = document.querySelector('#download');
const copyLink = document.querySelector('#copy-link');
server.value = 'https://api.raivex.xyz';
let currentModule = '';
let currentLink = '';
let submittedKey = '';
const moduleTemplate = String.raw`#!name=MySekaiBot · {{UID}}
#!desc=仅捕获此玩家的国服 MySekai 完整地图响应
#!author=MySekaiBot

[MITM]
hostname = %APPEND% mkcn-prod-public-60001-1.dailygn.com

[URL Rewrite]
^https://mkcn-prod-public-60001-1\.dailygn\.com/api/user/{{UID}}/mysekai\?isForceAllReloadOnlyMysekai=False$ https://mkcn-prod-public-60001-1.dailygn.com/api/user/{{UID}}/mysekai?isForceAllReloadOnlyMysekai=True 307

[Script]
mysekaibot-cn-response = type=http-response,pattern=^https:\/\/mkcn-prod-public-60001-1\.dailygn\.com\/api\/user\/{{UID}}\/mysekai\?isForceAllReloadOnlyMysekai=True(?:&[^#]*)?$,requires-body=1,binary-body-mode=1,max-size=100000000,timeout=45,script-path={{BASE_URL}}/shadowrocket_mysekai_cn.js?v=0.2.0,argument="endpoint={{ENDPOINT}}&uid={{UID}}&token={{TOKEN}}&debug=0"
`;

function valid() {
  const base = server.value.trim().replace(/\/+$/, '');
  let parsed;
  try { parsed = new URL(base); } catch (_) { return '请填写有效的接收服务地址。'; }
  if (parsed.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(parsed.hostname)) return '公网接收地址必须使用 HTTPS。';
  if (!/^\d{8,24}$/.test(uid.value.trim())) return '游戏 UID 应为 8–24 位数字。';
  if (!/^[0-9a-f]{64}$/i.test(playerToken.value.trim())) return '请生成 64 位随机令牌。';
  return '';
}
function refresh() {
  const message = valid();
  error.textContent = (uid.value || playerToken.value) ? message : '';
  const ready = !message && !!moduleTemplate;
  [claim,download,copyLink].forEach(button => { button.disabled = !ready; });
  if (!ready) { currentModule = ''; status.textContent = '等待填写'; return; }
  const base = server.value.trim().replace(/\/+$/, '');
  const id = uid.value.trim();
  const credential = playerToken.value.trim().toLowerCase();
  if (submittedKey !== `${id}:${credential}`) claimStatus.textContent = '';
  currentLink = `${base}/module/${credential}`;
  currentModule = `#!url=${currentLink}\n` + moduleTemplate
    .replaceAll('{{BASE_URL}}',base)
    .replaceAll('{{ENDPOINT}}',encodeURIComponent(`${base}/capture`))
    .replaceAll('{{UID}}',id)
    .replaceAll('{{TOKEN}}',credential);
  status.textContent = submittedKey === `${id}:${credential}` ? '等待管理员审核' : '令牌已生成';
}
for (const input of [server,uid,playerToken]) input.addEventListener('input', refresh);
generateToken.addEventListener('click', () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  playerToken.value = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  refresh();
});
claim.addEventListener('click', async () => {
  claim.disabled = true;
  claimStatus.textContent = '正在提交绑定申请…';
  try {
    const response = await fetch(`${server.value}/api/token-claims`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({user_id:uid.value.trim(), token:playerToken.value.trim().toLowerCase()}),
      cache: 'no-store',
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `接收端返回 HTTP ${response.status}`);
    }
    submittedKey = `${uid.value.trim()}:${playerToken.value.trim().toLowerCase()}`;
    claimStatus.textContent = '申请已提交。管理员在 VPS WebUI 审核后，模块才会生效。';
    refresh();
  } catch (reason) {
    claimStatus.textContent = `提交失败：${reason.message || '网络不可用'}`;
  } finally {
    claim.disabled = false;
  }
});
copyLink.addEventListener('click', async () => { await navigator.clipboard.writeText(currentLink); status.textContent = '已复制订阅链接'; });
download.addEventListener('click', () => {
  const file = new Blob([currentModule],{type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a'); anchor.href=url; anchor.download=`mysekaibot_${uid.value.trim()}.sgmodule`;
  anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
refresh();
