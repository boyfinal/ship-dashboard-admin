export const routes = [
  {
    path: '/warehouse',
    name: 'list-package',
    meta: {
      title: 'Quản lý vận đơn',
    },
    component: () =>
      import(
        /* webpackChunkName: "warehouse" */ './views/ListPackageInWarehouse'
      ),
  },
  {
    path: '/warehouse/check-package',
    name: 'check-package',
    meta: {
      title: 'Quét kiểm hàng',
    },
    component: () =>
      import(/* webpackChunkName: "warehouse" */ './views/CheckPackage'),
  },
]
