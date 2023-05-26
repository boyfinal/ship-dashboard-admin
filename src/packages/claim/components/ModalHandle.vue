<template>
  <p-modal
    class="modal-handle-ticket"
    :active="visible"
    title="Xử lý khiếu nại"
    @close="handleClose"
  >
    <div class="page-content">
      <div class="menu_content">
        <div class="page-content_drag card2">
          <div class="form-group">
            <label class="text-bold mb-5">Hướng xử lý:</label>
            <select v-model="type" class="form-control">
              <option :value="item.id" v-for="item in types" :key="item.id">{{
                item.name
              }}</option>
            </select>
            <span class="invalid-error" v-if="errorType">{{ errorType }}</span>
          </div>
          <div class="form-group">
            <label class="text-bold mb-5">Số tiền thêm:</label>
            <input
              type="text"
              class="form-control"
              :value="extra_amount"
              @input="onChangeExtraAmount"
              :disabled="isExtraAmountDisable"
            />
            <span class="invalid-error" v-if="errorExtraAmount">{{
              errorExtraAmount
            }}</span>
          </div>
          <div class="form-group">
            <label class="text-bold mb-5">Số tiền hoàn:</label>
            <input
              type="text"
              class="form-control"
              :value="refund_amount"
              @input="onChangeRefundAmount"
              :disabled="isRefundAmountDisable"
            />
            <span class="invalid-error" v-if="errorRefundAmount">{{
              errorRefundAmount
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div>
        <span style="margin-bottom: 2px">
          <p-svg name="InfoCircle"></p-svg>
        </span>
        <b>Lưu ý:</b> (<span style="color: red">*</span>)
        <i>Là các trường bắt buộc nhập.</i>
      </div>
      <div class="d-flex">
        <div>
          <p-button @click="handleClose" type="default"> Hủy </p-button>
        </div>
        <div class="ml-7">
          <p-button
            type="info"
            @click="confirmSubmitHandle"
            :loading="isSubmitting"
            :disabled="isButtonDisable"
          >
            Xử lý
          </p-button>
        </div>
      </div>
    </template>
  </p-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { PROCESS_CLAIM } from '../store'
import { formatAmount, amountToNumber } from '@core/utils/formatter'
import {
  CLAIM_TYPES,
  CLAIM_TYPE_DEFAULT,
  CLAIM_TYPE_RESHIP,
  CLAIM_TYPE_REFUND,
} from '../constants'

export default {
  name: 'ModalHandle',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    claim: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isButtonDisable() {
      return (
        this.errorType != '' ||
        this.errorExtraAmount != '' ||
        this.errorRefundAmount != ''
      )
    },
    isExtraAmountDisable() {
      return this.type != CLAIM_TYPE_RESHIP || !!this.refund_amount
    },
    isRefundAmountDisable() {
      return !(
        this.type == CLAIM_TYPE_REFUND ||
        (this.type == CLAIM_TYPE_RESHIP && !this.extra_amount)
      )
    },
  },
  data() {
    return {
      isVisibleConfirmDelete: false,
      isSubmitting: false,
      types: CLAIM_TYPES,
      type: 1,
      extra_amount: '',
      refund_amount: '',
      errorType: '',
      errorExtraAmount: '',
      errorRefundAmount: '',
    }
  },
  methods: {
    ...mapActions('claim', {
      processClaim: PROCESS_CLAIM,
    }),
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleAction() {
      this.$emit('action')
    },
    onChangeExtraAmount(e) {
      try {
        this.errorExtraAmount = ''
        this.extra_amount = formatAmount(e.target.value)
        e.target.value = this.extra_amount
      } catch {
        this.extra_amount = e.target.value
        this.errorExtraAmount = 'Số tiền không hợp lệ!'
      }
    },
    onChangeRefundAmount(e) {
      try {
        this.errorRefundAmount = ''
        this.refund_amount = formatAmount(e.target.value)
        e.target.value = this.refund_amount
      } catch {
        this.refund_amount = e.target.value
        this.errorRefundAmount = 'Số tiền không hợp lệ!'
      }
    },
    confirmSubmitHandle() {
      this.$dialog.confirm({
        title: 'Bạn có chắc chắn thông tin nhập là đúng?',
        onConfirm: () => this.submitHandle(),
      })
    },
    async submitHandle() {
      if (this.isSubmitting || !this.claim.id) return

      const payload = {
        id: this.claim.id,
        type: 0,
        extra_amount: 0,
        refund_amount: 0,
      }

      payload.type = this.type
      if (this.types.every(({ id }) => this.type != id)) {
        this.$toast.error('Hướng sử lý không hợp lệ!')
        return
      }

      try {
        payload.extra_amount = amountToNumber(this.extra_amount)
      } catch {
        this.errorExtraAmount = 'Số tiền không hợp lệ!'
        return
      }

      try {
        payload.refund_amount = amountToNumber(this.refund_amount)
      } catch {
        this.errorRefundAmount = 'Số tiền không hợp lệ!'
        return
      }

      if (payload.type == CLAIM_TYPE_REFUND && payload.refund_amount <= 0) {
        this.errorRefundAmount = 'Số tiền hoàn > $0'
        return
      }

      const res = await this.processClaim(payload)
      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$emit('success', res)
      this.$toast.success('Xử lý khiếu nại thành công!')
      this.handleClose()
    },
  },
  watch: {
    type: function (val) {
      this.errorType = ''
      if (val != CLAIM_TYPE_DEFAULT) return

      this.extra_amount = ''
      this.refund_amount = ''
      this.errorExtraAmount = ''
      this.errorRefundAmount = ''
    },
  },
}
</script>
