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
]
