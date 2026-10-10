import { SubscriptionPanel } from './components/SubscriptionPanel';
import { SetupGuide } from './components/SetupGuide';
export default function IosModulePage() {
  return <><section className="intro" aria-labelledby="page-title"><h1 id="page-title">Dave Tools</h1></section>
    <div className="workspace"><SubscriptionPanel /><SetupGuide /></div>
    <p id="privacy" className="disclaimer">仅支持国服 MySekai。令牌仅保留在当前页面；复制的订阅地址包含令牌。</p>
  </>;
}
