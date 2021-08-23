<template>
  <p-modal :active="visible" @close="handleClose" title="Duyệt">
    <div class="form-group">
      <label class="form-label">Loại vận chuyển:</label>
      <p-select v-model="carrier">
        <option v-for="(option, i) in options" :key="i" :value="option.code">{{
          option.name
        }}</option>
      </p-select>
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
    service: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    options() {
      let optionAccept = []

      if (this.service && this.service.domestic_carrier) {
        optionAccept.push({
          name: this.service.domestic_carrier.name,
          code: this.service.domestic_carrier.code,
          id: this.service.domestic_carrier.id,
        })
      }
      return optionAccept
    },
  },
  data() {
    return {
      carrier: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },

    acceptHandle() {
      if (!this.carrier) {
        return this.$toast.error('Vui lòng chọn Loại vận chuyển')
      }
      this.$emit('accept', this.carrier)
    },
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          this.carrier = val[0].code
        }
      },
    },
  },
}
</script>
