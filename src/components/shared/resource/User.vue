<template>
  <multiselect
    class="multiselect-custom"
    v-model="selected"
    :options="users"
    placeholder="Search user"
    :custom-label="customLabel"
    :loading="isLoading"
    @search-change="handleSearch"
    @select="handleSelect"
    @remove="handleRemove"
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
      type: [Number, String],
      default: 0,
    },
    filter: {
      type: Object,
      default: () => {},
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
        this.$toast.open({ type: 'error', message: response.errorMessage })
        return
      }

      this.users = response.users
      this.isLoading = false
    }, 500)
  },
  methods: {
    async fetchUsers(search = '') {
      this.isLoading = true
      const result = await api.fetchUsersByRole(
        Object.assign({}, this.filter, { search: search })
      )
      this.isLoading = false

      if (result && result.success) {
        // this.selected = this.value
        //   ? this.users.find(({ id }) => parseInt(this.value) === parseInt(id))
        //   : null
        // this.handleSelect(this.selected)
        return
      }

      this.$toast.open({ type: 'error', message: result.message })
    },

    customLabel({ username, email }) {
      return typeof username !== 'undefined' ? `${username} - ${email}` : ''
    },

    handleSelect(shop) {
      this.$emit('input', shop && shop.id ? shop.id : 0)
    },

    handleRemove() {
      this.$emit('input', 0)
    },
  },
}
</script>
