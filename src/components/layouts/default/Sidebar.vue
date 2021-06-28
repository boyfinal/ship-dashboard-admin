<template>
  <div class="site-menubar">
    <div class="site-menubar-body">
      <ul class="site-menu">
        <li
          v-for="(menu, i) in menus"
          class="site-menu-item"
          :class="{
            active: isActive(menu.route) || childrenNameRoute(menu.route.name),
          }"
          :key="i"
        >
          <router-link :to="handelRouter(menu)">
            <img class="site-menu-icon default" :src="menu.icon" />
            <img class="site-menu-icon active" :src="menu.iconActive" />
            <span class="site-menu-title" @click="menu.isOpen = !menu.isOpen">{{
              menu.title
            }}</span>
            <div class="icon-sub" @click="menu.isOpen = !menu.isOpen">
              <img
                :class="{ 'is-active': menu.isOpen }"
                class=""
                v-if="menu.sub"
                src="@/assets/img/dropdown.svg"
              />
            </div>
          </router-link>
          <div
            class="site-menu-sub"
            :class="{
              'has-sub': menu.isOpen,
            }"
            v-if="menu.sub"
          >
            <div
              class="site-menu-sub-item"
              v-for="(sub, j) in menu.sub"
              :key="j"
            >
              <router-link :to="sub.route" class="animsition-link">
                <span
                  :class="{
                    active:
                      isActive(sub.route) ||
                      isContainAlias(sub.alias) ||
                      childrenNameRoute(sub.title),
                  }"
                  class="site-menu-sub-title"
                  >{{ sub.title }}</span
                >
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>

<script>
import { isObject } from '@core/utils/type'

export default {
  name: 'Sidebar',
  props: {
    shop: {
      type: Object,
      default: () => {},
    },
    shops: {
      type: Array,
      default: () => [],
    },
    isSidebarOpen: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    validShops() {
      return this.shop && this.shops ? this.shops : []
    },
    shopName() {
      return this.shop.name
    },
    availableMenus() {
      return this.menus.filter((menu) => menu.disable !== true)
    },
  },
  data() {
    return {
      hoverIndex: -1,
      chooseShop: {
        icon: require('@assets/img/shopping-bag.svg'),
      },
      isActiveSub: false,
      activeSubIndex: 0,
      isactive: false,
      activeItem: '',
      menus: {
        q1: {
          title: 'Trang chủ',
          icon: require('@assets/img/HomeInactive.svg'),
          iconActive: require('@assets/img/Home.svg'),
          route: '/',
          class: '',
        },
        q2: {
          title: 'Đơn hàng',
          icon: require('@assets/img/OrderInactive.svg'),
          iconActive: require('@assets/img/Order.svg'),
          route: { name: 'packages' },
          class: '',
          isOpen: false,
          sub: [
            {
              route: '/packages',
              title: 'Quản lý đơn hàng',
              alias: ['/packages', '/packages/:id'],
            },
            {
              route: '/packages/claims',
              title: 'Đơn khiếu nại',
              alias: ['/packages/claims', '/packages/claims/:id'],
            },
          ],
        },
        q3: {
          title: 'Hóa đơn',
          icon: require('@assets/img/BillInactive.svg'),
          iconActive: require('@assets/img/Bill.svg'),
          route: '/bill',
          class: '',
        },
        q4: {
          title: 'Ví',
          icon: require('@assets/img/WalletInactive.svg'),
          iconActive: require('@assets/img/Wallet.svg'),
          route: '/wallet',
          class: '',
        },
        q5: {
          title: 'Cài đặt tài khoản',
          icon: require('@assets/img/SettingInactive.svg'),
          iconActive: require('@assets/img/Setting.svg'),
          route: { name: 'setting' },
          class: '',
          isOpen: false,
          sub: [
            {
              route: '/setting/account',
              title: 'Thông tin tài khoản',
            },
            {
              route: '',
              title: 'Danh sách hàng hóa',
            },
          ],
        },
      },
    }
  },

  methods: {
    isActive(route) {
      if (isObject(route)) {
        return this.$route.name === route.name
      }

      return this.$route.path === route || this.$route.fullPath === route
    },

    isContainAlias(alias) {
      if (!this.$route.matched || !this.$route.matched.length || !alias) {
        return false
      }

      for (let item of this.$route.matched) {
        if (alias.includes(item.path)) {
          return true
        }
      }
      return false
    },

    childrenNameRoute(title) {
      let fullPath = this.$route.fullPath
      if (title != null) {
        title = title.toLowerCase()
        if (fullPath.includes(title)) {
          return true
        }
      }
      return false
    },
    handelRouter(menu) {
      if (menu.sub) {
        return ''
      }
      return menu.route
    },
  },
}
</script>
