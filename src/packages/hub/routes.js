export const routes = [
  {
    path: '/hub/import',
    name: 'scan-import-hub',
    meta: {
      title: 'Quét nhập hub',
    },
    component: () =>
      import(/* webpackChunkName: "sign-in" */ './views/ScanImportHub'),
  },
  {
    path: '/hub/export',
    name: 'scan-export-hub',
    meta: {
      title: 'Quét xuất hub',
    },
    component: () =>
      import(/* webpackChunkName: "sign-in" */ './views/ScanExportHub'),
  },
]
