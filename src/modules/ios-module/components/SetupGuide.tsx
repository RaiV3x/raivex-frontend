export function SetupGuide() {
  return <section className="guide-panel" aria-labelledby="guide-title"><p className="section-kicker">02 / SET UP</p><h2 id="guide-title">如何开始</h2>
    <ol className="guide-list">
      <li><span className="guide-index">01</span><div><strong>添加模块</strong><p>复制地址，导入 Shadowrocket。</p></div></li>
      <li><span className="guide-index">02</span><div><strong>启用抓包</strong><p>开启 MITM、信任证书，再进入 MySekai。抓包会立即提交；看到“提交成功”才表示服务器已接收，失败会保留缓存补传。</p></div></li>
      <li><span className="guide-index">03</span><div><strong>QQ 绑定</strong><p>私聊发送 <code>/d申请绑定 UID</code>；获批后发送 <code>/d绑定抓包 UID</code>。</p></div></li>
    </ol><div className="guide-help">全部指令 <code>/dmshelp</code></div>
  </section>;
}
