import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { ModuleId } from './catalog';

const UploadPage = lazy(() => import('./ios-module/Page'));

export const modulePages: Record<ModuleId, LazyExoticComponent<ComponentType>> = {
  'ios-module': UploadPage,
};
