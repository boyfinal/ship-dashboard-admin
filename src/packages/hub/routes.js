export const routes = [
  {
    path: '/hubs/search',
    name: 'hubs-search',
    meta: {
      title: 'Tra cứu đơn',
    },
    component: () => import(/* webpackChunkName: "hub" */ './views/Search.vue'),
  },
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
