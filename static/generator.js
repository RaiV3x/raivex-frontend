'use strict';
const server = document.querySelector('#server');
const uid = document.querySelector('#uid');
const playerUuid = document.querySelector('#uuid');
const status = document.querySelector('#preview-status');
const error = document.querySelector('#error');
const copy = document.querySelector('#copy');
const download = document.querySelector('#download');
const copyLink = document.querySelector('#copy-link');
server.value = 'https://api.raivex.xyz';
let currentModule = '';
let currentLink = '';
const moduleTemplate = String.raw`#!name=MySekaiBot · {{UID}}
#!desc=仅捕获此玩家的国服 MySekai 完整地图响应
#!author=MySekaiBot

[MITM]
hostname = %APPEND% mkcn-prod-public-60001-1.dailygn.com

[URL Rewrite]
^https://mkcn-prod-public-60001-1\.dailygn\.com/api/user/{{UID}}/mysekai\?isForceAllReloadOnlyMysekai=False$ https://mkcn-prod-public-60001-1.dailygn.com/api/user/{{UID}}/mysekai?isForceAllReloadOnlyMysekai=True 307

[Script]
mysekaibot-cn-response = type=http-response,pattern=^https:\/\/mkcn-prod-public-60001-1\.dailygn\.com\/api\/user\/{{UID}}\/mysekai\?isForceAllReloadOnlyMysekai=True(?:&[^#]*)?$,requires-body=1,binary-body-mode=1,max-size=100000000,timeout=45,script-path={{BASE_URL}}/shadowrocket_mysekai_cn.js?v=0.1.0,argument="endpoint={{ENDPOINT}}&uid={{UID}}&uuid={{UUID}}&debug=0"
`;

function valid() {
  const base = server.value.trim().replace(/\/+$/, '');
  let parsed;
  try { parsed = new URL(base); } catch (_) { return '请填写有效的接收服务地址。'; }
  if (parsed.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(parsed.hostname)) return '公网接收地址必须使用 HTTPS。';
  if (!/^\d{8,24}$/.test(uid.value.trim())) return '游戏 UID 应为 8–24 位数字。';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(playerUuid.value.trim())) return '请输入管理员分配的有效 UUID。';
  return '';
}
function refresh() {
  const message = valid();
  error.textContent = (uid.value || playerUuid.value) ? message : '';
  const ready = !message && !!moduleTemplate;
  [copy,download,copyLink].forEach(button => { button.disabled = !ready; });
  if (!ready) { currentModule = ''; status.textContent = '等待填写'; return; }
  const base = server.value.trim().replace(/\/+$/, '');
  const id = uid.value.trim();
  const credential = playerUuid.value.trim().toLowerCase();
  currentLink = `${base}/module/${credential}`;
  currentModule = `#!url=${currentLink}\n` + moduleTemplate
    .replaceAll('{{BASE_URL}}',base)
    .replaceAll('{{ENDPOINT}}',encodeURIComponent(`${base}/capture`))
    .replaceAll('{{UID}}',id)
    .replaceAll('{{UUID}}',credential);
  status.textContent = '配置已生成';
}
for (const input of [server,uid,playerUuid]) input.addEventListener('input', refresh);
copy.addEventListener('click', async () => { await navigator.clipboard.writeText(currentModule); status.textContent = '已复制模块'; });
copyLink.addEventListener('click', async () => { await navigator.clipboard.writeText(currentLink); status.textContent = '已复制订阅链接'; });
download.addEventListener('click', () => {
  const file = new Blob([currentModule],{type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a'); anchor.href=url; anchor.download=`mysekaibot_${uid.value.trim()}.sgmodule`;
  anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
refresh();
