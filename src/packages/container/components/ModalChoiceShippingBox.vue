<template>
  <p-modal :active.sync="isShow" :title="`Tạo kiện hàng`" @close="handleClose">
    <div class="row">
      <div class="col-4">
        <label for=""><b>Chiều cao:</b> (cm)</label>
        <p-select
          :disabled="true"
          class="floating"
          v-model="type"
          name="high"
          v-if="type < maxIDBox + 1"
        >
          <option value="0">Chọn chiều cao</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.height
          }}</option>
        </p-select>
        <p-input
          v-else
          type="number"
          min="0"
          name="height"
          v-model.number="box.height"
          :error="valider.error('height')"
        />
      </div>
      <div class="col-4">
        <label for=""><b>Chiều rộng:</b> (cm)</label>
        <p-select
          :disabled="true"
          class="floating"
          v-model="type"
          name="width"
          v-if="type < maxIDBox + 1"
        >
          <option value="0">Chọn chiều rộng</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.width
          }}</option>
        </p-select>
        <p-input
          v-else
          type="number"
          min="0"
          name="width"
          v-model.number="box.width"
          :error="valider.error('width')"
        />
      </div>
      <div class="col-4">
        <label for=""><b>Chiều dài:</b> (cm)</label>
        <p-select
          :disabled="true"
          class="floating"
          v-model="type"
          name="length"
          v-if="type < maxIDBox + 1"
        >
          <option value="0">Chọn chiều dài</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.length
          }}</option>
        </p-select>
        <p-input
          v-else
          type="number"
          min="0"
          name="length"
          v-model.number="box.length"
          :error="valider.error('length')"
        />
      </div>
    </div>
    <br />
    <div class="row">
      <div class="col-4">
        <label for=""><b>Cân nặng tối đa:</b> (kg)</label>
        <p-select
          :disabled="true"
          class="floating"
          v-model="type"
          name="weight"
          v-if="type < maxIDBox + 1"
        >
          <option value="0">Chọn cân nặng tối đa</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.max_weight
          }}</option>
        </p-select>
        <p-input
          v-else
          type="number"
          min="0"
          name="max_weight"
          v-model.number="box.max_weight"
          :error="valider.error('max_weight')"
        />
      </div>
      <div class="col-4">
        <label for=""><b>Loại:</b></label>
        <p-select class="floating" v-model="type" name="type">
          <option value="0">Chọn một loại</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id"
            >Loại {{ `${box.length}x${box.width}x${box.height}` }}</option
          >
          <option :value="maxIDBox + 1">Khác</option>
        </p-select>
      </div>
      <div class="col-4">
        <label for=""><b>Kho:</b></label>
        <p-select class="floating" v-model="warehouseID" name="warehouseID">
          <option value="0">Chọn kho</option>
          <option
            v-for="warehouse in warehouses"
            :key="warehouse.id"
            :value="warehouse.id"
            >HUB {{ warehouse.state }}</option
          >
        </p-select>
      </div>
    </div>

    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose"> Bỏ qua </p-button>
        <p-button
          type="info"
          @click="handleSave"
          :loading="loading"
          :disabled="type < 1"
        >
          Tạo
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import valider from '@core/valider'

export default {
  name: 'ModalChoiceShippingBox',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    boxes: {
      type: Array,
      default: () => [],
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.valider = valider.schema((y) => ({
      height: y
        .number()
        .typeError('Chiều cao không hợp lệ')
        .min(0.1, 'Chiều cao không hợp lệ'),
      length: y
        .number()
        .typeError('Chiều dài không hợp lệ')
        .min(0.1, 'Chiều dài không hợp lệ'),
      width: y
        .number()
        .typeError('Chiều rộng không hợp lệ')
        .min(0.1, 'Chiều rộng không hợp lệ'),
      max_weight: y
        .number()
        .typeError('Cân nặng tối đa không hợp lệ')
        .min(0.1, 'Cân nặng tối đa không hợp lệ'),
    }))
    this.valider.reset()
  },
  mounted() {
    this.type = this.boxes[0] ? this.boxes[0].id : 0
  },
  computed: {
    maxIDBox() {
      return Math.max.apply(
        Math,
        this.boxes.map(function(x) {
          return x.id
        })
      )
    },
  },
  data() {
    return {
      isShow: this.visible,
      box: {
        height: 0,
        length: 0,
        width: 0,
        max_weight: 0,
      },
      warehouse: {},
      type: 0,
      warehouseID: 0,
      store: 1,
      valider: null,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      if (this.type < this.maxIDBox + 1) {
        this.box = this.boxes.find((i) => i.id == this.type)
      }
      if (!this.valider.check(this.box)) {
        return
      }
      const payload = {
        width: this.box.width,
        height: this.box.height,
        length: this.box.length,
        max_weight: this.box.max_weight,
        warehouse_id: this.warehouseID,
      }
      this.$emit('save', payload)
    },
    handleUpdateType(value) {
      this.type = value
    },
  },
  watch: {
    visible(value) {
      this.isShow = value
      this.type = 0
      this.warehouseID = 0
    },
    type(val) {
      if (val == this.maxIDBox + 1) {
        this.box.height = 0
        this.box.length = 0
        this.box.width = 0
        this.box.max_weight = 0
      }
    },
  },
}
</script>
<style>
@media screen and (min-width: 1088px) {
  .p-modal-content.modal-lg,
  .p-modal-card.modal-lg {
    width: 800px;
  }
}
.p-modal-content label {
  margin-bottom: 0.4rem;
}
</style>
