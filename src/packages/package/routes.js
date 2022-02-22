export const routes = [
  {
    path: '/packages',
    name: 'list-package',
    meta: {
      title: 'Quản lý vận đơn',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/ListPackages.vue'),
  },
  {
    path: '/packages/:id',
    name: 'package-detail',
    meta: {
      title: 'Chi tiết đơn hàng',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/PackageDetail'),
  },
]
