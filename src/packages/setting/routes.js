export const routes = [
  {
    path: '/setting/account',
    name: 'account',
    meta: {
      title: 'Account',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/Account.vue'),
  },
]
