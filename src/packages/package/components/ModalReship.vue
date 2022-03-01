<template>
  <p-modal :active="visible" @close="handleClose" :title="title">
    <div class="mb-16 form-group">
      <label class="form-label">Phí phát sinh:</label>
      <input
        v-model="amount"
        class="floating p-select form-control"
        placeholder="Phí reship"
        @change="formatAmount"
      />
    </div>

    <div class="form-group mb-16">
      <label class="form-label mb-10">Nội dung:</label>
      <textarea class="form-control" v-model="note"></textarea>
    </div>

    <template slot="footer">
      <div></div>
      <div>
        <p-button @click="handleClose" type="default">Huỷ</p-button>
        <p-button @click="submitHandle" class="ml-8" type="primary">
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
  },
  data() {
    return {
      amount: '',
      note: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },

    formatAmount() {
      let amount = this.amount.trim().replace(/[^0-9.,]/g, '')
      if (!amount) {
        this.amount = ''
        return
      }

      amount = amount.replace(/,/g, '').replace(/^0+/g, '')
      const arr = amount.split('.')

      let number = arr[0]
      let decimal = arr[1]

      amount = decimal ? `${number}.${decimal}` : number

      if (decimal !== undefined && decimal.length >= 2) {
        amount = (Math.floor(parseFloat(amount) * 100) / 100).toFixed(2)
        decimal = amount.split('.')[1]
      }

      number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      amount = decimal ? `${number}.${decimal}` : number

      this.amount = amount
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
    },
  },
}
</script>
