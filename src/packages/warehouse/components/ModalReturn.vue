<template>
  <p-modal :active="visible" @close="handleClose" title="Trả hàng">
    <div class="row mb-24">
      <div class="col-6">
        <p>Mã vận đơn: {{ code }}</p>
      </div>
      <div class="col-6">
        <p>Loại hàng: {{ current.detail }}</p>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label mb-10">Lý do:</label>
      <textarea class="form-control" v-model="note"></textarea>
    </div>
    <template slot="footer">
      <div></div>
      <div>
        <p-button @click="handleClose" type="default">Huỷ</p-button>
        <p-button
          @click="submitHandle"
          class="ml-8"
          type="danger"
          :disabled="!note"
        >
          Trả hàng
        </p-button>
      </div>
    </template>
  </p-modal>
</template>
<script>
export default {
  name: 'ModalReturn',
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
  },
  data() {
    return {
      note: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },

    submitHandle() {
      if (!this.note) return

      this.$emit('submit', this.note)
    },
  },
}
</script>
