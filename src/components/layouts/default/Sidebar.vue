<template>
  <div class="site-menubar" @mouseover="onHover()" @mouseleave="onOut()">
    <div class="site-menubar-header">
      <div class="logo-header">
        <p-svg name="logo"></p-svg>
      </div>
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
          disable: this.$isWarehouse() || this.$isHub(),
          sub: [
            {
              route: '/statistics',
              title: ' Thống kê',
              alias: ['/statistics'],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isHub() ||
                this.$isSupportLeader() ||
                this.$isWarehouse(),
            },
            {
              route: '/packages',
              title: ' Đơn hàng',
              alias: ['/packages', '/packages/:id'],
            },
            {
              route: '/packages/return',
              title: ' Đơn hàng trả về',
              alias: ['/packages/return'],
              disable: this.$isSupportLeader(),
            },
            {
              route: '/claims',
              title: 'Khiếu nại',
              alias: ['/claims', '/claims/:id'],
            },
            {
              route: '/debt',
              title: 'Tài chính',
              alias: ['/bills', '/bills/:code', '/debt'],
              disable: this.$isSupportLeader(),
            },
            {
              route: '/transactions',
              title: 'Topup',
              alias: ['/transactions', '/transactions/:id'],
              disable: this.$isSupportLeader(),
            },
            {
              route: '/notify/email',
              title: 'Thông báo',
              alias: ['/notify/email'],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isWarehouse() ||
                this.$isHub() ||
                this.$isSupportLeader(),
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
          disable: this.$isSupport() || this.$isHub(),
          sub: [
            {
              route: '/warehouse',
              title: 'Tra cứu đơn',
              alias: ['/warehouse'],
              disable:
                this.$isAccountant() || this.$isSupport() || this.$isHub(),
            },
            {
              route: '/warehouse/scan-in',
              title: 'Quét nhận hàng',
              alias: ['/warehouse/scan-in'],
              disable: this.$isSupportLeader(),
            },
            {
              route: '/warehouse/check-package',
              title: 'Dán nhãn',
              alias: ['/warehouse/check-package'],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isHub() ||
                this.$isSupportLeader(),
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
          disable:
            this.$isSupport() ||
            this.$isAccountant() ||
            this.$isWarehouse() ||
            this.$isSupportLeader(),
          sub: [
            {
              route: '/hubs/search',
              title: 'Tra cứu đơn',
              alias: ['/hubs/search'],
              disable:
                this.$isSupport() ||
                this.$isSupportLeader() ||
                this.$isAccountant() ||
                this.$isWarehouse(),
            },
            {
              route: '/hub/import',
              title: 'Quét nhập',
              alias: ['/hub/import'],
              disable:
                this.$isSupport() ||
                this.$isSupportLeader() ||
                this.$isAccountant() ||
                this.$isWarehouse(),
            },
            {
              route: '/hub/export',
              title: 'Quét xuất',
              alias: ['/hub/export'],
              disable:
                this.$isSupport() ||
                this.$isSupportLeader() ||
                this.$isAccountant() ||
                this.$isWarehouse(),
            },
            {
              route: '/hub/return',
              title: 'Hàng return',
              alias: ['/hub/return'],
              disable:
                this.$isSupport() ||
                this.$isSupportLeader() ||
                this.$isAccountant() ||
                this.$isWarehouse(),
            },
            {
              route: '/hub/reship',
              title: 'Hàng reship',
              alias: ['/hub/reship'],
              disable:
                this.$isSupport() ||
                this.$isSupportLeader() ||
                this.$isAccountant() ||
                this.$isWarehouse(),
            },
          ],
        },
        {
          title: 'Quản trị',
          icon: 'setting',
          iconActive: 'SettingActive',
          route: { name: 'setting' },
          class: '',
          isOpen: false,
          disable:
            this.$isSupport() ||
            this.$isWarehouse() ||
            this.$isHub() ||
            this.$isSupportLeader(),
          sub: [
            {
              route: '/account',
              title: 'Tài khoản admin',
              alias: ['/account'],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isWarehouse() ||
                this.$isHub() ||
                this.$isSupportLeader(),
            },
            {
              route: '/user',
              title: 'Tài khoản khách hàng',
              alias: ['/user', '/user/:id'],
              disable: this.$isAccountant(),
            },
            {
              route: '',
              title: 'Truy cập',
              alias: [],
              disable:
                this.$isAccountant() ||
                this.$isSupport() ||
                this.$isWarehouse() ||
                this.$isHub() ||
                this.$isSupportLeader(),
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
    onHover() {
      this.$emit('onHoverSideBar')
    },
    onOut() {
      this.$emit('onOutSideBar')
      if (!this.isSidebarOpen) {
        this.menus = this.menus.map((obj) =>
          obj.isOpen == true ? { ...obj, isOpen: false } : obj
        )
      }
    },
  },
  watch: {
    isSidebarOpen: function (value) {
      if (!value) {
        this.menus = this.menus.map((obj) =>
          obj.isOpen == true ? { ...obj, isOpen: false } : obj
        )
      }
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
