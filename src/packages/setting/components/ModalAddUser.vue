<template>
  <div class="modal-add-user">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="row mb-16">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5">Tên:</label>
            <p-input
              placeholder="Nhập tên"
              v-model="user.full_name"
              @keyup.enter="handleCreate"
              :error="valider.error('full_name')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >SlackID:</label
            >
            <p-input
              placeholder="Nhập Slack ID"
              v-model="user.slack_id"
              @keyup.enter="handleCreate"
            />
          </div>
        </div>
        <div class="row mb-16">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Tài khoản:</label
            >
            <p-input
              placeholder="Nhập tài khoản"
              v-model="user.email"
              @keyup.enter="handleCreate"
              :error="valider.error('email')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Mật khẩu:</label
            >
            <p-input
              placeholder="Nhập mật khẩu"
              type="password"
              hiddenPass="on"
              v-model="user.password"
              @keyup.enter="handleCreate"
              :error="valider.error('password')"
            />
          </div>
        </div>

        <div class="row mb-16">
          <div class="col-12">
            <label class="color-newtral-10 font-weight-600 mb-5">Quyền:</label>
            <select-role
              class="search-type mb-10"
              :class="{ 'input-valid': errorRole }"
              @selected="handleSelectRole"
              @unselected="handleRemoveRole"
              :optionSearch="listRole"
              :placeHolder="'Quyền'"
              :item="user"
            />
            <span class="invalid-error" v-if="errorRole"
              >Quyền không được để trống</span
            >
          </div>
        </div>

        <div class="row mb-16" v-if="isRoleWarehouse">
          <div class="col-12">
            <label class="color-newtral-10 font-weight-600 mb-5">Kho:</label>
            <select-role
              class="search-type mb-10"
              :class="{ 'input-valid': errorWarehouse }"
              @selected="handleSelectWarehouse"
              @unselected="handleRemoveWarehouse"
              :optionSearch="displayWarehouses"
              :placeHolder="'Chọn kho'"
              :item="user"
            />
            <span class="invalid-error" v-if="errorWarehouse"
              >Kho không được để trống</span
            >
          </div>
        </div>

        <div class="row mb-16" v-if="isRoleHub">
          <div class="col-12">
            <label class="color-newtral-10 font-weight-600 mb-5">Hub:</label>
            <select-role
              class="search-type mb-10"
              :class="{ 'input-valid': errorHub }"
              @selected="handleSelectWarehouse"
              @unselected="handleRemoveWarehouse"
              :optionSearch="hubs"
              :placeHolder="'Chọn hub'"
              :item="user"
            />
            <span class="invalid-error" v-if="errorHub"
              >Hub không được để trống</span
            >
          </div>
        </div>

        <div class="row mb-16" v-if="isRoleSupport">
          <div class="col-12 mb-10">
            <select-customer
              class="search-type"
              :class="{ 'input-valid': errorCustomer }"
              @selected="handleSelectCustomer"
              @unselected="unselectedCustomer"
              :optionSearch="listUsers"
              :placeHolder="'Thêm khách hàng'"
              :item="user"
            />
            <span class="custom-label">Thêm khách hàng</span>
            <span class="invalid-error" v-if="errorCustomer"
              >Khách hàng không được để trống</span
            >
          </div>
        </div>
      </template>

      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Huỷ
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleCreate"
              :loading="loading"
            >
              {{ data.id ? 'Sửa' : 'Tạo' }}
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import valider from '@core/valider'
import { CREATE_USER } from '../store/index'
import SelectRole from './SelectRole.vue'
import SelectCustomer from './SelectCustomer.vue'
import { ROLE_SUPPORT, ROLE_WAREHOUSE, ROLE_HUB } from '@core/constants'

import { ROLE, HUB_TYPE, WAREHOUSE_TYPE } from '../constants'
import api from '@/packages/shared/api'

