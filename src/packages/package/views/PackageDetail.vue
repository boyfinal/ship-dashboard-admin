<template>
  <div class="package-detail pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'list-package' }" class="text">
            <span class="page-header_back_icon">
              <p-svg name="chevron-left"></p-svg>
            </span>
            <span>Quản lý vận đơn</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info">
            <div>
              <div>LionBay tracking</div>
              <div class="package-code"
                >{{
                  $evaluate('package_detail.package.package_code?.code') ||
                  'N/A'
                }}
              </div>
            </div>
            <div>
              <div>Khách hàng </div>
              <div>{{
                $evaluate('package_detail.package.user ?.full_name')
              }}</div>
            </div>
            <div>
              <div>Dịch vụ </div>
              <div>{{ $evaluate('package_detail.package.service?.name') }}</div>
            </div>
            <div v-if="package_detail.package.tracking">
              <div>Last mile tracking </div>
              <div>
                <a
                  target="_blank"
                  :href="`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${package_detail.package.tracking.tracking_number}`"
                >
                  {{
                    $evaluate('package_detail.package.tracking.tracking_number')
                  }}
                </a>
              </div>
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
            <p-button
              type="danger"
              class="btn btn-danger"
              @click="handleCancelPackage"
              v-if="isHasCancel"
            >
              <span>Hủy đơn</span>
            </p-button>
            <p-button
              type="info"
              @click="handleModal"
              class="btn-primary-custom ml-7"
              v-if="showButtonEdit && !isReship"
            >
              Sửa đơn
            </p-button>
            <p-button
              type="info"
              @click="handleModal"
              class="btn-primary-custom ml-7"
              v-if="showButtonEdit && isReship"
            >
              Reship
            </p-button>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="">
          <div class="">
            <div class="row">
              <div class="col-6">
                <div class="row mb-24">
                  <div class="col">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Người nhận</div>
                      </div>
                      <div class="card-content">
                        <div class="row">
                          <div class="col-5 mb-8">Họ và tên:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.recipient')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Điện thoại:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.phone_number')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Địa chỉ:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.address_1')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Địa chỉ phụ:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.address_2')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Thành phố:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.city')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã vùng:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.state_code')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã bưu điện:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.zipcode')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5">Mã quốc gia:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.country_code')
                            }}</div></div
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Thông tin hàng hóa</div>
                      </div>
                      <div class="card-content">
                        <div class="row">
                          <div class="col-5 mb-8">Chi tiết hàng hóa:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.detail')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã đơn hàng:</div>
                          <div class="col-7"
                            ><div>{{
                              $evaluate('package_detail.package.order_number')
                            }}</div></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Trọng lượng:</div>
                          <div class="col-7"
                            ><div
                              >{{ $evaluate('package_detail.package.weight')
                              }}<span v-if="isOverThanOld('weight')">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_weight'
                                  )
                                }})
                              </span></div
                            ></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Dài:</div>
                          <div class="col-7"
                            ><div
                              >{{ $evaluate('package_detail.package.length')
                              }}<span v-if="isOverThanOld()">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_length'
                                  )
                                }})
                              </span></div
                            ></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Rộng:</div>
                          <div class="col-7"
                            ><div
                              >{{ $evaluate('package_detail.package.width')
                              }}<span v-if="isOverThanOld()">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_width'
                                  )
                                }})
                              </span></div
                            ></div
                          >
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Cao:</div>
                          <div class="col-7"
                            ><div
                              >{{ $evaluate('package_detail.package.height')
                              }}<span v-if="isOverThanOld()">
                                ({{
                                  $evaluate(
                                    'package_detail.package.actual_height'
                                  )
                                }})
                              </span></div
                            ></div
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="card-block mb-0">
                      <div class="card-header">
                        <div class="card-title">Trạng thái</div>
                      </div>
                      <div class="card-content">
                        <div class="mb-16">
                          <div class="row">
                            <div class="col-5 mb-8">Trạng thái đơn:</div>
                            <div class="col-7">
                              <span
                                v-if="
                                  package_detail.package.status &&
                                  package_detail.package.status > 0
                                "
                                v-status="package_detail.package.status"
                              ></span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-5 mb-8">Trạng thái kho:</div>
                            <div class="col-7">
                              <span
                                v-if="
                                  package_detail.package.status &&
                                  package_detail.package.status > 0
                                "
                                v-status="package_detail.package.status"
                                type="warehouse"
                              ></span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-5">Trạng thái khiếu nại:</div>
                            <div class="col-7">
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
                    </div>
                  </div>
                  <div class="col" v-if="package_detail.package.package_return">
                    <div class="card-block mb-0">
                      <div class="card-header">
                        <div class="card-title">Đơn hàng return</div>
                      </div>
                      <div class="card-content">
                        <div class="mb-16">
                          <div class="row mb-8">
                            <div class="col-4 pr-0">Ngày trả hàng:</div>
                            <div class="col-8 pl-0"
                              ><div>{{
                                package_detail.package.package_return.created_at
                                  | datetime('dd/MM/yyyy')
                              }}</div>
                            </div>
                          </div>
                          <div class="row mb-8">
                            <div class="col-4 pr-0">Lý do trả hàng:</div>
                            <div class="col-8 pl-0"
                              ><div>{{
                                package_detail.package.package_return.reason
                              }}</div>
                            </div>
                          </div>
                          <div class="row mb-16">
                            <div class="col-4 pr-0">Nguyên nhân:</div>
                            <div class="col-8 pl-0">
                              <div>{{
                                package_detail.package.package_return.content
                              }}</div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-12">
                              <p style="margin-bottom: 8px"
                                ><strong>Bằng chứng:</strong></p
                              >
                              <p
                                style="margin-bottom: 4px"
                                v-for="item in package_detail.package
                                  .package_return.images"
                                :key="item.uid"
                              >
                                <a
                                  style="
                                    text-decoration: underline;
                                    color: #004e41;
                                  "
                                  href="javascript:void(0)"
                                  @click="downloadReturnFile(item)"
                                  >{{
                                    item.substring(item.lastIndexOf('/') + 1)
                                  }}</a
                                >
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="!displayDeliverDetail"
                class="col-6"
                style="padding: 0 30px 0 30px"
              >
                <div class="row" style="height: 100%">
                  <div class="col-12 p-0">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Hành trình đơn</div>
                        <div class="card-action ml-24">
                          <a href="#" @click="changeDisplayDeliverDetail()"
                            >Lịch sử đơn</a
                          >
                        </div>
                      </div>
                      <div class="card-content deliver-log">
                        <div class="timeline-new">
                          <div
                            v-for="(item, i) in displayDeliverLogs"
                            :key="i"
                            :class="{
                              'first-item':
                                i === 0 && timelinePagination.currentPage === 1,
                            }"
                            class="timeline-item-new"
                          >
                            <div class="item__right">
                              <div class="title">{{ item.name }}</div>
                            </div>
                            <div
                              v-for="(it, j) in item.data"
                              :key="j"
                              class="item__right__data"
                              :class="{
                                'first-data': j === 0,
                              }"
                            >
                              <div class="time col-2 pl-0">
                                {{ it.ship_time | datetime('HH:mm:ss') }}</div
                              >
                              <div class="des col-10 pl-0">
                                <span v-html="it.text"></span>
                                <span class="location" v-if="it.location">
                                  ___{{ it.location }}</span
                                ></div
                              >
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
                style="padding: 0 30px 0 30px"
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

                        <div class="card-title ml-24">Lịch sử đơn</div>
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
                                  <td style="text-align: right">{{
                                    item.fee | formatPrice
                                  }}</td>
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
                <div class="col-6" style="padding: 0px 25px 0px 0px">
                  <div class="card-block" style="height: auto">
                    <div class="card-header">
                      <div class="card-title">Phí phát sinh</div>
                    </div>
                    <div class="card-content" v-if="mapExtraFee.length">
                      <div
                        class="row"
                        v-for="(item, i) in mapExtraFee"
                        :key="i"
                      >
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
                  <div class="card-block" style="height: auto">
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
      :is-edit-order-return="isEditOrderReturn"
      :is-re-label="isReLabel"
      :visible.sync="isVisibleModal"
      @submit="handleUpdate"
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

    <modal-reship
      :visible.sync="isVisibleModalReship"
      :current="package_detail.package"
      @submit="reshipHandle"
    ></modal-reship>

    <OverLoading :is-loading="isSubmitting" />
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
.bold-line {
  font-weight: 600;
}
.through-line,
.through-line td {
  text-decoration-line: line-through;
  color: #aaabab !important;
}
</style>
<script>
import { mapState, mapActions } from 'vuex'
import { printImage } from '@core/utils/print'

