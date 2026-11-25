import { MODULE_PATH } from '../../modules/catalog';

export function Header() {
  return <header className="site-header">
    <a className="brand" href={MODULE_PATH} aria-label="DaveBot 首页">
      <img src="/static/crazy-dave.png" alt="" width="32" height="32" />
      <span>DaveBot</span>
    </a>
    <nav className="top-nav" aria-label="页面导航">
      <a className="active" href={MODULE_PATH} aria-current="page">上传数据</a>
      <a href="#guide-title">导入说明</a>
      <a href="https://docs.raivex.xyz/" target="_blank" rel="noopener noreferrer">使用文档<span aria-hidden="true"> ↗</span></a>
    </nav>
  </header>;
}
