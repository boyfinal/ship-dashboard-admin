export const routes = [
  {
    path: '/account',
    name: 'account',
    meta: {
      title: 'Quản lý tài khoản',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/Account.vue'),
  },
  {
    path: '/debt',
    name: 'debt',
    meta: {
      title: 'Quản lý công nợ',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/Debt.vue'),
  },
  {
    path: '/prices',
    name: 'prices',
    meta: {
      title: 'Quản lý bảng giá',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/Prices.vue'),
  },
]
