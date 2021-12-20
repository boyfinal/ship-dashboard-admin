export const routes = [
  {
    path: '/warehouse',
    name: 'list-package-in-warehouse',
    meta: {
      title: 'Tra cứu kho',
    },
    component: () =>
      import(
        /* webpackChunkName: "sign-in" */ './views/ListPackageInWarehouse'
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
  {
    path: '/warehouse/check-in',
    name: 'check-in',
    meta: {
      title: 'Quét nhận hàng',
    },
    component: () =>
      import(/* webpackChunkName: "warehouse" */ './views/ScanInWarehouse'),
  },
]
