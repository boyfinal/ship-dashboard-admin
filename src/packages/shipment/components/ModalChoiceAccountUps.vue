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
        >Account 1 (default)</p-radio
      >
      <p-radio
        type="info"
        class="col-6 radio-inline"
        v-model="account_ups"
        :native-value="optionAcocount2"
        >Account 2</p-radio
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
  computed: {
    getDefaultOp() {
      return this.optionAccountDefault
    },
  },
  data() {
    return {
      optionAccountDefault: 1,
      optionAcocount2: 2,
      account_ups: this.getDefaultOp,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      const payload = {
        account_ups: this.account_ups,
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
    width: 360px !important;
  }
}
.p-modal-content .p-radio {
  margin-bottom: 0;
}
</style>
