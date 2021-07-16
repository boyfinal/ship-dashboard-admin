<template>
  <div class="package-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-package' }" class="text">
            <img
              src="@/assets/img/chevron-left.svg"
              alt=""
              class="page-header_back_icon"
            />
            <span>Quản lý vận đơn</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info">
            <div>
              <div>Mã vận đơn</div>
              <div class="package-code">{{ package_detail.package.code }} </div>
            </div>
            <div>
              <div>Dịch vụ </div>
              <div>{{ $evaluate('package_detail.package.service?.name') }}</div>
            </div>
            <div>
              <div>Ngày tạo </div>
              <div>{{
                package_detail.package.created_at
                  | datetime('dd/MM/yyyy HH:mm:ss')
              }}</div>
            </div>
          </div>
          <div class="page-header__action">
            <a
              href="#"
              class="btn btn-danger"
              @click="handleCancelPackage"
              v-if="
                package_detail.package.status != statusCancel &&
                  package_detail.package.status != statusSuccess &&
                  package_detail.package.status != statusShipping
              "
            >
              <span>Hủy đơn</span>
            </a>
            <a
              @click="handleModal"
              href="#"
              class="btn btn-primary-custom ml-7"
              v-if="
                package_detail.package.status != statusCancel &&
                  package_detail.package.status != statusSuccess &&
                  package_detail.package.status != statusShipping
              "
            >
              <span>Sửa đơn</span>
            </a>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="">
          <div class="">
            <div class="row">
              <div class="col-3">
                <div class="card-block">
                  <div class="card-header">
                    <div class="card-title">Người nhận</div>
                  </div>
                  <div class="card-content">
                    <div class="row">
                      <div class="col-4 mb-8">Họ và tên:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.recipient')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Điện thoại:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.phone_number')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Địa chỉ:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.address_1')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Địa chỉ phụ:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.address_2')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Thành phố:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.city')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Mã vùng:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.state_code')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Mã bưu điện:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.zipcode')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4">Mã quốc gia:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.country_code')
                        }}</div></div
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card-block">
                  <div class="card-header">
                    <div class="card-title">Trạng thái</div>
                  </div>
                  <div class="card-content">
                    <div class="row">
                      <div class="col-4 mb-8">Trạng thái đơn:</div>
                      <div class="col-8"
                        ><div
                          v-if="
                            package_detail.package.status &&
                              package_detail.package.status > 0
                          "
                          >{{
                            mapStatus[package_detail.package.status].value
                          }}</div
                        >
                        <div
                          v-if="
                            !package_detail.package.status ||
                              package_detail.package.status < 1
                          "
                        >
                          N/A
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Trạng thái kho:</div>
                      <div class="col-7">
                        <div
                          v-if="
                            package_detail.package.status &&
                              package_detail.package.status > 0 &&
                              mapStatusWareHouse[package_detail.package.status]
                          "
                          >{{
                            mapStatusWareHouse[package_detail.package.status]
                              .value
                          }}</div
                        >
                        <div
                          v-if="
                            !package_detail.package.status ||
                              package_detail.package.status < 1 ||
                              mapStatusWareHouse[package_detail.package.status]
                          "
                        >
                          N/A
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4">Trạng thái khiếu nại:</div>
                      <div class="col-8">
                        <div v-if="package_detail.status_ticket">
                          Có
                        </div>
                        <div v-if="!package_detail.status_ticket">
                          Không
                        </div></div
                      >
                    </div>
                  </div>
                </div>
                <div class="card-block">
                  <div class="card-header">
                    <div class="card-title">Thông tin hàng hóa</div>
                  </div>
                  <div class="card-content">
                    <div class="row">
                      <div class="col-4 mb-8">Mã vận hàng:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.code')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Chi tiết hàng hóa:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.detail')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Mã đơn hàng:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.order_number')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Trọng lượng:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.weight')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Dài:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.length')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Rộng:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.width')
                        }}</div></div
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Cao:</div>
                      <div class="col-8"
                        ><div>{{
                          $evaluate('package_detail.package.height')
                        }}</div></div
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="!displayDeliverDetail"
                class="col-6"
                style="padding:0 30px 0 30px"
              >
                <div class="row">
                  <div class="col-12 p-0">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Hành trình đơn</div>
                        <div class="card-action"
                          ><a @click="changeDisplayDeliverDetail()" href="#"
                            >Lịch sử phát sinh</a
                          ></div
                        >
                      </div>
                      <div class="card-content deliver-log">
                        <div class="timeline">
                          <div
                            v-for="(item, i) in displayDeliverLogs"
                            :key="i"
                            :class="{
                              'first-item':
                                i === 0 && timelinePagination.currentPage === 1,
                            }"
                            class="timeline-item"
                          >
                            <div class="timeline-item__left">
                              <div>{{
                                item.created_at | datetime('dd/MM/yyyy')
                              }}</div>
                              <div>{{
                                item.created_at | datetime('HH:mm:ss')
                              }}</div>
                            </div>
                            <div class="timeline-item__right">
                              <div v-html="deliverLogPackage(item)"></div>
                            </div>
                          </div>
                        </div>
                        <div class="timeline__next-page">
                          <div
                            :class="{
                              'disable-next-page':
                                timelinePagination.currentPage <= 1,
                            }"
                            @click="previousTimeLinePage"
                            >Trước</div
                          ><div
                            :class="{
                              'disable-next-page':
                                timelinePagination.currentPage >=
                                  timelinePagination.numberPage ||
                                timelinePagination.numberPage <= 1,
                            }"
                            @click="nextTimeLinePage"
                            >Sau</div
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="displayDeliverDetail"
                class="col-6"
                style="padding:0 30px 0 30px"
              >
                <div class="row">
                  <div class="col-12 p-0">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-action"
                          ><a @click="changeDisplayDeliverDetail()" href="#"
                            >Hành trình đơn</a
                          ></div
                        >
                        <div class="card-title">Lịch sử phát sinh</div>
                      </div>
                      <div class="card-content">
                        <template>
                          <div class="table-responsive">
                            <table class="table table-hover" id="tbl-packages">
                              <thead>
                                <tr>
                                  <th>Thời gian</th>
                                  <th>Người thực hiện</th>
                                  <th>Loại thay đổi</th>
                                  <th>Nội dung cũ</th>
                                  <th>Nội dung mới</th>
                                  <th>Phí phát sinh</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(item, i) in displayAuditLogs"
                                  :key="i"
                                >
                                  <td>
                                    {{
                                      item.created_at
                                        | datetime('dd/MM/yyyy - HH:mm')
                                    }}
                                  </td>
                                  <td>{{ item.updated_user_name }}</td>
                                  <td>
                                    {{
                                      $evaluate(
                                        `changePackageType[${item.type}]`
                                      ) || ''
                                    }}
                                  </td>
                                  <td>
                                    <p-tooltip
                                      :label="item.old_value"
                                      size="large"
                                      position="top"
                                      type="dark"
                                      :active="item.old_value.length > 15"
                                    >
                                      {{ truncate(item.old_value, 15) }}
                                    </p-tooltip>
                                  </td>
                                  <td>
                                    <p-tooltip
                                      :label="item.value"
                                      size="large"
                                      position="top"
                                      type="dark"
                                      :active="item.value.length > 15"
                                    >
                                      {{ truncate(item.value, 15) }}
                                    </p-tooltip>
                                  </td>
                                  <td>{{ item.extra_fee | formatPrice }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </template>
                        <div class="timeline__next-page">
                          <div
                            :class="{
                              'disable-next-page':
                                auditPagination.currentPage <= 1,
                            }"
                            @click="previousAuditLogPage"
                            >Trước</div
                          ><div
                            :class="{
                              'disable-next-page':
                                auditPagination.currentPage >=
                                  auditPagination.numberPage ||
                                auditPagination.numberPage <= 1,
                            }"
                            @click="nextAuditLogPage"
                            >Sau</div
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6 p-0 row fee">
                <div class="fee-border"></div>
                <div class="col-6" style="padding: 0px 25px 0px 0px">
                  <div class="card-block">
                    <div class="card-header">
                      <div class="card-title">Phí phát sinh</div>
                    </div>
                    <div class="card-content" v-if="extraFee.length">
                      <div class="row" v-for="(item, i) in extraFee" :key="i">
                        <div class="col-8 mb-8"
                          >{{ item.extra_fee_types.name }} :</div
                        >
                        <div class="col-4"
                          ><div>{{ item.amount | formatPrice }}</div></div
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6" style="padding: 0px 25px 0px 0px">
                  <div class="card-block">
                    <div class="card-header">
                      <div class="card-title">Phí</div>
                    </div>
                    <div class="card-content">
                      <div class="row">
                        <div class="col-8 mb-8">Phí giao hàng:</div>
                        <div class="col-4"
                          ><div>{{
                            $evaluate('package_detail.package?.shipping_fee')
                              | formatPrice
                          }}</div></div
                        >
                      </div>
                      <div class="row">
                        <div class="col-8 mb-8">Phí phát sinh:</div>
                        <div class="col-4 more-extra-fee"
                          ><div>{{ sumExtraFee | formatPrice }}</div></div
                        >
                      </div>
                      <div class="row sum-price">
                        <div class="col-8">Tổng cước:</div>
                        <div class="col-4"
                          ><div>{{ sumFee | formatPrice }}</div></div
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-edit-order
      :visible.sync="isVisibleModal"
      :info_user="package_detail"
      @create="init2"
      :total="sumFee"
    >
    </modal-edit-order>
    <modal-confirm
      :visible.sync="isVisibleConfirmWayBill"
      v-if="isVisibleConfirmWayBill"
      :actionConfirm="actions.wayBill.button"
      :description="actions.wayBill.Description"
      :title="actions.wayBill.title"
      :type="actions.wayBill.type"
      :disabled="actions.wayBill.disabled"
      :loading="actions.wayBill.loading"
      @action="handleActionWayBill"
    ></modal-confirm>

    <modal-confirm
      :visible.sync="visibleConfirmCancel"
      v-if="visibleConfirmCancel"
      :actionConfirm="actions.cancelPackage.button"
      :cancel="actions.cancelPackage.cancel"
      :description="actions.cancelPackage.Description"
      :title="actions.cancelPackage.title"
      :type="actions.cancelPackage.type"
      :disabled="actions.cancelPackage.disabled"
      :loading="actions.cancelPackage.loading"
      @action="cancelPackageAction"
    ></modal-confirm>
  </div>
