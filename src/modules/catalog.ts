// Each module owns a static HTML entry so deep links work on GitHub Pages.
export const moduleCatalog = [
  { id: 'ios-module', title: '国服模块', route: '/upload-data/ios-module/', entry: 'upload-data/ios-module/index.html' },
] as const;
export type ModuleId = typeof moduleCatalog[number]['id'];
