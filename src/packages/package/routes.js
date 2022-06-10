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
    path: '/statistics',
    name: 'statistics',
    meta: {
      title: 'Thống kê',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/Statistics.vue'),
  },
  {
    path: '/packages/return',
    name: 'list-package-return',
    meta: {
      title: 'Quản lý đơn hàng trả về',
    },
    component: () =>
      import(
        /* webpackChunkName: "package" */ './views/ListPackagesReturn.vue'
      ),
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
