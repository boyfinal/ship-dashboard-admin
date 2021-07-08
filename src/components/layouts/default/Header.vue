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
        <div class="navbar__header-name">{{ user.full_name }}</div>
        <img
          class="navbar__header-icon"
          src="@/assets/img/logout.svg"
          alt="icon"
        />
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
    return {}
  },
  methods: {},
}
</script>
