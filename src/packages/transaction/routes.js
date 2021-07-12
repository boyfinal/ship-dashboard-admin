export const routes = [
  {
    path: '/transactions',
    name: 'list-transaction',
    meta: {
      title: 'Lịch sử giao dịch',
    },
    component: () =>
      import(
        /* webpackChunkName: "list-transaction" */ './views/ListTransactions.vue'
      ),
  },
]
