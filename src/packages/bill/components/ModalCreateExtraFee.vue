<template>
  <p-modal
    :active.sync="visible"
    :title="`Tạo phí phát sinh`"
    @close="handleClose"
  >
    <div class="row mb-16">
      <div class="col-12">
        <label for=""><b>Khách hàng</b></label>
        <user-resource
          v-model="user_id"
          class="user-resource is-fullwidth"
          :filter="{ role: 'customer' }"
          :label="`Tìm khách hàng`"
        />
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-6">
        <label for=""><b>Loại phí</b></label>
        <p-select class="floating" v-model="extra_fee_type_id">
          <option value="0">Chọn loại phí</option>
          <option v-for="type in types" :key="type.id" :value="type.id">{{
            type.name
          }}</option>
        </p-select>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-6">
        <label for=""><b>Mã vận đơn</b></label>
        <p-input type="text" v-model="package_code"> </p-input>
      </div>
      <div class="col-6">
        <label for=""><b>Phí</b> ($)</label>
        <p-input type="text" v-model="amount"></p-input>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <label for=""><b>Nội dung</b></label>
        <textarea
          class="form-control"
          rows="4"
          v-model="description"
        ></textarea>
      </div>
    </div>
    <template slot="footer">
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose">
          Bỏ qua
        </p-button>
        <p-button type="info" @click="handleSave" :loading="loading">
          Tạo
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import UserResource from '@/components/shared/resource/User'
import PInput from '../../../../uikit/components/input/Input'
export default {
  name: 'ModalCreateExtraFee',
  components: { PInput, UserResource },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    types: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      user_id: 0,
      package_code: '',
      extra_fee_type_id: 0,
      amount: '',
      description: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateParams() {
      if (this.user_id === 0) {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn khách hàng !',
        })
        return false
      }

      if (this.extra_fee_type_id === 0) {
        this.$toast.open({
          type: 'error',
          message: 'Chưa chọn loại phí !',
        })
        return false
      }

      if (this.package_code === '') {
        this.$toast.open({
          type: 'error',
          message: 'Nhập mã vận đơn !',
        })
        return false
      }

      if (!/^[0-9.]+$/.test(this.amount)) {
        this.$toast.open({
          type: 'error',
          message: 'Số tiền không hợp lệ !',
        })
        return false
      }
      return true
    },
    async handleSave() {
      if (!this.validateParams()) {
        return
      }

      const payload = {
        user_id: this.user_id,
        package_code: this.package_code,
        extra_fee_type_id: this.extra_fee_type_id,
        amount: parseFloat(this.amount),
        description: this.description,
      }
      this.$emit('save', payload)
    },
  },
}
</script>
<style>
.modal-footer {
  justify-content: flex-end !important;
}
.p-modal-content label {
  margin-bottom: 0.4rem;
}
</style>
