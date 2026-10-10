import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';
import { moduleCatalog } from '../modules/catalog';
import { modulePages } from '../modules/registry';
import { SiteShell } from '../components/layout/SiteShell';

class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <section className="page-message" role="alert"><p>页面加载失败，请刷新重试。</p><button onClick={() => location.reload()}>刷新页面</button></section>
      : this.props.children;
  }
}
export function App() {
  const path = location.pathname.replace(/\/$/, '');
  const module = moduleCatalog.find(item => item.route.replace(/\/$/, '') === path);
  const Page = module && modulePages[module.id];
  return <SiteShell activeId={module?.id}>
    <PageBoundary><Suspense fallback={<p className="page-message" role="status">加载中…</p>}>
      {Page ? <Page /> : <p className="page-message">页面不存在。<a href="/upload-data/ios-module/">返回首页</a></p>}
    </Suspense></PageBoundary>
  </SiteShell>;
}
