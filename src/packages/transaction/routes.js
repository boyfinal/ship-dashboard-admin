export const routes = [
  {
    path: '/transactions',
    name: 'list-transaction',
    meta: {
      title: 'Thanh toán',
    },
    component: () =>
      import(
        /* webpackChunkName: "list-transaction" */ './views/ListTransactions.vue'
      ),
  },
]
