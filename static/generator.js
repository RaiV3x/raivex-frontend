'use strict';
const server = document.querySelector('#server');
const playerToken = document.querySelector('#token');
const generateToken = document.querySelector('#generate-token');
const status = document.querySelector('#preview-status');
const error = document.querySelector('#error');
const download = document.querySelector('#download');
const copyLink = document.querySelector('#copy-link');
server.value = 'https://api.raivex.xyz';
let currentModule = '';
let currentLink = '';
const moduleTemplate = String.raw`#!name=MySekaiBot 自动抓包（国服）
#!desc=强制刷新并捕获国服 MySekai 完整地图响应，发送到 MySekaiBot 服务
#!author=MySekaiBot

[MITM]
hostname = %APPEND% mkcn-prod-public-60001-1.dailygn.com

[URL Rewrite]
^https://mkcn-prod-public-60001-1\.dailygn\.com/api/user/(\d+)/mysekai\?isForceAllReloadOnlyMysekai=False$ https://mkcn-prod-public-60001-1.dailygn.com/api/user/$1/mysekai?isForceAllReloadOnlyMysekai=True 307

[Script]
# 随机令牌已自动写入下方的 token 参数，无需手动修改。
mysekaibot-cn-response = type=http-response,pattern=^https:\/\/mkcn-prod-public-60001-1\.dailygn\.com\/api\/user\/\d+\/mysekai\?isForceAllReloadOnlyMysekai=True(?:&[^#]*)?$,requires-body=1,binary-body-mode=1,max-size=100000000,timeout=45,script-path={{BASE_URL}}/shadowrocket_mysekai_cn.js?v=0.2.1,argument="endpoint={{ENDPOINT}}&token={{TOKEN}}&debug=0"
`;

function valid() {
  const base = server.value.trim().replace(/\/+$/, '');
  let parsed;
  try { parsed = new URL(base); } catch (_) { return '请填写有效的接收服务地址。'; }
  if (parsed.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(parsed.hostname)) return '公网接收地址必须使用 HTTPS。';
  if (!/^[0-9a-f]{64}$/i.test(playerToken.value.trim())) return '请生成 64 位随机令牌。';
  return '';
}
function refresh() {
  const message = valid();
  error.textContent = playerToken.value ? message : '';
  const ready = !message && !!moduleTemplate;
  [download,copyLink].forEach(button => { button.disabled = !ready; });
  if (!ready) { currentModule = ''; status.textContent = '等待填写'; return; }
  const base = server.value.trim().replace(/\/+$/, '');
  const credential = playerToken.value.trim().toLowerCase();
  currentLink = `${base}/mysekaibot_cn.sgmodule?token=${credential}`;
  currentModule = `#!url=${currentLink}\n` + moduleTemplate
    .replaceAll('{{BASE_URL}}',base)
    .replaceAll('{{ENDPOINT}}',encodeURIComponent(`${base}/capture`))
    .replaceAll('{{TOKEN}}',credential);
  status.textContent = '模块可导入';
}
for (const input of [server,playerToken]) input.addEventListener('input', refresh);
generateToken.addEventListener('click', () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  playerToken.value = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  refresh();
});
copyLink.addEventListener('click', async () => { await navigator.clipboard.writeText(currentLink); status.textContent = '已复制订阅链接'; });
download.addEventListener('click', () => {
  const file = new Blob([currentModule],{type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a'); anchor.href=url; anchor.download='mysekaibot_cn.sgmodule';
  anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
refresh();
