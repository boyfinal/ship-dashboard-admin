<template>
  <p-modal :active="visible" :title="title" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <div v-if="description" v-html="description"></div>
        <div class="path" v-if="s3PathPrice || s3PathWeight">
          <hr v-if="description" />
          <p v-if="s3PathPrice"
            ><a :href="s3PathPrice">Xem chi tiết bảng giá</a></p
          >
          <p v-if="s3PathWeight"
            ><a :href="s3PathWeight">Xem chi vưot ngưỡng cân nặng</a></p
          >
        </div>
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
    title() {
      return (this.current || {}).name || 'Promotion nội dung'
    },
    description() {
      return (this.current || {}).description || ''
    },
    s3PathPrice() {
      const path = (this.current || {}).s3_path_price || ''
      return path ? `${process.env.VUE_APP_ASSETS}/${path}` : ''
    },
    s3PathWeight() {
      const path = (this.current || {}).s3_path_weight || ''
      return path ? `${process.env.VUE_APP_ASSETS}/${path}` : ''
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
