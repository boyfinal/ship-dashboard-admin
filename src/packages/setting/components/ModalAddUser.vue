<template>
  <div class="modal-add-user">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="row mb-20">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5">Tên:</label>
            <p-input
              placeholder="Họ và tên"
              v-model="user.full_name"
              @keyup.enter="handleCreate"
              :error="valider.error('full_name')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5">Quyền:</label>
            <select-role
              class="search-type mb-10"
              :class="{ 'input-valid': errorRole }"
              @selected="handleSelectRole"
              @unselected="handleRemoveRole"
              :optionSearch="listRole"
              :placeHolder="'Quyền'"
            />
            <span class="invalid-error" v-if="errorRole"
              >Quyền không được để trống</span
            >
          </div>
        </div>
        <div class="row mb-8">
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Tài khoản:</label
            >
            <p-input
              placeholder="Email/SĐT"
              v-model="user.email"
              @keyup.enter="handleCreate"
              :error="valider.error('email')"
            />
          </div>
          <div class="col-6">
            <label class="color-newtral-10 font-weight-600 mb-5"
              >Mật khẩu::</label
            >
            <p-input
              placeholder="Mật khẩu"
              type="password"
              hiddenPass="on"
              v-model="user.password"
              @keyup.enter="handleCreate"
              :error="valider.error('password')"
            />
          </div>
        </div>
      </template>

      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Bỏ qua
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleCreate"
              :loading="loading"
            >
              Tạo
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import valider from '@core/valider'
import { mapActions } from 'vuex'
import { CREATE_USER } from '../store/index'
import SelectRole from './SelectRole.vue'
import { ROLE } from '../constants'
export default {
  name: 'ModalAddUser',
  components: {
    SelectRole,
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
  },
  data() {
    return {
      user: {
        full_name: '',
        role: '',
        email: '',
        password: '',
      },
      loading: false,
      valider: null,
      listRole: ROLE,
      errorRole: false,
    }
  },
  created() {
    this.valider = valider.schema((y) => ({
      full_name: y.string().required('Tên không để trống'),
      role: y.string().required('Quyền không để trống'),
      email: y.string().required('Email không để trống'),
      password: y.string().required('Password không để trống'),
    }))
  },
  methods: {
    ...mapActions('setting', [CREATE_USER]),

    async handleCreate() {
      if (this.user.role == '') {
        this.errorRole = true
      }

      if (!this.valider.check(this.user)) {
        return
      }
      if (this.errorRole) {
        return
      }

      const data = {
        full_name: this.user.full_name.trim(),
        password: this.user.password.trim(),
        role: this.user.role,
      }

      if (this.user.email.includes('@')) {
        data.email = this.user.email.trim().toLowerCase()
      } else {
        data.phone_number = this.user.email.trim()
      }

      this.loading = true
      const res = await this.createUser(data)
      this.loading = false

      if (!res.success) {
        this.$toast.open({
          type: 'error',
          message: res.message.join(','),
          duration: 3000,
        })
        return
      }
      this.$emit('update:visible', false)
      this.$emit('init', true)
    },

    handleSelectRole(value) {
      this.user.role = value
      this.errorRole = false
    },

    handleRemoveRole() {
      this.user.role = ''
      this.errorRole = true
    },

    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function(val) {
        this.isVisible = val
        this.listRole = ROLE
      },
      deep: true,
    },
  },
}
</script>
