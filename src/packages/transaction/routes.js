export const routes = [
  {
    path: '/transactions',
    name: 'list-transaction',
    meta: {
      title: 'Thanh toán',
    },
    component: () =>
      import(
        /* webpackChunkName: "transaction" */ './views/ListTransactions.vue'
      ),
  },
]
