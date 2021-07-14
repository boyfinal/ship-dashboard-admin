export const routes = [
  {
    path: '/warehouse',
    name: 'list-package-in-warehouse',
    meta: {
      title: 'Danh sách kho',
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
]
