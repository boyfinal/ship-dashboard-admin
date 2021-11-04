<template>
  <div class="modal-add-user">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <form @submit.prevent="handleUpdate">
          <div class="row mb-20">
            <div class="col-6">
              <label class="color-newtral-10 font-weight-600 mb-5"
                >Kiểu thanh toán:</label
              >
              <div>
                <label class="mr-5">
                  <input
                    type="radio"
                    name="payment_type"
                    value="0"
                    v-model="paymentType"
                  />
                  Trả trước
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment_type"
                    value="1"
                    v-model="paymentType"
                  />
                  Công nợ
                </label>
              </div>
            </div>
          </div>
          <div class="row mb-8" :class="{ disabled: paymentType == 0 }">
            <div class="col-6">
              <label class="color-newtral-10 font-weight-600 mb-5"
                >Hạn mức nợ tối đa ($):</label
              >
              <p-input
                type="number"
                name="debt_max_amount"
                v-model.number="user.debt_max_amount"
                min="0"
                :error="valider.error('debt_max_amount')"
              />
            </div>
            <div class="col-6">
              <label class="color-newtral-10 font-weight-600 mb-5"
                >Thời gian nợ tối đa (ngày):</label
              >
              <p-input
                type="number"
                min="0"
                name="debt_max_day"
                v-model.number="user.debt_max_day"
                :error="valider.error('debt_max_day')"
              />
            </div>
          </div>
        </form>
      </template>

      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Đóng
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleUpdate"
              :loading="loading"
            >
              Lưu
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import { parseInt } from 'lodash'
import { mapActions } from 'vuex'
import { UPDATE_USER_INFO } from '../store/index'
import valider from '@core/valider'

export default {
  name: 'ModalEditUser',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.valider = valider.schema((y) => ({
      debt_max_day: y
        .number()
        .typeError('Thời gian công nợ không hợp lệ')
        .integer('Thời gian công nợ không hợp lệ')
        .min(0, 'Thời gian công nợ không hợp lệ 0'),
      debt_max_amount: y
        .number()
        .typeError('Hạn mức công nợ không hợp lệ')
        .min(0, 'Hạn mức công nợ không hợp lệ 0'),
    }))
    this.valider.reset()
  },
  computed: {
    title() {
      return `Chinh sửa thông tin khách hàng: ${this.current.full_name}`
    },
  },
  data() {
    return {
      paymentType: 0,
      user: {
        debt_max_day: 0,
        debt_max_amount: 0,
      },
      loading: false,
      valider: null,
    }
  },
  methods: {
    ...mapActions('setting', { update: UPDATE_USER_INFO }),

    async handleUpdate() {
      if (this.loading || !this.current.id) return

      if (!this.valider.check(this.user)) {
        return
      }

      const payload = {
        id: this.current.id,
        debt_max_amount: parseFloat(this.user.debt_max_amount),
        debt_max_day: parseInt(this.user.debt_max_day),
      }

      this.loading = true
      const res = await this.update(payload)
      this.loading = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$emit('success', true)
      this.$toast.success('Chỉnh sửa thông tin công nợ thành công')
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
      },
      deep: true,
    },
    current: {
      handler: function(val) {
        const info = val.user_info || {}
        this.user.debt_max_day = parseInt(info.debt_max_day || 0)
        this.user.debt_max_amount = parseFloat(info.debt_max_amount || 0)
        this.paymentType = this.user.debt_max_amount > 0 ? 1 : 0
      },
      deep: true,
      immediate: true,
    },
    paymentType(val) {
      if (val == 0) {
        this.user.debt_max_day = 0
        this.user.debt_max_amount = 0
      }
    },
  },
}
</script>
<style lang="scss">
div.disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
