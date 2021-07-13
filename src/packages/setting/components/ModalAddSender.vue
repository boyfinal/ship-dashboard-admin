<template>
  <div class="modal-add-sender">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="row mb-20">
          <div class="col-6">
            <label>Tên: <span>*</span></label>
            <input
              type="text"
              class="form-control"
              v-model="senderEditing.name"
              placeholder="Nhập Tên"
              v-validate="'required|fullName'"
              name="name"
              data-vv-as="Tên"
              :class="{ 'error-color': errors.has('name') }"
            />
            <span v-if="errors.has('name')">{{ errors.first('name') }}</span>
          </div>
          <div class="col-6">
            <label>Số điện thoại: <span>*</span></label>
            <input
              type="text"
              v-model="senderEditing.phone_number"
              class="form-control"
              placeholder="Nhập Số điện thoại"
              v-validate="'required|max:20|phoneAddress'"
              name="phone"
              data-vv-as="Số điện thoại"
              :class="{ 'error-color': errors.has('phone') }"
            />
            <span v-if="errors.has('phone')">{{ errors.first('phone') }}</span>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-12">
            <label>Địa chỉ: <span>*</span></label>
            <input
              type="text"
              v-model="senderEditing.address"
              class="form-control"
              placeholder="Nhập Địa chỉ"
              v-validate="'required|max:200'"
              name="address"
              data-vv-as="Địa chỉ"
              :class="{ 'error-color': errors.has('address') }"
            />
            <span v-if="errors.has('address')">{{
              errors.first('address')
            }}</span>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-4 form-group">
            <label>Tỉnh/Thành phố: <span>*</span></label>
            <p-select
              placeholder="Tỉnh/Thành phố"
              v-model="senderEditing.city"
              v-validate="'required'"
              name="city_code"
              data-vv-as="Tỉnh/Thành phố"
              :class="{ 'error-color': errors.has('city_code') }"
            >
              <option
                :value="item['Name']"
                v-for="(item, i) in cities"
                :key="i"
              >
                {{ item.Name }}
              </option>
            </p-select>
            <span v-if="errors.has('city_code')">{{
              errors.first('city_code')
            }}</span>
          </div>
          <div class="col-4 form-group">
            <label>Quận/Huyện: <span>*</span></label>
            <p-select
              placeholder="Quận/Huyện"
              v-model="senderEditing.district"
              v-validate="'required'"
              name="district_code"
              data-vv-as="Quận/Huyện"
              :class="{ 'error-color': errors.has('district_code') }"
            >
              <option
                :value="item['Name']"
                v-for="(item, i) in districts"
                :key="i"
              >
                {{ item.Name }}
              </option>
            </p-select>
            <span v-if="errors.has('district_code')">{{
              errors.first('district_code')
            }}</span>
          </div>
          <div class="col-4 form-group">
            <label>Phường/Xã: <span>*</span></label>
            <p-select
              placeholder="Phường/Xã"
              v-model="senderEditing.wards"
              v-validate="'required'"
              name="ward_code"
              data-vv-as="Phường/Xã"
              :class="{ 'error-color': errors.has('ward_code') }"
            >
              <option :value="item['Name']" v-for="(item, i) in wards" :key="i">
                {{ item.Name }}
              </option>
            </p-select>
            <span v-if="errors.has('ward_code')">{{
              errors.first('ward_code')
            }}</span>
          </div>
        </div>
        <div class="row default-sender mb-20">
          <p-checkbox
            class="tracking-checkbox"
            v-model="senderEditing.is_default"
          ></p-checkbox>
          <span> Đặt làm mặc định</span>
        </div>
      </template>

      <template slot="footer">
        <div>
          <img src="~@/assets/img/InfoCircle.svg" alt="" />
          <b>Lưu ý:</b> (<span>*</span>) Là các trường bắt buộc nhập.
        </div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Bỏ qua
            </p-button>
          </div>
          <div class="ml-7">
            <p-button type="primary" @click="handleSave" :loading="loading">
              Lưu
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
import mixinAddress from '@/packages/shared/mixins/address'

export default {
  name: 'ModalAddSender',
  mixins: [mixinAddress],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    cities: {
      type: Array,
      default: () => [],
    },
    note: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    sender: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      note_order: this.note,
      textareaNote: 0,
      disable_note: true,
      name: '',
      phone_number: '',
      optionCity: [],
      optionDistrict: [],
      optionWards: [],
      selected: {},
      senderEditing: {
        name: '',
        phone_number: '',
        address: '',
        city: '',
        district: '',
        wards: '',
        is_default: '',
      },
    }
  },
  computed: {
    senderTranfer() {
      debugger
      return this.sender === {} ? this.senderEditing : this.sender
    },
  },
  methods: {
    async handleSave() {
      if (this.loading === true) {
        return
      }
      const validate = await this.$validator.validateAll()
      if (!validate) {
        return
      }

      this.senderEditing.name = this.senderEditing.name.trim()
      this.senderEditing.phone_number = this.senderEditing.phone_number.trim()
      this.senderEditing.address = this.senderEditing.address.trim()

      this.$emit('saveSender', this.senderEditing)
      this.$emit('update:visible', false)
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function(val) {
        this.isVisible = val
      },
      deep: true,
    },
    sender: {
      handler: function(val) {
        if (val !== {}) {
          this.senderEditing = val
        } else {
          this.senderEditing = {
            name: '',
            phone_number: '',
            address: '',
            city: '',
            district: '',
            wards: '',
            is_default: '',
          }
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss">
select {
  option:disabled {
    color: #d100e6 !important;
  }
}
.modal-add-sender label {
  margin-bottom: 4px;
  font-weight: 700;
  font-size: 14px;
  line-height: 160%;
}
.modal-add-sender label span {
  color: red;
}
.modal-add-sender span {
  color: red;
}
input:invalid {
  border-color: red;
}
.default-sender {
  position: relative;
}
.default-sender .checkbox-custom input {
  position: absolute;
  top: 12px !important;
  left: 12px !important;
}
.default-sender .checkbox-custom label::before {
  position: absolute;
  top: 12px !important;
  left: 12px !important;
}
.default-sender .checkbox-custom label::after {
  position: absolute;
  top: 12px !important;
  left: 12px !important;
}
.default-sender span {
  color: #37393e;
  position: absolute;
  top: 0;
  left: 40px;
}
.modal-add-sender .form-control {
  padding: 2px 15px;
  top: 0;
  left: 0;
  position: relative;
}

.modal-add-sender .p-modal-content {
  min-width: 900px !important;
}
</style>
