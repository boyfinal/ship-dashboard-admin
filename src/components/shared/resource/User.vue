<template>
  <multiselect
    class="multiselect-custom"
    v-model="selected"
    :options="users"
    :placeholder="label"
    :custom-label="customLabel"
    :loading="isLoading"
    @search-change="fetchUsers"
    @select="handleSelect"
    @remove="handleRemove"
    :emitID="emitID"
  >
  </multiselect>
</template>

<script>
import debounce from 'lodash/debounce'
import api from '@/packages/shared/api'

export default {
  name: 'ResourceUser',
  props: {
    value: {
      type: [Number, String, Object],
      default: 0,
    },
    filter: {
      type: Object,
      default: () => {},
    },
    label: {
      type: String,
      default: 'Search user',
    },
    emitID: {
      type: Boolean,
      default: true,
    },
    search: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selected: null,
      isLoading: false,
      users: [],
    }
  },
  mounted() {
    if (!this.shops || !this.shops.length) {
      this.handleSearch()
    }
  },
  created() {
    this.handleSearch = debounce(async function(search = '') {
      this.isLoading = true
      let response = await api.fetchUsersByRole(
        Object.assign({}, this.filter, { search: search })
      )
      if (response && response.errorMessage) {
        this.users = []
        return
      }

      this.users = response.users
      this.isLoading = false
      this.selected = this.users.filter((x) => x.email == this.search)
    }, 500)
  },
  methods: {
    async fetchUsers(search = '') {
      this.isLoading = true
      const result = await api.fetchUsersByRole(
        Object.assign({}, this.filter, { search: search })
      )
      this.isLoading = false

      if (result && result.errorMessage) {
        this.users = []
        return
      }
      // if (this.filter.code) {
      //   this.selected = result.users ? result.users[0] : ''
      //   this.handleSelect(this.selected)
      // }
      this.users = result.users
    },

    customLabel({ full_name, email, phone_number }) {
      return email !== ''
        ? `${full_name} - ${email}`
        : `${full_name} - ${phone_number}`
    },

    handleSelect(user) {
      if (this.emitID) {
        this.$emit('input', user && user.id ? user.id : 0)
        return
      }
      this.$emit('input', user)
    },

    handleRemove() {
      if (this.emitID) {
        this.$emit('input', 0)
        return
      }
      this.$emit('input', null)
    },
  },
  // watch: {
  //   filter: {
  //     handler: function() {
  //       this.fetchUsers()
  //     },
  //     deep: true,
  //   },
  // },
}
</script>
