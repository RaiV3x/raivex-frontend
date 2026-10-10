import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { ModuleId } from './catalog';
export const modulePages: Record<ModuleId, LazyExoticComponent<ComponentType>> = {
  'ios-module': lazy(() => import('./ios-module/Page')),
};
