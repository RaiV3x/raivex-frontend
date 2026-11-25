export const MODULE_PATH = '/upload-data/ios-module/';

// Each module owns a static HTML entry so deep links work on GitHub Pages.
export const moduleCatalog = [
  { id: 'ios-module', title: '模块订阅', route: MODULE_PATH, entry: 'upload-data/ios-module/index.html' },
] as const;
export type ModuleId = typeof moduleCatalog[number]['id'];
