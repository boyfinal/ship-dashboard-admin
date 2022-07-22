<template>
  <p-modal :active="visible" :title="`Promotion nội dung`" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <div v-html="description"></div>
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose">Đóng</p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalDescription',
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
    description() {
      return (this.current || {}).description || ''
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
