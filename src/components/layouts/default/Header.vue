<template>
  <nav class="site-navbar" role="navigation">
    <div class="navbar__header">
      <div class="navbar__header-content">
        <img
          class="navbar__header-icon"
          src="@/assets/img/humbeger-menu.svg"
          alt="icon"
        />
        <div class="navbar__header-title">{{ handleTitle }}</div>
      </div>
      <div class="navbar__header-user d-flex">
        <div class="navbar__header-name" @click="toggleMenuUser">
          <span class="mr-2"
            >Xin chào, <b>{{ user.full_name }}</b></span
          >
          <img src="@/assets/img/dropdown.svg" />
        </div>
        <div
          class="dropdown-menu"
          :class="{ active: showUserMenu }"
          v-click-outside="hideMenuUser"
        >
          <div class="dropdown-content">
            <div class="dropdown-item">
              <img src="@/assets/img/user.svg" class="navbar__header-icon" />
              <a
                href="/profile"
                aria-current="page"
                class="nav-item nav-item active router-link-active"
                >Thông tin tài khoản</a
              >
            </div>
            <div class="dropdown-item">
              <img src="@/assets/img/logout.svg" class="navbar__header-icon" />
              <a href="/logout" class="nav-item">Đăng xuất</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  components: {},
  name: 'Header',
  props: {
    user: {
      type: Object,
      default: () => {},
    },
    isSidebarOpen: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {},
  created() {},
  computed: {
    handleTitle() {
      return this.$route.meta.title || ''
    },
  },
  data() {
    return {
      showUserMenu: false,
    }
  },
  methods: {
    toggleMenuUser() {
      this.showUserMenu = !this.showUserMenu
    },
    hideMenuUser() {
      this.showUserMenu = false
    },
  },
}
</script>
<style lang="scss">
.site-navbar .navbar__header-user {
  .navbar__header-name {
    cursor: pointer;

    span {
      font-weight: normal;
    }
  }

  .dropdown-menu {
    right: 0;
    left: unset;
    top: 57px;
    background: #ffffff;
    box-shadow: 0px 0px 2px rgb(40 41 61 / 4%), 0px 4px 8px rgb(96 97 112 / 16%);
    border-radius: 4;
    border: none;

    &.active {
      display: block;
    }

    .dropdown-item {
      padding: 10px 14px;
      display: flex;
      align-items: center;
    }

    a {
      color: #111212;
      padding: 0 13px;
      font-size: 14px;
      width: 100%;
    }
  }
}
</style>
