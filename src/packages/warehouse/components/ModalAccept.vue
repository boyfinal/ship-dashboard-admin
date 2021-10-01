<template>
  <p-modal :active="visible" @close="handleClose" title="Duyệt">
    <div class="form-group">
      <label class="form-label">Loại vận chuyển:</label>
      <p-select v-model="carrier">
        <option
          v-for="(option, i) in optionsTransport"
          :key="i"
          :value="option.code"
          >{{ option.name }}</option
        >
      </p-select>
    </div>
    <div class="form-group">
      <label class="form-label">Địa chỉ kho:</label>
      <p-select v-model="warehouse">
        <option
          v-for="(option, i) in optionsWareHouse"
          :key="i"
          :value="option.id"
          >{{ option.name }}</option
        >
      </p-select>
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
    estimateCost: {
      type: Array,
      default: () => [],
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    optionsTransport() {
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
    optionsWareHouse() {
      let optionAccept = []

      this.warehouses.forEach((warehouse) => {
        let exist = this.estimateCost.find(
          (cost) => cost.warehouse_id == warehouse.id
        )
        let label = warehouse.name
        let cost = 0
        if (exist) {
          label = label + ` - Giá ước tính: $${exist.cost}`
          cost = exist.cost
        }

        optionAccept.push({
          name: label,
          id: warehouse.id,
          cost: cost,
        })
      })

      debugger
      return optionAccept
    },
  },
  data() {
    return {
      carrier: '',
      warehouse: '',
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
      this.$emit('accept', this.carrier, this.warehouse)
    },
  },
  watch: {
    optionsTransport: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          this.carrier = val[0].code
        }
      },
    },
    optionsWareHouse: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          let minOb = val.reduce(function(prev, curr) {
            return prev.cost < curr.cost ? prev : curr
          })
          this.warehouse = minOb.id
        }
      },
    },
  },
}
</script>
