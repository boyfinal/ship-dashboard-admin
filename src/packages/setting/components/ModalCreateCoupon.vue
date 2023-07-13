<template>
  <div class="modal-coupon">
    <p-modal :active="visible" @close="handleClose" :title="`Tạo mã Coupon`">
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
            :arr-status="this.search_status_filter"
          />
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-6">
          <label><b>Ngày bắt đầu:</b> <span style="color: red">*</span></label>
          <p-datepicker
            class="date"
            :format="'dd/mm/yyyy'"
            :label="`Chọn ngày bắt đầu`"
            :value="{ startDate: start_date }"
            :auto-apply="true"
            @update="selectStartDate"
            :single-date-picker="true"
            :opens="'center'"
          >
          </p-datepicker>
          <span class="invalid-error" v-if="valider.error('start_date')">
            {{ valider.error('start_date') }}
          </span>
        </div>
        <div class="col-6">
          <label><b>Ngày hết hạn:</b> <span style="color: red">*</span></label>
          <p-datepicker
            class="date"
            :format="'dd/mm/yyyy'"
            :label="`Chọn ngày hết hạn`"
            :value="{ endDate: end_date }"
            :auto-apply="true"
            @update="selectEndDate"
            :single-date-picker="true"
            :opens="'center'"
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
            min="0"
            class="mb-8"
            v-model="quantity"
            placeholder="Nhập số lượng"
            :error="valider.error('quantity')"
          ></p-input>
        </div>
      </div>
      <div class="row mb-16">
        <p-radio
          type="info"
          class="col-3 radio-inline"
          v-model="type"
          :native-value="couponMoney"
          >Tặng tiền</p-radio
        >
        <p-radio
          type="info"
          class="col-3 adio-inline"
          v-model="type"
          :native-value="couponDiscount"
          >Giảm giá</p-radio
        >
        <div class="col-12" v-if="valider.error('type')">
          <span class="invalid-error">
            {{ valider.error('type') }}
          </span>
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-6">
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
        <div class="col-6">
          <label
            ><b>Giá trị áp dụng tối đa:</b>
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
              Tạo mã Coupon
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
  COUPON_TYPE_DISCOUNT,
  USER_STATUS_ACTIVE,
  USER_STATUS_DEACTIVE,
} from '../constants'
import valider from '@core/valider'
import UserResource from '@/components/shared/resource/UsersActive'
import { date } from '@core/utils/datetime'
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
  },
  computed: {
    couponMoney() {
      return COUPON_TYPE_MONEY
    },
    couponDiscount() {
      return COUPON_TYPE_DISCOUNT
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
      type: '',
      min_apply: '',
      max_apply: '',
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
      this.start_date = date(v.startDate, 'yyyy-MM-dd')
    },
    selectEndDate(v) {
      this.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
    handleSearch() {},
    initValidator() {
      this.valider = valider.schema((y) => ({
        code: y.string().required('Mã coupon không để trống'),
        start_date: y.string().required('Ngày bắt đầu không để trống'),
        end_date: y.string().required('Ngày kết thúc không để trống'),
        type: y.number().typeError('Chưa chọn loại coupon'),
        point: y
          .number()
          .required('Điểm mua không để trống')
          .typeError('Điểm mua chỉ nhập số')
          .min(1, 'Điểm mua không hợp lệ'),
        quantity: y
          .number()
          .required('Số lượng không để trống')
          .typeError('Số lượng chỉ nhập số')
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
      }))
    },
    handleSave() {
      const payload = {
        code: this.code,
        customer_id: this.customer.id,
        start_date: this.start_date,
        end_date: this.end_date,
        point: this.point ? parseInt(this.point) : 0,
        quantity: this.quantity ? parseInt(this.quantity) : 0,
        type: this.type ? parseInt(this.type) : '',
        min_apply: parseFloat(this.min_apply),
        max_apply: parseFloat(this.max_apply),
      }
      if (!this.valider.check(payload)) {
        return
      }
      this.$emit('save', payload)
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
</style>