import {
  FETCH_PACKAGE_DETAIL,
  FETCH_LIST_SERVICE,
  CANCEL_PACKAGES,
  RESHIP_PACKAGE,
  UPDATE_PACKAGE,
} from '../store/index'
import mixinChaining from '@/packages/shared/mixins/chaining'
import ModalEditOrder from '../components/ModalEditOrder'
// import { LIST_SENDER } from '../../setting/store'
import {
  PACKAGE_STATUS_TAB,
  CHANGE_PACKAGE_TYPE,
  DELIVER_LOG_PACKAGE,
  PACKAGE_STATUS_CANCELLED,
  PACKAGE_STATUS_DELIVERED,
  PACKAGE_STATUS_IN_TRANSIT,
  PACKAGE_STATUS_IMPORT_HUB,
  PACKAGE_STATUS_RETURNED,
  PACKAGE_STATUS_CREATED,
  PACKAGE_STATUS_EXPIRED,
  PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER,
  PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT,
  PACKAGE_ALERT_TYPE_HUB_RETURN,
  PACKAGE_STATUS_ARCHIVED,
} from '@/packages/package/constants'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import { extension } from '@core/utils/url'
import api from '../api'
import { truncate } from '@core/utils/string'
import { cloneDeep } from '@core/utils'
import ModalReship from '../components/ModalReship'
import OverLoading from '@components/shared/OverLoading'
import Uniq from 'lodash/uniq'
import { datetime } from '../../../core/utils/datetime'
import Browser from '@core/helpers/browser'
export default {
  name: 'PackageDetail',
  mixins: [mixinChaining],
  components: { ModalEditOrder, ModalConfirm, ModalReship, OverLoading },
  data() {
    return {
      isFetching: true,
      isSubmitting: false,
      packageID: 0,
      displayDeliverDetail: false,
      isVisibleModal: false,
      isVisiblePopupMoreExtraFee: false,
      isVisibleConfirmWayBill: false,
      isEditOrderReturn: false,
      isReLabel: false,
      isVisibleModalReship: false,
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
    showButtonEdit() {
      const { status, tracking } = (this.package_detail || {}).package || {}
      if (!status) return false

      const listStatus = [
        PACKAGE_STATUS_CANCELLED,
        PACKAGE_STATUS_ARCHIVED,
        PACKAGE_STATUS_DELIVERED,
        PACKAGE_STATUS_IN_TRANSIT,
        PACKAGE_STATUS_EXPIRED,
      ]

      return (
        (listStatus.includes(status) == false && !tracking) ||
        ((this.$isSupport() || this.$isAdmin()) && this.isAlertReturn)
      )
    },
    isAlertReturn() {
      return this.package_detail.package.alert === PACKAGE_ALERT_TYPE_HUB_RETURN
    },
    displayDeliverLogs() {
      const start =
        (this.timelinePagination.currentPage - 1) *
        this.timelinePagination.itemsPerPage

      let logs = this.package_detail.deliver_logs
        .slice(start, start + this.timelinePagination.itemsPerPage)
        .filter((log) => {
          return log.type !== PACKAGE_STATUS_CREATED
        })
        .map((log) => {
          let text = log.description
          switch (log.type) {
            case PACKAGE_STATUS_RETURNED:
              text = `${DELIVER_LOG_PACKAGE[log.type]} <p>Lí do: ${
                log.description
              }</p>`
              break
            default:
              text = log.description || DELIVER_LOG_PACKAGE[log.type]
          }
          return { ship_time: log.ship_time, text, location: log.location }
        })

      const times = logs.map((item) => datetime(item.ship_time, 'dd-MM-yyyy'))
      let ConvertData = []
      const uniqTimes = Uniq(times)
      uniqTimes.forEach((element) =>
        ConvertData.push({ name: element, data: [] })
      )
      ConvertData.forEach((x) =>
        logs.forEach(function (it) {
          if (datetime(it.ship_time, 'dd-MM-yyyy') == x.name) {
            x.data.push(it)
          }
        })
      )
      return ConvertData
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
      return PACKAGE_STATUS_CANCELLED
    },
    statusSuccess() {
      return PACKAGE_STATUS_DELIVERED
    },
    statusExpired() {
      return PACKAGE_STATUS_EXPIRED
    },
    statusShipping() {
      return PACKAGE_STATUS_IN_TRANSIT
    },
    statusImportHub() {
      return PACKAGE_STATUS_IMPORT_HUB
    },
    mapExtraFee() {
      let arr = cloneDeep(this.extraFee),
        result = []

      for (const ele of arr) {
        let index = result.findIndex(
          (x) => x.extra_fee_types.name == ele.extra_fee_types.name
        )
        if (index == -1) {
          result.push(ele)
        } else result[index].amount += ele.amount
      }
      return result
    },
    isReship() {
      return (
        this.package_detail.package.alert === PACKAGE_ALERT_TYPE_HUB_RETURN &&
        (this.$isAdmin() || this.$isSupport())
      )
    },
    isHasCancel() {
      const status = ((this.package_detail || {}).package || {}).status
      if (!status) return false

      return (
        [
          PACKAGE_STATUS_CANCELLED,
          PACKAGE_STATUS_ARCHIVED,
          PACKAGE_STATUS_DELIVERED,
          PACKAGE_STATUS_IN_TRANSIT,
          PACKAGE_STATUS_EXPIRED,
          PACKAGE_STATUS_IMPORT_HUB,
        ].includes(status) == false
      )
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
      RESHIP_PACKAGE,
      UPDATE_PACKAGE,
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
    async downloadReturnFile(file) {
      const res = await api.fetchFile({
        url: file,
        type: 'return_packages',
      })
      if (res && !res.error) {
        Browser.downloadBlob(res, file.split('/').pop())
      }
    },
    changeDisplayDeliverDetail() {
      this.displayDeliverDetail = !this.displayDeliverDetail
    },
    handleModal() {
      this.isVisibleModal = true
      if (this.statusShipping && this.isAlertReturn) {
        this.isEditOrderReturn = true
      }
      if (
        this.package_detail.package.alert === PACKAGE_ALERT_TYPE_HUB_RETURN &&
        (this.$isAdmin() || this.$isSupport())
      ) {
        this.isReLabel = true
      }
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
      if (
        this.package_detail.package.status ==
          PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER ||
        this.package_detail.package.status ==
          PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT
      ) {
        this.visibleConfirmCancel = false
        return this.$toast.open({
          type: 'error',
          message: 'Đơn hàng không thể hủy vì đang nằm trong kiện',
          duration: 3000,
        })
      }
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

    isOverThanOld(prop) {
      if (!this.package_detail.package) {
        return false
      }

      if (prop == 'weight') {
        return (
          this.package_detail.package.actual_weight >
          this.package_detail.package[prop]
        )
      }
      return (
        this.package_detail.package.actual_height *
          this.package_detail.package.actual_width *
          this.package_detail.package.actual_length >
        this.package_detail.package.height *
          this.package_detail.package.width *
          this.package_detail.package.length
      )
    },

    showModalReship() {
      this.isVisibleModalReship = true
    },
    async reshipHandle({ amount, description }) {
      this.isVisibleModalReship = false

      if (this.isSubmitting) return

      this.isSubmitting = true

      const res = await this.reshipPackage({
        id: this.packageID,
        amount,
        description,
      })
      if (res.error) {
        this.$toast.error(res.message, { duration: 3000 })
        this.isSubmitting = false
        return
      }

      this.$toast.success('Reship đơn hàng thành công', { duration: 3000 })
      await this.init()

      this.isSubmitting = false
    },

    async handleUpdate(params) {
      this.isVisibleModal = false
      console.log(params)

      if (this.isSubmitting) return

      this.isSubmitting = true

      let result = await this[UPDATE_PACKAGE](params)
      if (result.error) {
        this.$toast.error(result.message, { duration: 3000 })
        this.isSubmitting = false
        return
      }
      this.$toast.success('Sửa đơn hàng thành công', { duration: 3000 })
      await this.init2()
    },
  },

  watch: {
    package_detail: {
      handler: function (val) {
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
