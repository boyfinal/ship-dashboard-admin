<template>
  <div class="modal__edit-order">
    <p-modal :active="visible" @close="handleClose" :title="`Sửa đơn`">
      <template>
        <div class="modal__edit-order-header">
          <img
            style="margin-bottom: 3px"
            src="@/assets/img/InfoCircle.svg"
            alt="alert"
          />
          <b>Lưu ý:</b> <i>(<span>*</span>) Là các trường bắt buộc nhập.</i>
        </div>
        <div class="modal__edit-order-content">
          <div class="row sm-gutters  flex-nowrap">
            <div class="col-lg-6 col-xl-6 item-gutters ">
              <!--              <div class="card__w">-->
              <!--                <div class="card__w-header">-->
              <!--                  Người gửi-->
              <!--                </div>-->
              <!--                <div class="card__w-content">-->
              <!--                  <div class="card__w-item">-->
              <!--                    <label class="card__w-label">-->
              <!--                      Họ và tên: <span>*</span>-->
              <!--                    </label>-->
              <!--                    <div class="card__w-input">-->
              <!--                      <multiselect-->
              <!--                        class="multiselect-custom dropdown-reason"-->
              <!--                        v-model="sender"-->
              <!--                        :options="senders"-->
              <!--                        placeholder="Chọn một "-->
              <!--                        @select="handleSelect"-->
              <!--                        :custom-label="customLabel"-->
              <!--                      ></multiselect>-->
              <!--                    </div>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->

              <div class="card__w">
                <div class="card__w-header">
                  Người nhận
                </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Họ và tên: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="vd. Nguyen Van A"
                        type="fullname"
                        v-model="form.fullname"
                        :input="form.fullname"
                        name="name"
                        :error="valider.error('fullname')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Điện thoại:
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập số điện thoại"
                        type="phonenumber"
                        ref="email"
                        v-model="form.phone"
                        :input="form.phone"
                        name="phone"
                        :error="valider.error('phone')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Thành phố: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập thành phố"
                        type="text"
                        v-model="form.city"
                        :input="form.city"
                        name="city"
                        :error="valider.error('city')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Địa chỉ: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập địa chỉ"
                        type="text"
                        v-model="form.address"
                        :input="form.address"
                        name="address"
                        :error="valider.error('address')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Địa chỉ phụ:
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập địa chỉ phụ"
                        type="text"
                        v-model="form.address2"
                        :input="form.address2"
                        name="address2"
                        :error="valider.error('address2')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã vùng<br />
                      (state): <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập mã vùng"
                        type="text"
                        v-model="form.state"
                        :input="form.state"
                        name="state"
                        :error="valider.error('state')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã bưu điện: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập mã bưu điện"
                        type="text"
                        v-model="form.postcode"
                        :input="form.postcode"
                        name="postcode"
                        :error="valider.error('postcode')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã quốc gia: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập mã quốc gia"
                        type="text"
                        v-model="form.countrycode"
                        :input="form.countrycode"
                        name="countrycode"
                        :error="valider.error('countrycode')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-6 item-gutters">
              <div class="card__w">
                <div class="card__w-header">
                  Thông tin hàng hóa
                </div>
                <div class="card__w-content">
                  <div class="card__w-item" v-if="false">
                    <label class="card__w-label">
                      Danh sách đơn hàng:
                    </label>
                    <div class="card__w-input">
                      <multiselect
                        class="multiselect-custom dropdown-reason"
                        v-model="item"
                        :options="products"
                        placeholder="Chọn một "
                        @select="handleSelect"
                        :custom-label="customLabel"
                        :disabled="isDisable"
                        @remove="handleRemove"
                      ></multiselect>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Chi tiết hàng hóa : <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chi tiết hàng hóa"
                        type="text"
                        v-model="form.detail"
                        :input="form.detail"
                        name="detail"
                        :error="valider.error('detail')"
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Trọng lượng: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập trọng lượng"
                        type="text"
                        v-model="form.weight"
                        :input="form.weight"
                        name="weight"
                        :disabled="isDisable"
                        :error="valider.error('weight')"
                      />
                      <div class="card__w-unit">gram</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Dài: <span>*</span> </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chiều dài "
                        type="text"
                        v-model="form.length"
                        :input="form.length"
                        name="length"
                        :disabled="isDisable"
                        :error="valider.error('length')"
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Rộng: <span>*</span> </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chiều rộng "
                        type="text"
                        v-model="form.width"
                        :input="form.width"
                        name="width"
                        :disabled="isDisable"
                        :error="valider.error('width')"
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Cao: <span>*</span> </label>
                    <div class="card__w-input">
                      <p-input
                        placeholder="Nhập chiều cao "
                        type="text"
                        v-model="form.height"
                        :input="form.height"
                        name="height"
                        :disabled="isDisable"
                        :error="valider.error('height')"
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div class="card__w-header">
                  Dịch vụ gửi
                </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Dịch vụ gửi: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <multiselect
                        class="multiselect-custom dropdown-reason"
                        v-model="service"
                        :options="services"
                        placeholder="Chọn một"
                        :allow-empty="false"
                        @select="handleSelectService"
                        :custom-label="customLabel"
                      ></multiselect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="modal__edit-order-footer">
          <div class="total-title">
            Tổng cước:
            <span class="total-number">{{ 0 | formatPrice }}</span>
            <div class="text">Bảng giá không áp dụng cho hành trình này!</div>
          </div>
          <div class="divider">
            <div class="notch"></div>
            <div class="notch-bt"></div>
          </div>
          <div class="total-action">
            <p-button :type="`default`" class="btn" @click="handleClose"
              >Hủy bỏ</p-button
            >
            <p-button
              class="btn btn-info"
              :disabled="isUpdate"
              @click="handleUpdate"
              >Cập nhật</p-button
            >
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { FETCH_LIST_PRODUCTS, GET_SERVICE, UPDATE_PACKAGE } from '../store'
import PButton from '../../../../uikit/components/button/Button'
import valider from '@core/valider'
// import {GET_SENDER, LIST_SENDER} from "../../../setting/store";

