export const routes = [
  {
    path: '/bill/:id',
    name: 'bill-detail',
    meta: {
      title: 'Chi tiết hóa đơn',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/BillDetail.vue'),
  },
]
