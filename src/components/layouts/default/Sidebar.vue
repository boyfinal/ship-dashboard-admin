<template>
  <div class="site-menubar">
    <div class="site-menubar-header"> </div>
    <div class="site-menubar-body">
      <ul class="site-menu">
        <li
          v-for="(menu, i) in menus"
          class="site-menu-item"
          :class="{
            active: isActive(menu.route) || childrenNameRoute(menu),
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
                v-if="menu.sub.length"
                src="@/assets/img/up-white.svg"
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
              :class="{
                active: isContainAlias(sub.alias),
              }"
            >
              <router-link :to="sub.route" class="animsition-link">
                <span
                  :class="{
                    active: isContainAlias(sub.alias),
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
          title: 'Quản lý ',
          icon: require('@assets/img/OrderInactive.svg'),
          iconActive: require('@assets/img/OrderActive.svg'),
          route: { name: 'packages' },
          class: '',
          isOpen: false,
          sub: [
            {
              route: '/packages',
              title: ' Đơn hàng',
              alias: ['/packages', '/packages/:id'],
            },
            {
              route: '/bills',
              title: 'Hóa đơn',
              alias: ['/bills', '/bills/:id'],
            },
            {
              route: '/transactions',
              title: 'Lịch sử giao dịch',
              alias: ['/transactions', '/transactions/:id'],
            },
            {
              route: '/claims',
              title: 'Khiếu nại',
              alias: ['/claims', '/claims/:id'],
            },
          ],
        },
        q2: {
          title: 'Vận chuyển',
          icon: require('@assets/img/car.svg'),
          iconActive: require('@assets/img/carActive.svg'),
          route: { name: 'deliver' },
          class: '',
          sub: [],
        },
        q3: {
          title: 'Kho',
          icon: require('@assets/img/warehouse.svg'),
          iconActive: require('@assets/img/warehouseActive.svg'),
          route: '/bill',
          class: '',
          isOpen: false,
          sub: [
            {
              route: '/packages',
              title: 'Danh sách kho',
              alias: [],
            },
            {
              route: '/packages/claims',
              title: 'Quét nhận hàng',
              alias: [],
            },
            {
              route: '/warehouse/check-package',
              title: 'Quét kiểm hàng',
              alias: ['/warehouse/check-package'],
            },
            {
              route: '/packages/claims',
              title: 'Kiện hàng',
              alias: [],
            },
            {
              route: '/packages/claims',
              title: 'Lô hàng',
              alias: [],
            },
          ],
        },
        q5: {
          title: 'Quản trị',
          icon: require('@assets/img/Setting.svg'),
          iconActive: require('@assets/img/SettingActive.svg'),
          route: { name: 'setting' },
          class: '',
          isOpen: false,
          sub: [
            {
              route: '/setting/account',
              title: 'Tài khoản',
              alias: [],
            },
            {
              route: '',
              title: 'Truy cập',
              alias: [],
            },
            {
              route: '',
              title: 'Bảng giá',
              alias: [],
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
      let path = this.$route.matched.map((element) => element.path).toString()
      if (title.sub.length > 0) {
        return title.sub.some((element) => element.alias.includes(path))
      }
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
<style lang="scss">
.animsition-link {
  position: relative;
  &:before {
    position: absolute;
    content: '';
    width: 210px;
    height: 36px;
    top: -7px;
    left: 0;
    margin-left: -18px;
  }
}
</style>