export default {
  name: 'ModalEditOrder',
  components: { PButton },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info_user: {
      type: Object,
      default: () => {},
    },
    total: {
      type: Number,
    },
  },
  computed: {
    ...mapState('package', {
      package_detail: (state) => state.package_detail,
      products: (state) => state.products,
    }),
    ...mapGetters('package', {
      services: GET_SERVICE,
    }),
  },
  data() {
    return {
      item: null,
      sender: null,
      service: {
        id: 0,
        name: '',
      },
      form: {
        fullname: '',
        phone: '',
        city: '',
        state: '',
        postcode: '',
        note: '',
        code: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        countrycode: '',
        detail: '',
        address: '',
        address2: '',
      },
      isDisable: true,
      isUpdate: false,
      valider: null,
    }
  },
  created() {
    this.init()
    this.valider = valider.schema((y) => ({
      fullname: y
        .string()
        .required('Tên không để trống')
        .matches(
          /^[a-zA-z0-9 \u00A1-\uFFFF!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]{0,150}$/,
          'Tên không hợp lệ'
        ),
      phone: y
        .string()
        .notRequired()
        .matches(
          /^$|^[0-9+()-. ]+$/,
          'Nhập số điện thoại từ 10 đến 11 chữ số, bắt đầu bằng 0,84 hoặc +84'
        ),
      city: y
        .string()
        .required('Thành phố không để trống')
        .matches(
          /^[\s+a-zA-Z0-9_.,\-\u00A1-\uFFFF]{1,50}$/,
          'Thành phố không hợp lệ'
        ),
      state: y
        .string()
        .required('Mã vùng không để trống')
        .matches(
          /^[\s+a-zA-Z0-9_.,\-\u00A1-\uFFFF]{1,15}$/,
          'Mã vùng không hợp lệ'
        ),
      postcode: y
        .string()
        .required('Mã bưu điện không để trống')
        .matches(/^[0-9\-_ ]{1,15}$/, 'Mã bưu điện không hợp lệ'),
      weight: y
        .string()
        .required('Số cân nặng không để trống')
        .matches(
          /^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/,
          'Số  cân nặng không hợp lệ'
        ),
      length: y
        .string()
        .required('Số đo chiều dài không để trống')
        .matches(
          /^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/,
          'Số đo chiều dài không hợp lệ'
        ),
      width: y
        .string()
        .required('Số đo chiều rộng không để trống')
        .matches(
          /^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/,
          'Số đo chiều rộng không hợp lệ'
        ),
      height: y
        .string()
        .required('Số đo chiều cao không để trống')
        .matches(
          /^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/,
          'Số đo chiều cao không hợp lệ'
        ),
      address: y
        .string()
        .required('Địa chỉ không để trống')
        .matches(/[A-Za-z0-9'.\-\s,]/, 'Địa chỉ không hợp lệ'),
      address2: y.string().matches(/[A-Za-z0-9'.\-\s,]/, {
        message: 'Địa chỉ phụ không hợp lệ',
        excludeEmptyString: true,
      }),
    }))
  },
  methods: {
    ...mapActions('package', [FETCH_LIST_PRODUCTS, UPDATE_PACKAGE]),
    async init() {
      await this[FETCH_LIST_PRODUCTS]()
      this.form.fullname = this.package_detail.package.recipient
      this.form.phone = this.package_detail.package.phone_number
      this.form.city = this.package_detail.package.city
      this.form.state = this.package_detail.package.state_code
      this.form.postcode = this.package_detail.package.zipcode
      this.form.note = this.package_detail.package.note
      this.form.code = this.package_detail.package.code
      this.form.items = this.package_detail.package.items
      this.form.weight = this.package_detail.package.weight
      this.form.length = this.package_detail.package.length
      this.form.width = this.package_detail.package.width
      this.form.height = this.package_detail.package.height
      this.form.countrycode = this.package_detail.package.country_code
      this.form.service = {
        id: this.package_detail.package.service
          ? this.package_detail.package.service.id
          : 0,
        name: this.package_detail.package.service
          ? this.package_detail.package.service.name
          : '',
      }
      this.form.address = this.package_detail.package.address_1
      this.form.address2 = this.package_detail.package.address_2
      this.form.detail = this.package_detail.package.detail
      this.service = this.form.service
    },
    handleClose() {
      this.form.fullname = ''
      this.form.phone = ''
      this.form.city = ''
      this.form.state = ''
      this.form.postcode = ''
      this.form.note = ''
      this.form.code = ''
      this.form.items = ''
      this.form.weight = ''
      this.form.length = ''
      this.form.width = ''
      this.form.height = ''
      this.form.countrycode = ''
      this.form.service = ''
      this.form.address = ''
      this.valider.errors = null
      this.$emit('update:visible', false)
    },
    customLabel(item) {
      return item.name
    },
    handleSelect(value) {
      this.form.width = value.width
      this.form.height = value.height
      this.form.weight = value.weight
      this.form.length = value.length
      this.isDisable = true
    },
    handleSelectService(value) {
      this.form.service = value
    },
    handleRemove() {
      this.isDisable = true
      this.form.weight = this.package_detail.package.weight
      this.form.length = this.package_detail.package.length
      this.form.width = this.package_detail.package.width
      this.form.height = this.package_detail.package.height
    },
    async handleUpdate() {
      if (!this.valider.check(this.form)) {
        return
      }
      this.isUpdate = true
      const { id } = this.$route.params
      const params = {
        id: id,
        recipient: this.form.fullname,
        phone_number: this.form.phone.trim(),
        address_1: this.form.address,
        city: this.form.city,
        state_code: this.form.state,
        zipcode: this.form.postcode,
        country_code: this.form.countrycode,
        detail: this.form.detail,
        weight: +this.form.weight,
        width: +this.form.width,
        length: +this.form.length,
        height: +this.form.height,
        service: this.form.service.name,
        note: this.form.note,
        address_2: this.form.address2,
      }
      let result = await this[UPDATE_PACKAGE](params)
      if (result.error) {
        this.isUpdate = false
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Sửa đơn thành công',
        duration: 3000,
      })
      this.isUpdate = false
      this.handleClose()
      this.$emit('create', true)
    },
  },
  watch: {
    visible: function() {
      this.init()
    },
  },
}
</script>
