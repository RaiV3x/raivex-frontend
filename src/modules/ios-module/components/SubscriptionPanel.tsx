import { useSubscription } from '../hooks/useSubscription';
import { TokenField } from './TokenField';
export function SubscriptionPanel() {
  const state = useSubscription();
  return <section className="config-panel" aria-labelledby="config-title">
    <div className="panel-heading"><div><p className="section-kicker">01 / GENERATE</p><h2 id="config-title">生成配置</h2></div><span className="panel-caption">Shadowrocket · 国服</span></div>
    <TokenField state={state} />
    <div className="result-block"><div className="result-heading"><span>模块订阅地址</span><strong className={`status${state.url ? ' ready' : ''}`}>{state.url ? '已就绪' : '等待生成'}</strong></div>
      <div className={`subscription-url${state.url ? ' ready' : ''}`} tabIndex={0} aria-label="模块订阅地址">{state.url || '生成令牌后，这里会显示你的订阅地址'}</div>
      <p className={state.error ? 'error' : 'feedback'} role="status">{state.error || state.message}</p>
    </div>
    <div className="actions"><button type="button" className="primary" disabled={!state.url} onClick={state.copy}>复制订阅地址 <span aria-hidden="true">↗</span></button><button type="button" disabled={!state.url} onClick={state.download}>下载 .sgmodule</button></div>
    <p className="panel-footnote">在 Shadowrocket 中更新模块后，应用配置。</p>
  </section>;
}
