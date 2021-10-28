<template>
  <p-modal :active.sync="isShow" :title="`Tạo kiện hàng`" @close="handleClose">
    <div class="row">
      <div class="col-4">
        <label for=""><b>Chiều cao:</b> (cm)</label>
        <p-select :disabled="true" class="floating" v-model="type" name="high">
          <option value="0">Chọn chiều cao</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.height
          }}</option>
        </p-select>
      </div>
      <div class="col-4">
        <label for=""><b>Chiều rộng:</b> (cm)</label>
        <p-select :disabled="true" class="floating" v-model="type" name="width">
          <option value="0">Chọn chiều rộng</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.width
          }}</option>
        </p-select>
      </div>
      <div class="col-4">
        <label for=""><b>Chiều dài:</b> (cm)</label>
        <p-select
          :disabled="true"
          class="floating"
          v-model="type"
          name="length"
        >
          <option value="0">Chọn chiều dài</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.length
          }}</option>
        </p-select>
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
        >
          <option value="0">Chọn cân nặng tối đa</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id">{{
            box.max_weight
          }}</option>
        </p-select>
      </div>
      <div class="col-4">
        <label for=""><b>Loại:</b></label>
        <p-select class="floating" v-model="type" name="type">
          <option value="0">Chọn một loại</option>
          <option v-for="box in boxes" :key="box.id" :value="box.id"
            >Loại {{ box.id }}</option
          >
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
            >{{ warehouse.name }}</option
          >
        </p-select>
      </div>
    </div>

    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button type="default" @click="handleClose">
          Bỏ qua
        </p-button>
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
  mounted() {
    this.type = this.boxes[0] ? this.boxes[0].id : 0
    console.log(this.loading)
  },
  data() {
    return {
      isShow: this.visible,
      box: {},
      warehouse: {},
      type: 0,
      warehouseID: 0,
      store: 1,
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      const payload = {
        box_type_id: +this.type,
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