</template>

<style scoped>
.sum-price {
  border-top: 1px solid #cfd0d0;
  margin-top: 16px;
  padding-top: 16px;
}

.sum-price:last-child {
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
  color: #313232;
}
.disable-extra-fee {
  color: #cfd0d0;
}
</style>
<script>
import { mapState, mapActions } from 'vuex'
import { printImage } from '@core/utils/print'

import {
  FETCH_PACKAGE_DETAIL,
  FETCH_LIST_SERVICE,
  CANCEL_PACKAGES,
} from '../store/index'
import mixinChaining from '@/packages/shared/mixins/chaining'
import ModalEditOrder from '../components/ModalEditOrder'
// import { LIST_SENDER } from '../../setting/store'
import {
  PACKAGE_STATUS_TAB,
  MAP_NAME_STATUS_PACKAGE,
  CHANGE_PACKAGE_TYPE,
  DELIVER_LOG_PACKAGE,
  PackageStatusCancelled,
  PackageStatusDelivered,
  PackageStatusInTransit,
  MAP_NAME_STATUS_WAREHOUSE,
} from '@/packages/package/constants'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import { extension } from '@core/utils/url'
import api from '../api'
import { truncate } from '@core/utils/string'
export default {
  name: 'PackageDetail',
  mixins: [mixinChaining],
  components: { ModalEditOrder, ModalConfirm },
  data() {
    return {
      isFetching: true,
      packageID: 0,
      displayDeliverDetail: false,
      isVisibleModal: false,
      isVisiblePopupMoreExtraFee: false,
      isVisibleConfirmWayBill: false,
      timelinePagination: {
        numberPage: 0,
        itemsPerPage: 10,
        currentPage: 1,
      },
      auditPagination: {
        numberPage: 0,
        itemsPerPage: 10,
        currentPage: 1,
      },
      actions: {
        wayBill: {
          type: 'primary',
          title: 'Xác nhận vận đơn',
          button: 'Vận đơn',
          Description: '',
          disabled: false,
          loading: false,
        },
        cancelPackage: {
          type: 'primary',
          title: 'Xác nhận hủy đơn',
          button: 'Hủy đơn',
          cancel: 'Bỏ qua',
          Description: '',
          disabled: false,
          loading: false,
        },
      },
      visibleConfirmCancel: false,
      isVisibleModalLabel: false,
      blob: null,
    }
  },
  computed: {
    ...mapState('package', {
      package_detail: (state) => state.package_detail,
    }),
    displayDeliverLogs() {
      const start =
        (this.timelinePagination.currentPage - 1) *
        this.timelinePagination.itemsPerPage
      return this.package_detail.deliver_logs.slice(
        start,
        start + this.timelinePagination.itemsPerPage
      )
    },
    displayAuditLogs() {
      const start =
        (this.auditPagination.currentPage - 1) *
        this.auditPagination.itemsPerPage
      return this.package_detail.audit_logs.slice(
        start,
        start + this.auditPagination.itemsPerPage
      )
    },

    sumExtraFee() {
      if (
        !this.package_detail.extra_fee ||
        this.package_detail.extra_fee.length <= 0
      ) {
        return 0
      }
      return this.package_detail.extra_fee.reduce((accu, curr) => ({
        amount: accu.amount + curr.amount,
      })).amount
    },
    sumFee() {
      return this.package_detail.package.shipping_fee + this.sumExtraFee
    },
    mapStatus() {
      return MAP_NAME_STATUS_PACKAGE
    },
    mapStatusWareHouse() {
      return MAP_NAME_STATUS_WAREHOUSE
    },
    isImage() {
      const ext = extension(this.package_detail.package.label)
      return ['png', 'jpg', 'jpeg'].includes(ext)
    },
    extraFee() {
      return this.package_detail.extra_fee ? this.package_detail.extra_fee : []
    },
    packageStatus() {
      return PACKAGE_STATUS_TAB
    },
    changePackageType() {
      return CHANGE_PACKAGE_TYPE
    },
    statusCancel() {
      return PackageStatusCancelled
    },
    statusSuccess() {
      return PackageStatusDelivered
    },
    statusShipping() {
      return PackageStatusInTransit
    },
  },
  created() {
    this.packageID = parseInt(this.$route.params.id, 10)
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('package', [
      FETCH_PACKAGE_DETAIL,
      FETCH_LIST_SERVICE,
      CANCEL_PACKAGES,
    ]),
    truncate,
    // ...mapActions('setting', [LIST_SENDER]),
    async init() {
      this.isFetching = true
      await this.fetchPackage(this.packageID)
      await this[FETCH_LIST_SERVICE]()
      this.isFetching = false
    },
    init2() {
      location.reload()
    },
    changeDisplayDeliverDetail() {
      this.displayDeliverDetail = !this.displayDeliverDetail
    },
    handleModal() {
      this.isVisibleModal = true
    },
    previousTimeLinePage() {
      this.timelinePagination.currentPage <= 1
        ? (this.timelinePagination.currentPage = 1)
        : (this.timelinePagination.currentPage -= 1)
    },
    nextTimeLinePage() {
      this.timelinePagination.currentPage =
        this.timelinePagination.currentPage >=
        this.timelinePagination.numberPage
          ? this.timelinePagination.numberPage
          : this.timelinePagination.currentPage + 1
    },
    previousAuditLogPage() {
      this.auditPagination.currentPage <= 1
        ? (this.auditPagination.currentPage = 1)
        : (this.auditPagination.currentPage -= 1)
    },
    nextAuditLogPage() {
      this.auditPagination.currentPage =
        this.auditPagination.currentPage >= this.auditPagination.numberPage
          ? this.auditPagination.numberPage
          : this.auditPagination.currentPage + 1
    },
    showPopupMoreExtraFee() {
      this.isVisiblePopupMoreExtraFee = true
    },
    hiddenPopupMoreExtraFee() {
      this.isVisiblePopupMoreExtraFee = false
    },

    handleCancelPackage() {
      this.actions.cancelPackage.Description = `Bạn có chắc chắn muốn hủy đơn?`
      this.visibleConfirmCancel = true
    },

    async cancelPackageAction() {
      let id = this.packageID

      let payload = {
        ids: [id],
      }

      this.actions.cancelPackage.loading = true
      const result = await this[CANCEL_PACKAGES](payload)
      this.visibleConfirmCancel = false
      this.actions.cancelPackage.loading = false
      if (!result || !result.success) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      this.init()
      this.$toast.open({
        type: 'success',
        message: 'Hủy đơn thành công',
        duration: 3000,
      })
    },

    async showContent() {
      document.activeElement && document.activeElement.blur()
      if (this.blob && this.isImage) {
        printImage(this.blob)
        return
      }
      const res = await api.fetchBarcodeFile({
        url: this.package_detail.package.label,
        type: 'labels',
      })
      if (!res && res.error) {
        this.$toast.open({
          type: 'error',
          message: res.errorMessage,
          duration: 3000,
        })
        return
      }

      try {
        this.blob = (window.webkitURL || window.URL).createObjectURL(res)
        printImage(this.blob)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
    deliverLogPackage(log) {
      return log.type === PackageStatusCancelled
        ? DELIVER_LOG_PACKAGE[log.type] +
            ` bởi <strong>${log.updated_user_name}</strong>`
        : DELIVER_LOG_PACKAGE[log.type]
    },
  },

  watch: {
    package_detail: {
      handler: function(val) {
        if (val.deliver_logs && val.deliver_logs.length > 0) {
          this.timelinePagination.numberPage = Math.ceil(
            val.deliver_logs.length / this.timelinePagination.itemsPerPage
          )
        }
        if (val.audit_logs && val.audit_logs.length > 0) {
          this.auditPagination.numberPage = Math.ceil(
            val.audit_logs.length / this.auditPagination.itemsPerPage
          )
        }
      },
      deep: true,
    },
  },
}
</script>
