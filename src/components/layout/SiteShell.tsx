import type { ReactNode } from 'react';
import type { ModuleId } from '../../modules/catalog';
import { Header } from './Header';
import { Footer } from './Footer';
export function SiteShell({ children, activeId }: { children: ReactNode; activeId?: ModuleId }) {
  return <><div className="site-shell"><Header activeId={activeId} /><main>{children}</main></div><Footer /></>;
}
