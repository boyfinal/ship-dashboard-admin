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
  {
    path: '/statistics-claims',
    name: 'statistics-claims',
    meta: {
      title: 'Khiếu nại',
    },
    component: () => import(/* webpackChunkName: "package" */ './views/Claim'),
  },
]
