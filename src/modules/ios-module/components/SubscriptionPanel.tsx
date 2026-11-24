import { useId } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { TokenField } from './TokenField';

export function SubscriptionPanel() {
  const state = useSubscription();
  const titleId = useId();
  return <section className="panel config-panel" aria-labelledby={titleId}>
    <div className="panel-heading">
      <h2 id={titleId}>MySekai 订阅</h2>
      <span className="panel-caption">国服</span>
    </div>
    <TokenField state={state} />
    <div className="result-block">
      <div className="result-heading">
        <span>模块订阅地址</span>
        <strong className={`status${state.url ? ' ready' : ''}`}>{state.url ? '已就绪' : '等待令牌'}</strong>
      </div>
      <div className={`subscription-url${state.url ? ' ready' : ''}`} tabIndex={0} aria-label="模块订阅地址">
        {state.url || '填写或生成令牌以获取订阅地址'}
      </div>
      <p className={state.error ? 'error' : 'feedback'} role="status">{state.error || state.message}</p>
    </div>
    <div className="actions">
      <button type="button" className="primary" disabled={!state.url} onClick={state.copy}>复制订阅地址</button>
      <button type="button" disabled={!state.url} onClick={state.download}>下载 .sgmodule</button>
    </div>
  </section>;
}
