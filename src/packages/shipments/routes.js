export const routes = [
  {
    path: '/shipments',
    name: 'list-shipment',
    meta: {
      title: 'Quản lý lô hàng',
    },
    component: () =>
      import(/* webpackChunkName: "sign-in" */ './views/ListShipment'),
  },
]
