import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function SiteShell({ children }: { children: ReactNode }) {
  return <div className="site-shell">
    <Header />
    <div className="main-column">
      <main className="content">{children}</main>
      <Footer />
    </div>
  </div>;
}
