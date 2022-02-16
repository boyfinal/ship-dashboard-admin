<template>
  <div class="site-menubar">
    <div class="site-menubar-header">
      <span class="logo-header">
        <p-svg name="logo"></p-svg>
      </span>
    </div>
    <div class="site-menubar-body">
      <ul class="site-menu">
        <li
          v-for="(menu, i) in availableMenus"
          class="site-menu-item"
          :class="{
            active: isActive(menu.route) || childrenNameRoute(menu),
          }"
          :key="i"
        >
          <router-link :to="handelRouter(menu)">
            <span class="site-menu-icon">
              <p-svg :name="menu.icon"></p-svg>
            </span>
            <span class="site-menu-title" @click="menu.isOpen = !menu.isOpen">{{
              menu.title
            }}</span>
            <div class="icon-sub" @click="menu.isOpen = !menu.isOpen">
              <p-svg
                :class="{ 'is-active': menu.isOpen }"
                name="up-white"
              ></p-svg>
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
              v-for="(sub, j) in availableMenuSub(menu.sub)"
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
        icon: 'shopping-bag',
      },
      isActiveSub: false,
      activeSubIndex: 0,
      isactive: false,
      activeItem: '',
      menus: [
        {
          title: 'Quản lý ',
          icon: 'OrderInactive',
          iconActive: 'OrderActive',
          route: { name: 'packages' },
          class: '',
          isOpen: false,
          disable: this.$isWarehouse(),
          sub: [
            {
              route: '/packages',
              title: ' Đơn hàng',
              alias: ['/packages', '/packages/:id'],
            },
            {
              route: '/bills',
              title: 'Hóa đơn',
              alias: ['/bills', '/bills/:code'],
            },
            {
              route: '/transactions',
              title: 'Thanh toán ',
              alias: ['/transactions', '/transactions/:id'],
            },
            {
              route: '/debt',
              title: 'Người dùng',
              alias: ['/debt'],
            },
            {
              route: '/claims',
              title: 'Khiếu nại',
              alias: ['/claims', '/claims/:id'],
            },
          ],
        },
        // {
        //   title: 'Vận chuyển',
        //   icon: 'car',
        //   iconActive: 'carActive',
        //   route: { name: 'deliver' },
        //   class: '',
        //   sub: [],
        // },
        {
          title: 'Kho',
          icon: 'warehouse',
          iconActive: 'warehouseActive',
          route: '/bill',
          class: '',
          isOpen: false,
          disable: this.$isSupport(),
          sub: [
            {
              route: '/warehouse',
              title: 'Tra cứu đơn',
              alias: ['/warehouse'],
              disable: this.$isAccountant(),
            },
            {
              route: '/warehouse/scan-in',
              title: 'Quét nhận hàng',
              alias: ['/warehouse/scan-in'],
            },
            {
              route: '/warehouse/check-package',
              title: 'Dán nhãn',
              alias: ['/warehouse/check-package'],
              disable: this.$isAccountant(),
            },
            {
              route: '/containers',
              title: 'Tạo kiện hàng',
              alias: ['/containers', '/containers/:code'],
            },
            {
              route: '/shipments',
              title: 'Tạo lô hàng',
              alias: ['/shipments', '/shipments/:id'],
            },
          ],
        },
        {
          title: 'Hub',
          icon: 'warehouse',
          iconActive: 'warehouseActive',
          route: '#',
          class: '',
          isOpen: false,
          disable: this.$isSupport(),
          sub: [
            {
              route: '/packages',
              title: 'Tra cứu đơn',
              alias: ['/packages'],
            },
            {
              route: '/hub/import',
              title: 'Quét nhập hub',
              alias: ['/hub/import'],
            },
            {
              route: '/packages',
              title: 'Quét xuất hub',
              alias: ['/packages'],
            },
          ],
        },
        {
          title: 'Quản trị',
          icon: 'Setting',
          iconActive: 'SettingActive',
          route: { name: 'setting' },
          class: '',
          isOpen: false,
          disable: this.$isSupport() || this.$isWarehouse(),
          sub: [
            {
              route: '/account',
              title: 'Tài khoản',
              alias: ['/account'],
              disable: this.$isAccountant(),
            },
            {
              route: '',
              title: 'Truy cập',
              alias: [],
              disable: this.$isAccountant(),
            },
            {
              route: '/prices',
              title: 'Bảng giá',
              alias: ['/prices'],
            },
          ],
        },
      ],
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

    availableMenuSub(sub) {
      return sub.filter((item) => item.disable !== true)
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
