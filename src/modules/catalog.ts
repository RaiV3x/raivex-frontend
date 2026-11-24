// Each module owns a static HTML entry so deep links work on GitHub Pages.
export const moduleCatalog = [
  { id: 'upload-data', title: '上传数据', route: '/upload-data/', entry: 'upload-data/index.html' },
  { id: 'ios-module', title: '模块订阅', route: '/upload-data/ios-module/', entry: 'upload-data/ios-module/index.html' },
] as const;
export type ModuleId = typeof moduleCatalog[number]['id'];
