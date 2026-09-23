# raivex.xyz 配置生成器

纯静态 Shadowrocket 模块生成器。浏览器使用 `crypto.getRandomValues` 生成 64 位十六进制随机令牌。玩家提交 UID 与令牌给 VPS 后，管理员在独立的后端 WebUI 审核；未获批准的令牌不能下载有效的订阅模块或上传抓包数据。随后玩家私聊机器人申请 QQ 与 UID 的归属绑定，管理员再次审核，才可使用单参数 `/绑定抓包 UID`。前端不会向 GitHub 提交玩家信息。

本仓库使用 GitHub Pages 发布到 `raivex.xyz/upload-data/`，根路径会跳转到该页面。管理 WebUI 由 VPS 后端在 `https://admin.raivex.xyz/admin` 提供，并以 Cloudflare Access 限定管理员邮箱登录；不在前端显示。Rust/Axum 后端运行在 VPS；后端源代码位于私有仓库 `RaiV3x/MySekaiBot-Rust`。

DNS 将根域名 `raivex.xyz` 指向 GitHub Pages；公开的 `api.raivex.xyz` 通过 Cloudflare Tunnel 接入 VPS 本机的功能端口。管理域名使用另一条 Tunnel 路由连接独立管理端口，绝不复用公开 API 路由。生产使用前需验证 Pages HTTPS、Access 登录保护、API 路由及真实抓包流程。
