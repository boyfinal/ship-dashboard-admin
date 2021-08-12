<template>
  <p-modal :active="visible" @close="handleClose" title="Duyệt">
    <div class="form-group">
      <label class="form-label">Loại vận chuyển:</label>
      <select type="text" class="form-control">
        <option value="">USPS</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Địa chỉ kho:</label>
      <select type="text" class="form-control">
        <option value="">Lionnix Default</option>
      </select>
    </div>
    <template slot="footer">
      <div></div>
      <div>
        <p-button @click="handleClose" type="default">Huỷ</p-button>
        <p-button @click="acceptHandle" class="ml-8" type="info"
          >In label</p-button
        >
      </div>
    </template>
  </p-modal>
</template>
<script>
export default {
  name: 'ModalAccept',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },

    acceptHandle() {
      this.$emit('accept')
    },
  },
}
</script>
