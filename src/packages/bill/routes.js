export const routes = [
  {
    path: '/bills',
    name: 'bill-list',
    meta: {
      title: 'Quản lý tài chính',
    },
    component: () => import(/* webpackChunkName: "bills" */ './views/List.vue'),
  },
  {
    path: '/debt',
    name: 'debt',
    meta: {
      title: 'Quản lý công nợ',
    },
    component: () =>
      import(/* webpackChunkName: "bills" */ '../setting/views/Debt.vue'),
  },
  {
    path: '/bills/:code',
    name: 'bill-detail',
    meta: {
      title: 'Chi tiết hóa đơn',
    },
    component: () =>
      import(/* webpackChunkName: "bills" */ './views/BillDetail.vue'),
  },
]
