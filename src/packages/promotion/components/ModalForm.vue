<template>
  <p-modal :active="visible" :title="title" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <div class="mb-20">
          <label for="">Name: *</label>
          <p-input v-model="name" :error="errors.name" />
        </div>
        <div class="mb-20">
          <label for="">Description:</label>
          <textarea v-model="description" class="form-control"></textarea>
        </div>
        <div class="mb-20">
          <label for=""
            >File excel prices:
            <a :href="templatePrice" target="_blank">Demo templates</a></label
          >
          <input
            type="file"
            class="form-control"
            multiple="false"
            accept=".csv,.xlsx,.xls,.xlsm"
            @change="onchangePrice"
          />
          <span class="invalid-error" v-if="errors.file_price">{{
            errors.file_price
          }}</span>
        </div>
        <div class="mb-20">
          <label for=""
            >File excel weights:
            <a :href="templateWeight" target="_blank">Demo templates</a></label
          >
          <input
            type="file"
            class="form-control"
            multiple="false"
            accept=".csv,.xlsx,.xls,.xlsm"
            @change="onchangeWeight"
          />
          <span class="invalid-error" v-if="errors.file_weight">{{
            errors.file_weight
          }}</span>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="primary" @click="submitHandle">Lưu</p-button>
        <p-button type="default" @click="handleClose">Đóng</p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import api from '../api'

export default {
  name: 'ModalCreate',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isSubmitting: false,
      name: '',
      description: '',
      file_price: null,
      file_weight: null,
      errors: {},
    }
  },
  computed: {
    templatePrice() {
      return `${process.env.VUE_APP_ASSETS}/lionbay_template_promotion_prices.xlsx`
    },
    templateWeight() {
      return `${process.env.VUE_APP_ASSETS}/lionbay_template_promotion_weights.xlsx`
    },
    title() {
      return this.current.id ? 'Update promotion' : 'Create promotion'
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    onchangePrice(e) {
      const files = e.target.files
      if (!files || files.length < 1) return

      this.file_price = files[0]
      this.validFile(this.file_price)
    },
    onchangeWeight(e) {
      const files = e.target.files
      if (!files || files.length < 1) return

      this.file_weight = files[0]
    },
    async submitHandle() {
      if (this.isSubmitting) return

      this.errors = {}
      const name = this.name.trim()
      if (name == '') {
        this.$set(this.errors, 'name', 'Promotion name is required')
      }

      const form = new FormData()
      form.append('name', name)
      form.append('description', this.description)

      if (this.file_price) {
        if (!this.validFile(this.file_price)) {
          this.$set(this.errors, 'file_price', 'File không đúng định dạng')
        }

        form.append('file_price', this.file_price)
      }

      if (this.file_weight) {
        if (!this.validFile(this.file_weight)) {
          this.$set(this.errors, 'file_weight', 'File không đúng định dạng')
        }

        form.append('file_weight', this.file_weight)
      }

      if (Object.keys(this.errors).length > 0) {
        return
      }

      this.isSubmitting = true

      let res
      if (this.current.id > 0) {
        res = await api.updatePromotion(this.current.id, form)
      } else {
        res = await api.createPromotion(form)
      }

      this.isSubmitting = false

      if (!res || res.errorMessage) {
        this.$toast.error(res.errorMessage)
        return
      }

      if (this.current.id > 0) {
        this.$toast.success('Update promotion thành công!')
      } else {
        this.$toast.success('Tạo promotion thành công!')
      }

      this.$emit('on-submitted', res)
      this.reset()
    },

    validFile({ name }) {
      const ext = name.substr(name.lastIndexOf('.') + 1)
      return ['csv', 'xlsx', 'xls', 'xlsm'].includes(ext)
    },
    reset() {
      this.name = ''
      this.description = ''
      this.file_price = null
      this.file_weight = null
    },
  },
  watch: {
    current: {
      handler: function (val) {
        this.reset()
        if (!val.id) return

        this.name = val.name
        this.description = val.description
      },
      deep: true,
    },
  },
}
</script>
