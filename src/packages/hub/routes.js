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
]
