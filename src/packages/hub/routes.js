export const routes = [
  {
    path: '/hubs/search',
    name: 'hubs-search',
    meta: {
      title: 'Tra cứu đơn',
    },
    component: () => import(/* webpackChunkName: "hub" */ './views/Search.vue'),
  },
]
