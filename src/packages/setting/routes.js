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
    path: '/user',
    name: 'user',
    meta: {
      title: 'Quản lý tài khoản khách hàng',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/User.vue'),
  },
  {
    path: '/user/:id',
    name: 'user-detail',
    meta: {
      title: 'Quản lý tài khoản khách hàng',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/UserDetail.vue'),
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
  {
    path: '/profile',
    name: 'profile',
    meta: {
      title: 'Thông tin tài khoản',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/Profile.vue'),
  },
  {
    path: '/debt',
    name: 'debt',
    meta: {
      title: 'Quản lý công nợ',
    },
    component: () => import(/* webpackChunkName: "bills" */ './views/Debt.vue'),
  },
  {
    path: '/carrier-prices',
    name: 'carrier_price',
    meta: {
      title: 'So sánh giá',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/CarrierPrice.vue'),
  },
]
