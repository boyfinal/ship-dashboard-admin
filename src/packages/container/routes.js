export const routes = [
  {
    path: '/containers',
    name: 'list-container',
    meta: {
      title: 'Quản lý kiện hàng',
    },
    component: () =>
      import(
        /* webpackChunkName: "list-containers" */ './views/ListContainers.vue'
      ),
  },
]
