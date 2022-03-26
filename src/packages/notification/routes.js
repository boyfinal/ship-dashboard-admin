import { lazyLoadView } from '@core/router/helpers'

export const routes = [
  {
    path: '/notification',
    name: 'notification',
    meta: {
      title: 'Thông báo',
    },
    component: () =>
      lazyLoadView(
        import(/* webpackChunkName: "orders" */ './views/Notification')
      ),
  },
]
