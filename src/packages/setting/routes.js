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
]
