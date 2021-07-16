<template>
  <multiselect
    class="multiselect-custom"
    v-model="selected"
    :options="users"
    :placeholder="label"
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
    label: {
      type: String,
      default: 'Search user',
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
        return
      }

      this.$toast.open({ type: 'error', message: result.message })
    },

    customLabel({ full_name, email, phone_number }) {
      return typeof email !== 'undefined'
        ? `${full_name} - ${email}`
        : `${full_name} - ${phone_number}`
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
