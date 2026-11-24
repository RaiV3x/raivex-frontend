export function SuitePanel() {
  return <section className="panel config-panel" aria-labelledby="suite-title">
    <div className="panel-heading">
      <h2 id="suite-title">UserSuite 数据</h2>
      <span className="panel-caption">国服 / 日服</span>
    </div>
    <p className="field-note">已有 Suite JSON 时，可由管理员在 DaveBot 后台提交已授权的数据。</p>
    <a className="text-link" href="https://admin.raivex.xyz/admin/usersuite">打开数据接收页<span aria-hidden="true"> ↗</span></a>
  </section>;
}