export default {
  name: 'ModalAddUser',
  components: {
    SelectRole,
    SelectCustomer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Thêm quản lý',
    },
    data: {
      type: Object,
      default: () => {},
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isRoleHub() {
      return this.user.role == ROLE_HUB
    },
    isRoleSupport() {
      return this.user.role == ROLE_SUPPORT
    },
    isRoleWarehouse() {
      return this.user.role == ROLE_WAREHOUSE
    },
    displayWarehouses() {
      if (!this.isRoleWarehouse) return []

      return this.warehouses
        .filter(({ type }) => type == WAREHOUSE_TYPE)
        .map(({ id, name }) => ({ key: id, name }))
    },
    hubs() {
      if (!this.isRoleHub) return []

      return this.warehouses
        .filter(({ type }) => type == HUB_TYPE)
        .map(({ id, name }) => ({ key: id, name }))
    },
  },

  data() {
    return {
      user: {
        full_name: '',
        role: '',
        email: '',
        password: '',
        warehouse_id: 0,
        customer_id: [],
        slack_id: '',
      },
      listUsers: [],
      loading: false,
      valider: null,
      listRole: ROLE,
      errorRole: false,
      errorWarehouse: false,
      errorCustomer: false,
      errorHub: false,
    }
  },

  created() {
    this.valider = valider.schema((y) => ({
      full_name: y.string().required('Tên không để trống'),
      role: y.string().required('Quyền không để trống'),
      email: y.string().required('Email không để trống'),
      password: this.data.id
        ? ''
        : y.string().required('Password không để trống'),
    }))
    this.fetchCustomer()
  },

  methods: {
    ...mapActions('setting', [CREATE_USER]),

    async fetchCustomer() {
      let req = {
        role: 'customer',
        search: '',
        not_limit: true,
        status: 1,
        tester: this.$route.query.tester
          ? parseInt(this.$route.query.tester)
          : 0,
      }
      const result = await api.fetchUsersByRole(req)
      if (result && result.errorMessage) {
        this.users = []
        return
      }

      this.listUsers = result.users.map((x) => ({
        key: x.id,
        name: x.full_name + ' - ' + (x.email ? x.email : x.phone_number),
        full_name: x.full_name,
      }))
    },

    async handleCreate() {
      if (!this.user.role) {
        this.errorRole = true
      }

      if (this.isRoleSupport && this.user.customer_id.length < 1) {
        this.errorCustomer = true
      }

      if (this.isRoleWarehouse && this.user.warehouse_id < 1) {
        this.errorWarehouse = true
      }

      if (this.isRoleHub && this.user.warehouse_id < 1) {
        this.errorHub = true
      }

      if (!this.valider.check(this.user)) {
        return
      }

      if (
        this.errorRole ||
        this.errorWarehouse ||
        this.errorCustomer ||
        this.errorHub
      ) {
        return
      }

      const payload = {
        full_name: this.user.full_name.trim(),
        password: this.user.password ? this.user.password.trim() : '',
        role: this.user.role,
        slack_id: this.user.slack_id,
        customer_id: this.user.customer_id,
      }

      if (this.user.email.includes('@')) {
        payload.email = this.user.email.trim().toLowerCase()
      } else {
        payload.phone_number = this.user.email.trim()
      }

      if (payload.email == this.data.email) {
        payload.email = ''
      }

      if (payload.phone_number == this.data.phone_number) {
        payload.phone_number = ''
      }

      if (payload.slack_id == this.data.slack_id) {
        payload.slack_id = ''
      }

      if (this.user.role == ROLE_WAREHOUSE || this.user.role == ROLE_HUB) {
        payload.warehouse_id = this.user.warehouse_id
      }

      if (this.user.id > 0) {
        payload.id = this.user.id
      }

      this.loading = true
      const res = await this.createUser(payload)
      this.loading = false

      if (!res.success) {
        const message = Array.isArray(res.message)
          ? res.message.join(',')
          : res.message
        this.$toast.error(message, { duration: 3000 })
        return
      }

      this.$emit('update:visible', false)
      this.$emit('init', true)
      this.$toast.success('Thêm thành công', { duration: 3000 })
    },

    handleSelectRole(value) {
      this.$set(this.user, 'role', value)
      this.$set(this.user, 'warehouse_id', '')
      this.$set(this.user, 'customer_id', [])
      this.errorRole = false
    },

    handleRemoveRole() {
      this.$set(this.user, 'role', '')
      this.errorRole = true
    },

    handleSelectWarehouse(value) {
      this.$set(this.user, 'warehouse_id', value)
      this.errorWarehouse = false
      this.errorHub = false
    },

    handleRemoveWarehouse() {
      this.$set(this.user, 'warehouse_id', 0)
      this.errorWarehouse = true
      this.errorHub = true
    },

    handleSelectCustomer(value) {
      this.user.customer_id.push(value)
      this.errorCustomer = false
    },

    unselectedCustomer(id) {
      const index = this.user.customer_id.indexOf(id)
      if (index > -1) {
        this.user.customer_id.splice(index, 1)
      }
      if (this.user.customer_id.length < 1) {
        this.errorCustomer = true
      }
    },

    handleClose() {
      this.valider.errors = null
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function () {
        if (this.visible) {
          this.user = Object.assign({}, this.data)
        }
        this.listRole = ROLE
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
