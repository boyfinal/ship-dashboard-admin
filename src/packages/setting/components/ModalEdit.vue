<template>
  <div class="modal-edit-user">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <form @submit.prevent="handleUpdate">
          <div class="row mb-20">
            <div class="col-6">
              <label class="color-newtral-10 mb-5">Khách hàng:</label>

              <p-input :disabled="true" :value="current.full_name" />
            </div>
            <div class="col-6">
              <label class="color-newtral-10 mb-5">Hạng:</label>

              <multiselect
                placeholder="Chọn hạng"
                v-model="type"
                label="text"
                track-by="value"
                :options="types"
              >
              </multiselect>
            </div>
          </div>
          <div class="row mb-20">
            <div class="col-6">
              <label class="color-newtral-10 mb-5">Kiểu thanh toán:</label>
              <div>
                <label
                  class="mr-5 font-weight-600"
                  :class="{ disabled: paymentType == 1 }"
                >
                  <input
                    type="radio"
                    name="payment_type"
                    value="0"
                    v-model="paymentType"
                  />
                  Trả trước
                </label>
                <label
                  class="font-weight-600"
                  :class="{ disabled: paymentType == 0 }"
                >
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
              <label class="color-newtral-10 mb-5"
                >Hạn mức nợ tối đa ($):</label
              >
              <multiselect
                placeholder="Chọn hạn mức"
                v-model="debt_max_amount"
                label="value"
                track-by="value"
                :options="debtLimit"
              >
              </multiselect>
              <!-- <p-input
                type="text"
                name="debt_max_amount"
                @input="onChangeAmount"
                :value="user.debt_max_amount"
                min="0"
                :error="valider.error('debt_max_amount')"
              /> -->
            </div>
            <div class="col-6">
              <label class="color-newtral-10 mb-5"
                >Thời gian nợ tối đa (ngày):</label
              >
              <multiselect
                placeholder="Chọn thời gian"
                v-model="debt_max_day"
                label="value"
                track-by="value"
                :options="dayLimit"
              >
              </multiselect>
              <!-- <p-input
                type="number"
                min="0"
                name="debt_max_day"
                v-model.number="user.debt_max_day"
                :error="valider.error('debt_max_day')"
              /> -->
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
import {
  USER_CLASS_PUBLIC,
  USER_CLASS_PRIORITY,
  USER_CLASS_PARTNER,
  DEBT_LIMIT,
  DAY_LIMIT,
} from '../constants'

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
    // this.valider = valider.schema((y) => ({
    //   debt_max_day: y
    //     .number()
    //     .typeError('Thời gian công nợ không hợp lệ')
    //     .integer('Thời gian công nợ không hợp lệ')
    //     .min(0, 'Thời gian công nợ không hợp lệ'),
    //   debt_max_amount: y
    //     .number()
    //     .typeError('Hạn mức công nợ không hợp lệ')
    //     .min(0, 'Hạn mức công nợ không hợp lệ'),
    // }))
    // this.valider.reset()
  },
  data() {
    return {
      title: 'Chỉnh sửa thông tin khách hàng',
      paymentType: 0,
      loading: false,
      valider: null,
      type: [
        {
          text: 'Public',
          value: USER_CLASS_PUBLIC,
        },
        {
          text: 'Priority',
          value: USER_CLASS_PRIORITY,
        },
        {
          text: 'Partner',
          value: USER_CLASS_PARTNER,
        },
      ].find((i) => {
        return i.value == this.current.class
      }),
      types: [
        {
          text: 'Public',
          value: USER_CLASS_PUBLIC,
        },
        {
          text: 'Priority',
          value: USER_CLASS_PRIORITY,
        },
        {
          text: 'Partner',
          value: USER_CLASS_PARTNER,
        },
      ],
      debtLimit: DEBT_LIMIT,
      dayLimit: DAY_LIMIT,
      debt_max_amount: 0,
      debt_max_day: 0,
    }
  },
  methods: {
    ...mapActions('setting', { update: UPDATE_USER_INFO }),

    async handleUpdate() {
      if (this.loading || !this.current.id) return

      const payload = {
        id: this.current.id,
        debt_max_amount: parseFloat(this.debt_max_amount.value),
        debt_max_day: parseInt(this.debt_max_day.value),
        class: parseInt(this.type.value),
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
        this.paymentType = info.debt_max_amount > 0 ? 1 : 0

        if (this.paymentType == 1) {
          this.debt_max_amount = info.debt_max_amount
            ? this.debtLimit.find((i) => {
                return i.value == info.debt_max_amount
              })
            : this.debtLimit[0]
          this.debt_max_day = info.debt_max_day
            ? this.dayLimit.find((i) => {
                return i.value == info.debt_max_day
              })
            : this.dayLimit[0]
        }
      },
      deep: true,
      immediate: true,
    },
    paymentType(val) {
      if (val == 0) {
        this.debt_max_day = 0
        this.debt_max_amount = 0
      }
      if (val == 1) {
        const info = val.user_info || {}

        this.debt_max_amount = info.debt_max_amount
          ? this.debtLimit.find((i) => {
              return i.value == info.debt_max_amount
            })
          : this.debtLimit[0]
        this.debt_max_day = info.debt_max_day
          ? this.dayLimit.find((i) => {
              return i.value == info.debt_max_day
            })
          : this.dayLimit[0]
      }
    },
  },
}
</script>
<style lang="scss">
.modal-edit-user {
  div.disabled {
    pointer-events: none;
    opacity: 0.4;
  }
  label.disabled {
    color: #898a8a;
  }
  input,
  .multiselect__single {
    font-weight: 600;
  }
}
</style>
