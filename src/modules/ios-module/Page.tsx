import { useState } from 'react';
import { SetupGuide } from './components/SetupGuide';
import { SubscriptionPanel } from './components/SubscriptionPanel';

const features = [
  {
    id: 'mysekai-cn',
    name: 'MySekai 数据',
    detail: '国服 · 地图、资源与生日刷新共用此订阅',
    title: 'MySekai',
    region: '国服',
  },
  {
    id: 'usersuite',
    name: 'UserSuite 数据',
    detail: '国服 / 日服 · IPv4 数据直连',
    title: 'UserSuite',
    region: '国服 / 日服',
  },
] as const;

type FeatureId = typeof features[number]['id'];

export default function IosModulePage() {
  const [selected, setSelected] = useState<FeatureId[]>(() => features.map(feature => feature.id));

  function select(id: FeatureId, checked: boolean) {
    setSelected(current => checked ? [...current, id] : current.filter(item => item !== id));
  }

  return <>
    <div className="topbar" aria-label="当前位置">DaveBot <span>/</span> <strong>上传数据</strong></div>
    <header className="page-heading">
      <h1 id="page-title">上传数据</h1>
      <p>选择数据类型，为各自的 Shadowrocket 模块生成订阅。</p>
    </header>
    <section className="panel feature-panel" id="features" aria-labelledby="feature-title">
      <div className="panel-heading">
        <h2 id="feature-title">选择数据类型</h2>
        <span className="selection-count">已选 {selected.length} 个</span>
      </div>
      <div className="feature-list">
        {features.map(feature => {
          const checked = selected.includes(feature.id);
          return <label className={`feature${checked ? ' is-selected' : ''}`} key={feature.id}>
            <input
              type="checkbox"
              checked={checked}
              aria-labelledby={`${feature.id}-label`}
              aria-describedby={`${feature.id}-detail`}
              onChange={event => select(feature.id, event.currentTarget.checked)}
            />
            <span className="feature-copy">
              <strong id={`${feature.id}-label`}>{feature.name}</strong>
              <span id={`${feature.id}-detail`}>{feature.detail}</span>
            </span>
          </label>;
        })}
      </div>
    </section>
    <div className="workspace">
      <div className="subscriptions">
        {selected.length === 0 && <section className="panel config-panel">
          <h2>数据提交</h2>
          <p className="empty-state">勾选数据类型以显示提交方式。</p>
        </section>}
        {features.map(feature => <div key={feature.id} hidden={!selected.includes(feature.id)}>
          <SubscriptionPanel kind={feature.id} title={feature.title} region={feature.region} />
        </div>)}
      </div>
      {selected.includes('mysekai-cn') && <SetupGuide />}
    </div>
    <p id="privacy" className="disclaimer">订阅地址含你的令牌。页面关闭后，需重新粘贴令牌才能恢复原地址。</p>
  </>;
}
