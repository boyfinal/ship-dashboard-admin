export const routes = [
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      title: 'Thống kê',
    },
    component: () =>
      import(/* webpackChunkName: "package" */ './views/Statitic'),
  },
]
