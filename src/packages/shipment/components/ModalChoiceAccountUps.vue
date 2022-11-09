<template>
  <p-modal
    :size="`custom`"
    :active="visible"
    :title="`Chọn tài khoản UPS`"
    @close="handleClose"
  >
    <div class="row">
      <p-radio
        type="info"
        class="col-6 radio-inline"
        v-model="account_ups"
        :native-value="optionAccountDefault"
        >Phoenix (default)</p-radio
      >
      <p-radio
        type="info"
        class="col-6 radio-inline"
        v-model="account_ups"
        :native-value="optionAcocount2"
        >Viva</p-radio
      >
    </div>

    <template slot="footer">
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button type="info" :loading="loading" @click="handleSave">
          Đóng lô
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import { DEFAULT_ACCOUNT_UPS, OPTION_ACCOUNT_UPS2 } from '../constants'
export default {
  name: 'ModalChoiceAccountUps',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      optionAccountDefault: DEFAULT_ACCOUNT_UPS,
      optionAcocount2: OPTION_ACCOUNT_UPS2,
      account_ups: DEFAULT_ACCOUNT_UPS,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      const payload = {
        ups_account: this.account_ups,
      }
      this.$emit('close', payload)
    },
  },
  watch: {},
}
</script>
<style>
.modal-footer {
  justify-content: flex-end !important;
}
@media screen and (min-width: 1088px) {
  .modal-custom {
    width: 340px !important;
  }
}
.p-modal-content .p-radio {
  margin-bottom: 0;
}
</style>
