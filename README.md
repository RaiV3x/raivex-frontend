# raivex.xyz 配置生成器

纯静态 Shadowrocket 模块生成器。玩家的 UID 与 UUID 只在浏览器本地用于拼装配置，前端不向 GitHub 或其他站点提交这些值。服务端仍会验证 UUID 是否属于该 UID。

本仓库使用 GitHub Pages 发布到 `raivex.xyz/upload-data/`，根路径会跳转到该页面。UUID 由 Rust 后端在管理员添加白名单玩家时随机生成并持久保存，浏览器只使用玩家拿到的 UUID 生成配置，不会生成未入库的无效令牌。接收服务地址为 `https://api.raivex.xyz`，实际的 Rust/Axum 后端运行在 VPS；后端源代码位于私有仓库 `RaiV3x/MySekaiBot-Rust`。

DNS 应将根域名 `raivex.xyz` 指向 GitHub Pages 官方 A/AAAA 记录，并将 `api.raivex.xyz` 指向 VPS。启用 Pages 的自定义域名与 HTTPS 后检查两端可访问。
