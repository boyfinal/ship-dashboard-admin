<template>
  <div class="animsition dashboard site-menubar-unfold">
    <p-header :user="user" />
    <p-sidebar />

    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import '@assets/scss/main.scss'
import '@assets/fonts/material-design/material-design.min.css'
import '@assets/fonts/web-icons/web-icons.min.css'
import PHeader from './Header'
import PSidebar from './Sidebar'
import { GET_USER } from '../../../packages/shared/store'

export default {
  name: 'Version2',
  components: {
    PHeader,
    PSidebar,
  },
  computed: {
    ...mapState('shared', {
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      isSidebarOpen: true,
      isTicketOpen: false,
    }
  },
  mounted() {},
  created() {
    this.init()
  },
  methods: {
    ...mapActions('shared', [GET_USER]),
    async init() {
      await this.getUser()
    },
  },
}
</script>
