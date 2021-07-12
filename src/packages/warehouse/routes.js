export const routes = [
  {
    path: '/packages',
    name: 'list-package',
    meta: {
      title: 'Quản lý vận đơn',
    },
    component: () =>
      import(
        /* webpackChunkName: "sign-in" */ './views/ListPackageInWarehouse'
      ),
  },
]
