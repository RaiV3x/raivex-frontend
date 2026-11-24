export function SetupGuide() {
  return <section className="panel guide-panel" aria-labelledby="guide-title">
    <h2 id="guide-title">导入到 Shadowrocket</h2>
    <ol className="guide-list">
      <li>打开 Shadowrocket 的「配置」→「模块」。</li>
      <li>点「添加模块」，粘贴订阅地址。也可以在系统分享菜单中用 Shadowrocket 打开下载的文件。</li>
      <li>添加完成后，在模块列表中启用所需功能。</li>
    </ol>
    <a className="text-link" href="https://docs.raivex.xyz/mysekai/" target="_blank" rel="noopener noreferrer">MySekai 使用帮助<span aria-hidden="true"> ↗</span></a>
  </section>;
}
