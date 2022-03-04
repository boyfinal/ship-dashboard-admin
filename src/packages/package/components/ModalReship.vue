<template>
  <p-modal :active="visible" @close="handleClose" :title="title">
    <div class="mb-16 form-group">
      <label class="form-label">Phí phát sinh:</label>
      <input
        v-model="amount"
        class="floating p-select form-control"
        placeholder="Phí reship"
        @change="formatAmount"
        @input="inputAmount"
      />
      <span class="invalid-error" v-if="validErrors.amount">
        {{ validErrors.amount }}
      </span>
    </div>

    <div class="form-group mb-16">
      <label class="form-label mb-10">Nội dung:</label>
      <textarea class="form-control" v-model="note"></textarea>
    </div>

    <template slot="footer">
      <div></div>
      <div>
        <p-button @click="handleClose" type="default">Huỷ</p-button>
        <p-button
          @click="submitHandle"
          class="ml-8"
          type="primary"
          :disabled="disableSubmit"
        >
          Reship
        </p-button>
      </div>
    </template>
  </p-modal>
</template>
<script>
export default {
  name: 'ModalReship',
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
  computed: {
    code() {
      return this.current && this.current.package_code
        ? this.current.package_code.code
        : ''
    },
    title() {
      return `Reship ${this.code}`
    },
    disableSubmit() {
      return Object.keys(this.validErrors).length > 0
    },
  },
  data() {
    return {
      amount: '',
      note: '',
      validErrors: {},
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },

    toNumber(amount) {
      amount = ('' + amount).trim()
      amount = amount.trim().replace(/[^0-9.,]/g, '')
      if (!amount) return 0

      amount = amount.replace(/,/g, '').replace(/^0+/g, '')
      const arr = amount.split('.')

      let number = arr[0]
      let decimal = arr[1]

      amount = decimal ? `${number}.${decimal}` : number

      if (decimal !== undefined && decimal.length >= 2) {
        amount = (Math.floor(parseFloat(amount) * 100) / 100).toFixed(2)
        decimal = amount.split('.')[1]
      }

      amount = decimal ? `${number}.${decimal}` : number
      return parseFloat(amount)
    },

    toPrice(amount) {
      amount = this.toNumber(amount)
      if (amount === 0) return ''

      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    formatAmount() {
      this.amount = this.toPrice(this.amount)
      this.validErrors = {}
    },

    submitHandle() {
      let amount = (this.amount || '0').trim()
      amount = parseFloat(amount.replace(/,/g, '')).toFixed(2)

      this.$emit('submit', {
        description: this.note,
        amount: parseFloat(amount),
      })

      this.note = ''
      this.amount = ''
      this.validErrors = {}
    },

    inputAmount() {
      this.validErrors = {}
      this.amount = this.amount.replace(/[^0-9.]/g, '')

      if (this.amount < 0) {
        this.validErrors.amount = 'Phí phát sinh phải >= 0'
      }

      const re = /[^0-9.,]/g
      const n = this.amount.split('.').length
      if (re.test(this.amount) || n > 2) {
        this.validErrors.amount = 'Phí phát sinh không đúng định dạng'
      }
    },
  },
  watch: {
    visible: function() {
      this.note = ''
      this.amount = ''
    },
  },
}
</script>
