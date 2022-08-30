<template>
  <p-modal :active="visible" :title="title" @close="handleClose">
    <div class="row mb-16 promotion-form">
      <div class="col-12">
        <div class="mb-20">
          <label for="">Tên: *</label>
          <p-input v-model="name" :error="errors.name" />
        </div>
        <div class="mb-20">
          <label for="">Mô tả:</label>
          <textarea v-model="description" class="form-control"></textarea>
        </div>
        <div class="mb-20">
          <label for=""
            >Chỉnh sửa giá
            <a :href="templatePrice" target="_blank">template</a></label
          >
          <upload
            class="order-uploader"
            drag
            action=""
            :auto-upload="false"
            :on-change="onchangePrice"
            :on-max-size="errorSizeFileHandler"
            :max-file-size="2048000"
            accept=".csv,.xlsx,.xls,.xlsm"
          >
            <img class="el-icon-upload" src="~@/assets/img/upload.png" alt="" />
            <div class="el-upload__text">
              Kéo thả file để upload hoặc <em>tải lên</em>
            </div>
            <div v-if="!file_price" class="el-before-upload__text">
              Chưa có file nào được chọn .
            </div>
            <div v-else class="el-before-upload__text">
              {{ file_price.name }}
            </div>
          </upload>
          <span class="invalid-error" v-if="errors.file_price">{{
            errors.file_price
          }}</span>
        </div>
        <div class="mb-20">
          <label for=""
            >Chỉnh sửa cân nặng
            <a :href="templateWeight" target="_blank">template</a></label
          >
          <upload
            drag
            action=""
            :auto-upload="false"
            :on-change="onchangeWeight"
            :on-max-size="errorSizeFileHandler"
            :max-file-size="2048000"
            accept=".csv,.xlsx,.xls,.xlsm"
          >
            <img class="el-icon-upload" src="~@/assets/img/upload.png" alt="" />
            <div class="el-upload__text">
              Kéo thả file để upload hoặc <em>tải lên</em>
            </div>
            <div v-if="!file_weight" class="el-before-upload__text">
              Chưa có file nào được chọn .
            </div>
            <div v-else class="el-before-upload__text">
              {{ file_weight.name }}
            </div>
          </upload>
          <span class="invalid-error" v-if="errors.file_weight">{{
            errors.file_weight
          }}</span>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose">Đóng</p-button>
        <p-button type="info" @click="submitHandle">{{ buttonText }}</p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import api from '../api'
import { Upload } from '@/kit'

export default {
  name: 'ModalCreate',
  components: { Upload },
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
      return this.current.id ? 'Sửa promotion' : 'Tạo promotion'
    },
    buttonText() {
      return this.current.id ? 'Lưu' : 'Tạo'
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    onchangePrice(file) {
      this.file_price = file
    },
    onchangeWeight(file) {
      this.file_weight = file
    },
    async submitHandle() {
      if (this.isSubmitting) return

      this.errors = {}
      const name = this.name.trim()
      if (name == '') {
        this.$set(this.errors, 'name', 'Tên promotion là bắt buộc')
      }

      const form = new FormData()
      form.append('name', name)
      form.append('description', this.description)

      if (this.file_price) {
        if (!this.validFile(this.file_price)) {
          this.$set(this.errors, 'file_price', 'File không đúng định dạng')
        }

        form.append('file_price', this.file_price.raw)
      }

      if (this.file_weight) {
        if (!this.validFile(this.file_weight)) {
          this.$set(this.errors, 'file_weight', 'File không đúng định dạng')
        }

        form.append('file_weight', this.file_weight.raw)
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
        if (res.errors && res.errors.length) {
          for (const err of res.errors) {
            const value = (err.value || []).join(',')
            const msg = (err.messages || []).join(',')
            this.$toast.error(`Line ${err.line}: ${value} - ${msg}`)
          }

          return
        }

        this.$toast.error(res.errorMessage)
        return
      }

      if (this.current.id > 0) {
        this.$toast.success('Sửa promotion thành công!')
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
    errorSizeFileHandler() {
      this.$toast.error('File upload vượt quá dung lượng cho phép')
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
<style lang="scss">
.promotion-form .el-upload-dragger {
  height: 130px;

  .el-icon-upload {
    margin: 15px 0 12px;
    height: 40px;
  }
}
</style>
