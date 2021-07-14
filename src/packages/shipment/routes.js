export const routes = [
  {
    path: '/shipments/:id',
    name: 'shipment-detail',
    meta: {
      title: 'Chi tiết lô hàng',
    },
    component: () =>
      import(
        /* webpackChunkName: "shipment-detail" */ './views/ShipmentDetail.vue'
      ),
  },
]
