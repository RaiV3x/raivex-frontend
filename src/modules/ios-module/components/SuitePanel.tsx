export function SuitePanel() {
  return <section className="panel config-panel" aria-labelledby="suite-title">
    <div className="panel-heading">
      <h2 id="suite-title">UserSuite 数据</h2>
      <span className="panel-caption">国服 / 日服</span>
    </div>
    <p className="field-note">此模块让发往 DaveBot IPv4 数据接口的流量直连。</p>
    <a className="text-link" href="https://api.raivex.xyz:8443/usersuite.sgmodule">下载 UserSuite 直连模块<span aria-hidden="true"> ↗</span></a>
  </section>;
}
