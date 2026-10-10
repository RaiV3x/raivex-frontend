import { moduleCatalog } from '../../modules/catalog';
import type { ModuleId } from '../../modules/catalog';
export function Header({ activeId }: { activeId?: ModuleId }) {
  return <header className="site-header">
    <a className="brand" href="/upload-data/ios-module/" aria-label="MySekaiBot 首页"><img src="/static/crazy-dave.png" alt="" width="38" height="38" /><span>MySekaiBot</span></a>
    <nav className="top-nav" aria-label="页面导航">
      {moduleCatalog.map(module => <a key={module.id} className={module.id === activeId ? 'active' : undefined} href={module.route} aria-current={module.id === activeId ? 'page' : undefined}>{module.title}</a>)}
      <a href="#guide-title">使用帮助</a><a href="#privacy">数据说明</a>
    </nav>
    <span className="header-label"><span className="header-dot" /> iOS / Shadowrocket</span>
  </header>;
}
