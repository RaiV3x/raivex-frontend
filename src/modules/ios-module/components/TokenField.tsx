import { useId } from 'react';
import type { SubscriptionState } from '../hooks/useSubscription';
export function TokenField({ state }: { state: SubscriptionState }) {
  const inputId = useId();
  const noteId = useId();
  return <div className="token-block">
    <div className="field-heading"><label htmlFor={inputId}>随机令牌</label><button type="button" className="quiet-button" aria-pressed={state.visible} onClick={() => state.setVisible(!state.visible)}>{state.visible ? '隐藏令牌' : '显示令牌'}</button></div>
    <div className="token-control"><input id={inputId} type={state.visible ? 'text' : 'password'} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-describedby={noteId} aria-invalid={!!state.error} maxLength={64} placeholder="生成新令牌，或粘贴已有令牌" value={state.token} onChange={event => state.changeToken(event.target.value)} /><button type="button" onClick={state.generate}>生成令牌</button></div>
    <p id={noteId} className="field-note">请保存令牌，不要分享给他人。</p>
  </div>;
}
