export const routes = [
  {
    path: '/packages/claims',
    name: 'list-claim',
    meta: {
      title: 'Khiếu nại',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/ListClaim.vue'),
  },
  {
    path: '/packages/claims/:id',
    name: 'claim-detail',
    meta: {
      title: 'Chi tiết khiếu nại',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/ClaimDetail.vue'),
  },
]
