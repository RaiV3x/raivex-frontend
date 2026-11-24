import { useState } from 'react';
import { SetupGuide } from './components/SetupGuide';
import { SubscriptionPanel } from './components/SubscriptionPanel';

const features = [
  {
    id: 'mysekai-cn',
    name: 'MySekai · 国服',
    detail: '资源地图、资源汇总和生日刷新',
    Panel: SubscriptionPanel,
  },
  {
    id: 'usersuite',
    name: 'UserSuite · B30 / B50',
    detail: '目前没有可订阅的 Shadowrocket 模块',
  },
] as const;

type FeatureId = typeof features[number]['id'];

export default function IosModulePage() {
  const [selected, setSelected] = useState<FeatureId[]>(['mysekai-cn']);

  function select(id: FeatureId, checked: boolean) {
    setSelected(current => checked ? [...current, id] : current.filter(item => item !== id));
  }

  return <>
    <div className="topbar" aria-label="当前位置">DaveBot <span>/</span> <strong>模块订阅</strong></div>
    <header className="page-heading">
      <h1 id="page-title">Shadowrocket 模块</h1>
      <p>勾选要使用的功能，再复制订阅链接或下载模块文件。</p>
    </header>
    <section className="panel feature-panel" id="features" aria-labelledby="feature-title">
      <div className="panel-heading">
        <h2 id="feature-title">选择功能</h2>
        <span className="selection-count">已选 {selected.length} 个</span>
      </div>
      <div className="feature-list">
        {features.map(feature => {
          const available = 'Panel' in feature;
          const checked = selected.includes(feature.id);
          return <label className={`feature${checked ? ' is-selected' : ''}${available ? '' : ' is-unavailable'}`} key={feature.id}>
            <input
              type="checkbox"
              checked={checked}
              disabled={!available}
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
          <h2>模块订阅</h2>
          <p className="empty-state">勾选一个可用功能以显示订阅链接。</p>
        </section>}
        {features.map(feature => {
          if (!('Panel' in feature)) return null;
          const { Panel } = feature;
          return <div key={feature.id} hidden={!selected.includes(feature.id)}>
            <Panel />
          </div>;
        })}
      </div>
      <SetupGuide />
    </div>
    <p id="privacy" className="disclaimer">订阅地址含你的令牌。页面关闭后，需重新粘贴令牌才能恢复原地址。</p>
  </>;
}
