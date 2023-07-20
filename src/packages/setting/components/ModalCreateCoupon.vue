<template>
  <div class="modal-coupon">
    <p-modal :active="visible" @close="handleClose" :title="txtBtn">
      <div class="row mb-16">
        <div class="col-6">
          <label><b>Mã coupon:</b> <span style="color: red">*</span></label>
          <p-input
            type="text"
            class="mb-8"
            v-model="code"
            placeholder="Nhập mã coupon"
            :error="valider.error('code')"
          ></p-input>
        </div>
        <div class="col-6">
          <label
            ><b>Tên khách hàng:</b> <span style="color: red">*</span></label
          >
          <user-resource
            id="search"
            v-model="customer"
            class="user-resource is-fullwidth"
            :filter="{ role: 'customer' }"
            :label="`Tìm khách hàng`"
            :emitID="false"
            @input="handleSearch"
            :isTester="tester"
            :search="customer ? customer.email : ''"
            :arr-status="this.search_status_filter"
          />
          <span class="invalid-error" v-if="valider.error('customer_id')">
            {{ valider.error('customer_id') }}
          </span>
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-6">
          <label><b>Ngày bắt đầu:</b> <span style="color: red">*</span></label>
          <p-datepicker
            :label="`Chọn ngày bắt đầu`"
            :single-date-picker="true"
            class="p-input-group input-group"
            :locale-data="{ format: 'dd-mm-yyyy HH:mm:ss' }"
            :time-picker="true"
            :show-dropdowns="true"
            :time-picker-increment="1"
            :value="{ startDate: start_date, endDate: start_date }"
            :opens="'center'"
            @update="selectStartDate"
            @clear="clearStartDate"
          >
          </p-datepicker>
          <span class="invalid-error" v-if="valider.error('start_date')">
            {{ valider.error('start_date') }}
          </span>
        </div>
        <div class="col-6">
          <label><b>Ngày hết hạn:</b> <span style="color: red">*</span></label>
          <p-datepicker
            :label="`Chọn ngày hết hạn`"
            :single-date-picker="true"
            class="p-input-group input-group"
            :locale-data="{ format: 'dd-mm-yyyy HH:mm:ss' }"
            :time-picker="true"
            :show-dropdowns="true"
            :time-picker-increment="1"
            :value="{ startDate: end_date, endDate: end_date }"
            :opens="'center'"
            @update="selectEndDate"
            @clear="clearEndDate"
          >
          </p-datepicker>
          <span class="invalid-error" v-if="valider.error('end_date')">
            {{ valider.error('end_date') }}
          </span>
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-6">
          <label><b>Điểm để mua:</b> <span style="color: red">*</span></label>
          <p-input
            type="number"
            min="0"
            class="mb-8"
            v-model="point"
            placeholder="Nhập điểm để mua"
            :error="valider.error('point')"
          ></p-input>
        </div>
        <div class="col-6">
          <label><b>Số lượng:</b> <span style="color: red">*</span></label>
          <p-input
            type="number"
            min="1"
            class="mb-8"
            v-model="quantity"
            placeholder="Nhập số lượng"
            :error="valider.error('quantity')"
          ></p-input>
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-6">
          <label><b>Loại coupon:</b> <span style="color: red">*</span></label>
          <div class="row">
            <p-radio
              type="info"
              class="col-6 radio-inline"
              v-model="type"
              :native-value="couponMoney"
              >Tặng tiền</p-radio
            >
            <p-radio
              type="info"
              class="col-6 adio-inline"
              v-model="type"
              :native-value="couponDiscountMoney"
              >Giảm giá ($)</p-radio
            >
            <p-radio
              type="info"
              class="col-6 adio-inline"
              v-model="type"
              :native-value="couponDiscountPercent"
              >Giảm giá (%)</p-radio
            >
          </div>
          <span class="invalid-error" v-if="valider.error('type')">
            {{ valider.error('type') }}
          </span>
        </div>
        <div class="col-6">
          <label><b>Giá trị giảm:</b> <span style="color: red">*</span></label>
          <p-input
            type="number"
            min="0"
            class="mb-8"
            v-model="value"
            placeholder="Nhập giá trị giảm"
            :error="valider.error('value')"
          ></p-input>
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-6" v-if="isDiscountPercent || isDiscountMoney">
          <label
            ><b>Giá trị áp dụng tối thiểu:</b>
            <span style="color: red">*</span></label
          >
          <p-input
            type="number"
            min="0"
            class="mb-8"
            v-model="min_apply"
            placeholder="Nhập giá trị áp dụng tối thiểu"
            :error="valider.error('min_apply')"
          ></p-input>
        </div>
        <div class="col-6" v-if="isDiscountPercent">
          <label
            ><b>Giá trị giảm tối đa:</b>
            <span style="color: red">*</span></label
          >
          <p-input
            type="number"
            min="0"
            class="mb-8"
            v-model="max_apply"
            placeholder="Nhập giá trị áp dụng tối đa"
            :error="valider.error('max_apply')"
          ></p-input>
        </div>
      </div>
      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default" :disabled="loading">
              Bỏ qua
            </p-button>
            <p-button
              class="ml-8"
              type="info"
              @click="handleSave"
              :loading="loading"
            >
              {{ txtBtn }}
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import {
  COUPON_TYPE_MONEY,
  COUPON_TYPE_DISCOUNT_MONEY,
  COUPON_TYPE_DISCOUNT_PERCENT,
  USER_STATUS_ACTIVE,
  USER_STATUS_DEACTIVE,
} from '../constants'
import valider from '@core/valider'
import UserResource from '@/components/shared/resource/UsersActive'
export default {
  name: 'ModalCreateCoupon',
  components: {
    UserResource,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    coupon: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    couponMoney() {
      return COUPON_TYPE_MONEY
    },
    couponDiscountMoney() {
      return COUPON_TYPE_DISCOUNT_MONEY
    },
    couponDiscountPercent() {
      return COUPON_TYPE_DISCOUNT_PERCENT
    },
    isDiscountMoney() {
      return this.type === COUPON_TYPE_DISCOUNT_MONEY
    },
    isDiscountPercent() {
      return this.type === COUPON_TYPE_DISCOUNT_PERCENT
    },
    txtBtn() {
      if (this.coupon) {
        return 'Cập nhật Coupon'
      }
      return 'Tạo mã Coupon'
    },
  },
  data() {
    return {
      code: '',
      customer: '',
      start_date: '',
      end_date: '',
      point: '',
      quantity: '',
      type: COUPON_TYPE_MONEY,
      min_apply: '',
      max_apply: '',
      value: '',
      tester: this.$route.query.tester ? parseInt(this.$route.query.tester) : 0,
      search_status_filter: `${USER_STATUS_ACTIVE},${USER_STATUS_DEACTIVE}`,
      valider: null,
    }
  },
  created() {
    this.initValidator()
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    selectStartDate(v) {
      if (this.end_date !== '' && new Date(this.end_date) < v.startDate) {
        this.$toast.error('Ngày kết thick phải sau ngày bắt đầu')
        return
      }
      this.start_date = v.startDate.toISOString()
    },
    selectEndDate(v) {
      if (this.start_date !== '' && new Date(this.start_date) > v.startDate) {
        this.$toast.error('Ngày kết thúc phải sau ngày bắt đầu')
        return
      }
      this.end_date = v.endDate.toISOString()
    },
    handleSearch(v) {
      if (!v) {
        this.customer = null
      }
    },
    initValidator() {
      this.valider = valider.schema((y) => ({
        code: y.string().required('Mã coupon không để trống'),
        customer_id: y.number().typeError('Khách hàng chưa được chọn'),
        start_date: y.string().required('Ngày bắt đầu không để trống'),
        end_date: y.string().required('Ngày kết thúc không để trống'),
        type: y.number().typeError('Chưa chọn loại coupon'),
        point: y
          .number()
          .required('Điểm mua không để trống')
          .typeError('Điểm mua chỉ nhập số')
          .integer('Điểm mua chỉ nhập số nguyên')
          .positive('Điểm mua không hợp lệ')
          .min(1, 'Điểm mua không hợp lệ'),
        quantity: y
          .number()
          .required('Số lượng không để trống')
          .typeError('Số lượng chỉ nhập số')
          .integer('Số lượng chỉ nhập số nguyên')
          .positive('Số lượng không hợp lệ')
          .min(1, 'Số lượng không hợp lệ'),
        min_apply: y
          .number()
          .required('Giá trị tối thiểu để trống')
          .typeError('Giá trị tối thiểu không hợp lệ')
          .min(0.1, 'Giá trị tối thiểu nợ không hợp lệ'),
        max_apply: y
          .number()
          .required('Giá trị tối đa để trống')
          .typeError('Giá trị tối đa không hợp lệ')
          .min(0.1, 'Giá trị tối đa không hợp lệ'),
        value: y.string().required('Giá trị giảm bắt buộc nhập'),
      }))
    },
    clearStartDate() {
      this.start_date = ''
    },
    clearEndDate() {
      this.end_date = ''
    },
    validateData(data) {
      if (this.isDiscountMoney) {
        this.valider = this.valider.schema((y) => ({
          code: y.string().required('Mã coupon không để trống'),
          customer_id: y.number().typeError('Khách hàng chưa được chọn'),
          start_date: y.string().required('Ngày bắt đầu không để trống'),
          end_date: y.string().required('Ngày kết thúc không để trống'),
          type: y.number().typeError('Chưa chọn loại coupon'),
          point: y
            .number()
            .required('Điểm mua không để trống')
            .typeError('Điểm mua chỉ nhập số')
            .integer('Điểm mua chỉ nhập số nguyên')
            .positive('Điểm mua không hợp lệ')
            .min(1, 'Điểm mua không hợp lệ'),
          quantity: y
            .number()
            .required('Số lượng không để trống')
            .typeError('Số lượng chỉ nhập số')
            .integer('Số lượng chỉ nhập số nguyên')
            .positive('Số lượng không hợp lệ')
            .min(1, 'Số lượng không hợp lệ'),
          value: y
            .number()
            .typeError('Giá trị giảm không hợp lệ')
            .min(0.1, 'Giá trị giảm không hợp lệ'),
          min_apply: y
            .number()
            .required('Giá trị tối thiểu để trống')
            .typeError('Giá trị tối thiểu không hợp lệ')
            .min(0.1, 'Giá trị tối thiểu nợ không hợp lệ'),
        }))
      } else if (this.isDiscountPercent) {
        this.valider = this.valider.schema((y) => ({
          code: y.string().required('Mã coupon không để trống'),
          customer_id: y.number().typeError('Khách hàng chưa được chọn'),
          start_date: y.string().required('Ngày bắt đầu không để trống'),
          end_date: y.string().required('Ngày kết thúc không để trống'),
          type: y.number().typeError('Chưa chọn loại coupon'),
          point: y
            .number()
            .required('Điểm mua không để trống')
            .typeError('Điểm mua chỉ nhập số')
            .integer('Điểm mua chỉ nhập số nguyên')
            .positive('Điểm mua không hợp lệ')
            .min(1, 'Điểm mua không hợp lệ'),
          quantity: y
            .number()
            .required('Số lượng không để trống')
            .typeError('Số lượng chỉ nhập số')
            .integer('Số lượng chỉ nhập số nguyên')
            .positive('Số lượng không hợp lệ')
            .min(1, 'Số lượng không hợp lệ'),
          value: y
            .number()
            .typeError('Giá trị giảm không hợp lệ')
            .min(0.1, 'Giá trị giảm không hợp lệ'),
          min_apply: y
            .number()
            .required('Giá trị tối thiểu để trống')
            .typeError('Giá trị tối thiểu không hợp lệ')
            .min(0.1, 'Giá trị tối thiểu nợ không hợp lệ'),
          max_apply: y
            .number()
            .required('Giá trị tối đa để trống')
            .typeError('Giá trị tối đa không hợp lệ')
            .min(0.1, 'Giá trị tối đa không hợp lệ'),
        }))
      } else {
        this.valider = this.valider.schema((y) => ({
          code: y.string().required('Mã coupon không để trống'),
          customer_id: y.number().typeError('Khách hàng chưa được chọn'),
          start_date: y.string().required('Ngày bắt đầu không để trống'),
          end_date: y.string().required('Ngày kết thúc không để trống'),
          type: y.number().typeError('Chưa chọn loại coupon'),
          point: y
            .number()
            .required('Điểm mua không để trống')
            .typeError('Điểm mua chỉ nhập số')
            .integer('Điểm mua chỉ nhập số nguyên')
            .positive('Điểm mua không hợp lệ')
            .min(1, 'Điểm mua không hợp lệ'),
          quantity: y
            .number()
            .required('Số lượng không để trống')
            .typeError('Số lượng chỉ nhập số')
            .integer('Số lượng chỉ nhập số nguyên')
            .positive('Số lượng không hợp lệ')
            .min(1, 'Số lượng không hợp lệ'),
          value: y
            .number()
            .typeError('Giá trị giảm không hợp lệ')
            .min(0.1, 'Giá trị giảm không hợp lệ'),
        }))
      }
      if (!this.valider.check(data)) {
        return false
      }
      return true
    },
    handleSave() {
      const payload = {
        id: this.coupon ? this.coupon.id : null,
        code: this.code,
        customer_id: this.customer ? this.customer.id : null,
        start_date: this.start_date,
        end_date: this.end_date,
        point: this.point ? parseFloat(this.point) : 0,
        quantity: this.quantity ? parseFloat(this.quantity) : 0,
        type: this.type ? parseFloat(this.type) : '',
        value: parseFloat(this.value),
        min_apply:
          this.isDiscountPercent || this.isDiscountMoney
            ? parseFloat(this.min_apply)
            : 0,
        max_apply: this.isDiscountPercent ? parseFloat(this.max_apply) : 0,
      }
      console.log(payload)
      if (!this.validateData(payload)) {
        return
      }
      this.$emit('save', payload)
    },
  },
  watch: {
    coupon: function () {
      if (this.coupon) {
        this.code = this.coupon.code
        this.start_date = this.coupon.start_date
        this.end_date = this.coupon.end_date
        this.point = this.coupon.point
        this.quantity = this.coupon.quantity
        this.type = this.coupon.type
        this.min_apply = this.coupon.min_apply
        this.max_apply = this.coupon.max_apply
        this.value = this.coupon.value
        this.customer = this.coupon.customer
      }
    },
    visible: function (v) {
      if (!v) {
        this.valider.reset()
        this.code = ''
        this.start_date = ''
        this.end_date = ''
        this.point = ''
        this.quantity = ''
        this.type = COUPON_TYPE_MONEY
        this.min_apply = ''
        this.max_apply = ''
        this.value = ''
        this.customer = null
      }
    },
  },
}
</script>
<style>
.vue-daterange-picker {
  width: 100%;
}
.vue-daterange-picker > div > div {
  line-height: 26px;
}
label {
  margin-bottom: 4px;
}
.modal-coupon.p-radio {
  margin-bottom: 0;
}
.modal-coupon .p-radio label {
  padding-left: 17px !important;
}
.modal-coupon .p-radio label input {
  bottom: 4px !important;
}
.multiselect__single {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.p-radio {
  margin-bottom: 0;
}
.daterangepicker .calendars .calendar-table {
  height: auto !important;
}
.form-control.hourselect,
.form-control.minuteselect {
  text-align: center;
  height: auto !important;
  position: unset;
  left: unset;
  top: unset;
  background: unset;
  border: unset;
  box-sizing: unset;
  border-radius: unset !important;
  font-size: unset;
  box-shadow: none;
  transition: unset;
  padding: unset;
  color: unset;
}
</style>
