<template>
  <div class="pages scan-in">
    <div class="page-content">
      <div class="mb-24">
        <div class="actions">
          <button class="btn btn-info" v-if="!iscan" @click="startHandle">
            <svgicon name="play" width="20" height="20" /> Bắt đầu quét
          </button>
          <button class="btn btn-danger" v-if="iscan" @click="stopHandle">
            <svgicon name="pause" width="20" height="20" />Dừng quét
          </button>
          <button class="btn btn-white ml-20" v-if="iscan">
            Số lượng đã quét: <b>{{ total }}</b>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          <div class="card mb-16">
            <div class="card-body">
              <div class="d-flex">
                <p-input
                  :disabled="disableInput"
                  v-model="keyword"
                  @keydown.enter.prevent="searchHandle"
                  placeholder="Nhập LionBay tracking"
                ></p-input>
                <button
                  @click.prevent="searchHandle"
                  :disabled="disableBtnScan"
                  class="btn btn-inline-info ml-3 text-nowrap"
                  >Quét</button
                >
                <button
                  class="btn btn-inline-info ml-3 text-nowrap"
                  :disabled="disableBtnAccept"
                  @click.prevent="acceptHandle"
                  >Xác nhận</button
                >
                <button
                  class="btn btn-inline-danger ml-3 text-nowrap"
                  :disabled="disableBtnReturn"
                  @click="showModalReturnHandle"
                  >Trả hàng</button
                >
              </div>
            </div>
          </div>
          <div class="card mb-16">
            <div class="card-header">
              <div class="card-title">Kiểm tra loại hàng</div>
            </div>
            <div class="card-body">
              <div class="package-info">
                <div class="d-flex">
                  <span>LionBay Tracking:</span>
                  <span>{{ codecurrent }}</span>
                </div>
                <div class="d-flex">
                  <span>Người gửi:</span>
                  <span>{{ customer }}</span>
                </div>
                <div class="d-flex">
                  <span>Chi tiết hàng hoá:</span>
                  <span>{{ current.detail }}</span>
                </div>
                <div class="d-flex">
                  <span>Trạng thái:</span>
                  <span v-status:status="currentStatus"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">Kiểm tra số đo</div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Trọng lượng gốc(gram):</label>
                    <p-input
                      :value="current.weight"
                      type="text"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài gốc(cm):</label>
                    <p-input
                      type="text"
                      :value="current.length"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng gốc(cm):</label>
                    <p-input
                      type="text"
                      :value="current.width"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao gốc(cm):</label>
                    <p-input
                      type="text"
                      :value="current.height"
                      readonly
                    ></p-input>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Trọng lượng thực(gram):</label>
                    <p-input
                      type="text"
                      v-model.number="form.actual_weight"
                      placeholder="eg: 69 (đơn vị grams)"
                      :disabled="!isHasUpdate"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="form.actual_length"
                      placeholder="eg: 15 (đơn vị cm)"
                      :disabled="!isHasUpdate"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="form.actual_width"
                      placeholder="eg: 10 (đơn vị cm)"
                      :disabled="!isHasUpdate"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao thực(cm):</label>
                    <p-input
                      type="text"
                      v-model.number="form.actual_height"
                      placeholder="eg: 3 (đơn vị cm)"
                      :disabled="!isHasUpdate"
                    ></p-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer pt-4">
              <div class="d-flex" style="align-self: flex-start;">
                <span>Kết quả:</span>
                <div class="messages pl-5">
                  <p v-if="!messages.length" class="mb-0 text-success"
                    >Phù hợp</p
                  >
                  <p
                    v-else
                    v-for="(message, i) in messages"
                    :key="i"
                    class="mb-0 text-danger"
                    >{{ message }}</p
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4" style="min-height: 100%">
          <div class="card" style="min-height: 100%">
            <div class="card-header">
              <div class="card-title">Danh sách</div>
            </div>
            <div class="card-body">
              <div class="empty" v-if="!groups.length">
                <p-svg name="empty"></p-svg>
                <p>Chưa có đơn hàng được quét!</p>
              </div>
              <div v-else class="accordion" id="scanin-list">
                <div class="card" v-for="group in groups" :key="group.id">
                  <div class="card-header">
                    <a
                      href="#"
                      :class="{ collapsed: !group.show }"
                      @click.prevent="collapseToggle(group.id)"
                    >
                      <p-svg name="up-white"></p-svg>
                    </a>
                    <div class="head">
                      <span
                        >Người gửi: <b>{{ group.name }}</b></span
                      >
                      <span
                        >Số lượng: <b>{{ group.count }}</b></span
                      >
                    </div>
                  </div>

                  <div
                    class="accordion-collapse collapse"
                    :class="{ show: group.show }"
                  >
                    <div class="card-body">
                      <div class="table-responsive">
                        <table class="table table-hover">
                          <tr>
                            <th>LionBay tracking</th>
                            <th>Trạng thái</th>
                          </tr>
                          <tbody>
                            <tr v-for="item in group.items" :key="item.id">
                              <td>{{ item.code }}</td>
                              <td v-html="item.statusHTML"></td>
                            </tr>
                          </tbody>
                        </table>
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
    <PageLoading :is-loading="isFetching" />
    <ModalReturn
      :visible.sync="isVisibleModalReturn"
      :current="current"
      @submit="returnHandle"
    />
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import ModalReturn from '../components/ModalReturn'
import mixinBarcode from '@core/mixins/barcode'
import PageLoading from '@components/shared/OverLoading'
import {
  GET_PACKAGE_BY_CODE,
  PACKAGE_CREATE_LABEL,
  GET_CHECKIN_REQUEST,
  CLOSE_CHECKIN_REQUEST,
  RETURN_PACKAGE,
} from '../store'
import {
  PACKAGE_WAREHOUSE_STATUS_PICK,
  PACKAGE_STATUS_CREATED,
  PACKAGE_WAREHOUSE_STATUS_RETURN,
  PACKAGE_WAREHOUSE_STATUS_CANCELLED,
} from '../constants'
import { MAP_NAME_STATUS_PACKAGE } from '../../package/constants'

export default {
  name: 'CheckPackage',
  components: { ModalReturn, PageLoading },
  mixins: [mixinBarcode],
  computed: {
    ...mapState('warehouse', {
      current: (state) => state.package,
    }),

    messages() {
      if (!this.current.id) return []

      const messages = []
      if (this.form.actual_weight > this.current.actual_weight) {
        messages.push('Trọng lượng vượt ngưỡng')
      }

      if (this.form.actual_length > this.current.actual_length) {
        messages.push('Chiều dài vượt ngưỡng')
      }

      if (this.form.actual_width > this.current.actual_width) {
        messages.push('Chiều rộng vượt ngưỡng')
      }

      if (this.form.actual_height > this.current.actual_height) {
        messages.push('Chiều cao vượt ngưỡng')
      }

      return messages
    },

    hasChange() {
      return this.messages.length
    },

    disableBtnReturn() {
      return (
        !this.current ||
        !this.current.id ||
        this.isFetching ||
        this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK ||
        this.iscaned
      )
    },

    disableBtnAccept() {
      return (
        !this.current ||
        !this.current.id ||
        this.isFetching ||
        !this.hasAccept ||
        this.iscaned
      )
    },
    disableBtnScan() {
      return (
        !this.keyword ||
        !this.iscan ||
        this.isFetching ||
        (this.codecurrent == this.keyword && this.codecurrent != '')
      )
    },
    isHasUpdate() {
      return this.current && this.current.id && !this.isFetching
    },
    codecurrent() {
      return !this.current || !this.current.package_code
        ? ''
        : this.current.package_code.code || ''
    },
    customer() {
      return !this.current || !this.current.user
        ? ''
        : this.current.user.full_name ||
            this.current.user.email ||
            this.current.user.phone_number
    },
    hasAccept() {
      return (
        this.current &&
        this.current.id &&
        this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    total() {
      return this.packages.length
    },
    currentStatus() {
      return (MAP_NAME_STATUS_PACKAGE[this.current.status] || {}).value
    },
  },
  data() {
    return {
      iscan: false,
      iscaned: false,
      isFetching: false,
      keyword: '',
      isSubmitting: false,
      form: {
        actual_weight: 0,
        actual_length: 0,
        actual_width: 0,
        actual_height: 0,
      },
      isVisibleModalReturn: false,
      checkinRequestId: 0,
      packages: [],
      groups: [],
      disableInput: false,
    }
  },
  methods: {
    ...mapActions('warehouse', {
      fetchPackage: GET_PACKAGE_BY_CODE,
      createLabel: PACKAGE_CREATE_LABEL,
      getCheckinRequest: GET_CHECKIN_REQUEST,
      closeCheckinRequest: CLOSE_CHECKIN_REQUEST,
      returnPackageRequest: RETURN_PACKAGE,
    }),
    ...mapMutations('warehouse', {
      setPackage: GET_PACKAGE_BY_CODE,
    }),

    async stopHandle() {
      if (this.isFetching || this.isSubmitting) return

      const res = await this.closeCheckinRequest({ id: this.checkinRequestId })

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.iscan = false
      this.iscaned = false
      this.checkinRequestId = 0
      this.keyword = ''
      this.groups = []
      this.packages = []
      this.setPackage({})
      this.reset()
    },

    async startHandle() {
      if (this.isFetching || this.isSubmitting) return

      this.iscaned = false
      this.isFetching = true
      this.reset()
      this.setPackage({})

      const res = await this.getCheckinRequest()

      if (res.error || !res.checkin) {
        this.isFetching = false
        this.$toast.error(res.message)
        return
      }

      this.iscan = true
      this.checkinRequestId = res.checkin.id

      const packages = res.checkin.packages || []
      for (const pkg of packages) {
        if (!pkg.package_code || !pkg.user) {
          continue
        }

        const code = pkg.package_code.code
        const customer =
          pkg.user.full_name || pkg.user.email || pkg.user.phone_number
        const status =
          pkg.status == PACKAGE_WAREHOUSE_STATUS_RETURN
            ? 'returned'
            : 'accepted'

        const item = {
          id: this.current.id,
          code,
          status,
          statusHTML: '<span class="text-success">Đã quét</span>',
        }

        if (status == 'returned') {
          item.statusHTML = '<span class="text-danger">Trả hàng</span>'
        }

        this.packages.push(item)

        const group = this.groups.find(({ id }) => id == pkg.user.id)
        if (group) {
          group.count++
          group.items.push(item)
          continue
        }

        this.groups.push({
          id: pkg.user.id,
          count: 1,
          name: customer,
          show: false,
          items: [item],
        })
      }

      this.isFetching = false
    },

    searchHandle() {
      const keyword = this.keyword.trim()
      this.beforeFetchPackage(keyword)
    },

    barcodeSubmit(keyword) {
      this.disableInput = true
      this.beforeFetchPackage(keyword)
      this.disableInput = false
    },

    async beforeFetchPackage(keyword) {
      keyword = keyword.trim()
      if (this.codecurrent === keyword) return

      if (this.isFetching || this.isSubmitting) return

      this.keyword = keyword

      const index = this.packages.findIndex(({ code }) => code == keyword)
      if (index !== -1) {
        this.$toast.warning(`Mã ${keyword} đã được quét`)
        return
      }

      if (this.hasAccept && !this.iscaned) {
        if (!this.hasChange) {
          await this.acceptSubmit()
        } else {
          try {
            const result = await this.confirmHandle()
            if (!result) return

            await this.acceptSubmit()
          } catch (error) {
            console.log(error)
          }
        }
      }

      this.isFetching = true
      await this.fetchPackge(keyword)
      setTimeout(() => {
        this.isFetching = false
      }, 200)
    },

    async fetchPackge(keyword) {
      if (!this.iscan) {
        this.$toast.warning('Vui lòng bấm bắt đầu quét để quét')
        return
      }

      this.iscaned = false
      this.reset()

      const res = await this.fetchPackage(keyword)
      if (res.error) {
        this.$toast.error(res.message)
      }

      if (!this.current || !this.current.id) {
        return
      }

      if (this.current.status == PACKAGE_STATUS_CREATED) {
        this.$toast.warning(`Mã ${keyword} chưa xác thực`)
        this.setPackage({})
        return
      }

      if (this.current.status == PACKAGE_WAREHOUSE_STATUS_CANCELLED) {
        this.$toast.warning(`Đơn ${keyword} đã được huỷ`)
        this.setPackage({})
        return
      }

      if (this.current.status == PACKAGE_WAREHOUSE_STATUS_RETURN) {
        this.$toast.warning(`Đơn ${keyword} đã được hoàn trả`)
        this.setPackage({})
        return
      }

      if (
        this.current.status >= PACKAGE_WAREHOUSE_STATUS_PICK ||
        (this.current.tracking && this.current.tracking.id)
      ) {
        this.$toast.warning(`Mã ${keyword} đã được quét`)
        this.setPackage({})
        return
      }

      this.form.actual_width = this.current.actual_width
      this.form.actual_height = this.current.actual_height
      this.form.actual_length = this.current.actual_length
      this.form.actual_weight = this.current.actual_weight
    },

    async acceptHandle() {
      if (!this.hasChange) {
        return await this.acceptSubmit()
      }

      try {
        const result = await this.confirmHandle()
        if (!result) {
          return false
        }

        return await this.acceptSubmit()
      } catch (error) {
        return false
      }
    },

    async acceptSubmit() {
      if (
        this.isFetching ||
        this.isSubmitting ||
        !this.current ||
        !this.current.id
      )
        return

      this.isSubmitting = true

      const form = Object.assign(
        {
          id: this.current.id,
          checkin_request_id: this.checkinRequestId,
        },
        this.form
      )

      const res = await this.createLabel(form)

      if (res.error) {
        this.$toast.error(res.message)
        this.isSubmitting = false
        return false
      }

      this.addToAnalytics('accepted')
      this.isSubmitting = false
      this.iscaned = true

      this.$toast.success(`Đơn ${this.codecurrent} quét thành công`)

      return true
    },

    // xác nhận thông tin đã chỉnh sửa
    confirmHandle() {
      return new Promise((resolve) => {
        this.$dialog.confirm({
          title: `Xác nhận thông tin đơn hàng?`,
          message: `Đơn ${this.codecurrent} đã được chỉnh sửa, bạn chắn chắn thông tin chỉnh sửa là đúng?`,
          onConfirm: () => {
            resolve(true)
          },
          onCancel: () => {
            resolve(false)
          },
        })
      })
    },

    reset() {
      this.form = {
        actual_weight: 0,
        actual_length: 0,
        actual_width: 0,
        actual_height: 0,
      }
    },

    showModalReturnHandle() {
      this.isVisibleModalReturn = true
    },

    returnHandle(note) {
      this.$dialog.confirm({
        title: 'Xác nhận trả hàng?',
        onConfirm: () => this.returnSubmit(note),
      })
    },

    async returnSubmit(note) {
      if (
        this.isFetching ||
        this.isSubmitting ||
        !this.current.id ||
        note == ''
      )
        return

      this.isSubmitting = true
      const body = {
        id: this.current.id,
        checkin_request_id: this.checkinRequestId,
        note,
      }

      const res = await this.returnPackageRequest(body)

      if (res.error) {
        this.isSubmitting = false
        this.$toast.error(res.message)
        return
      }

      this.addToAnalytics('returned')
      this.isSubmitting = false

      this.$toast.success(`Mã ${this.codecurrent} trả hàng thành công`)
      this.isVisibleModalReturn = false
    },

    addToAnalytics(status) {
      const item = {
        id: this.current.id,
        code: this.codecurrent,
        status,
        statusHTML: '<span class="text-success">Đã quét</span>',
      }

      if (status == 'returned') {
        item.statusHTML = '<span class="text-danger">Trả hàng</span>'
      }

      this.packages.push(item)

      const user = this.current.user
      const group = this.groups.find(({ id }) => id == user.id)
      if (group) {
        group.count++
        group.items.push(item)
      } else {
        this.groups.push({
          id: user.id,
          count: 1,
          name: this.customer,
          show: false,
          items: [item],
        })
      }
    },

    collapseToggle(id) {
      const idx = this.groups.findIndex((item) => item.id == id)

      if (idx === -1) return

      const show = !this.groups[idx].show
      this.$set(this.groups[idx], 'show', show)
    },
  },
}
</script>
<style lang="scss">
.scan-in {
  .package-info {
    .d-flex {
      margin-bottom: 10px;
    }
    span {
      color: #333;
      &:first-child {
        width: 150px;
        color: #636363;
      }
    }
  }
  .actions {
    .icon {
      margin-right: 8px;
      vertical-align: bottom;
      path {
        fill: #fff;
      }
    }

    .btn-white {
      font-weight: normal;
      b {
        color: #333;
      }
    }
  }

  #scanin-list {
    .card {
      border: none;
      + .card {
        margin-top: 2px;
      }
    }
    .card-header {
      padding: 0;
      position: relative;

      .head {
        transition: all 0.35s ease;
        padding: 12px 12px;
        width: 100%;
        background-color: #141f65;
        color: #fff;
        font-size: 14px;
        line-height: 20px;
        span:first-child {
          margin-right: 15px;
        }
      }

      a {
        transform: rotate(180deg);
        position: absolute;
        right: 12px;
        top: 14px;
        transition: all 0.35s ease;
      }

      a.collapsed {
        transform: rotate(0deg);
        top: 11px;
        path {
          stroke: #333;
        }

        + .head {
          background-color: #f6f7f7;
          color: #111212;
        }
      }
    }

    .accordion-collapse {
      height: 0;
      transition: height 0.35s ease;

      &.show {
        height: auto;
      }
    }
  }

  .row {
    margin-right: -8px;
    margin-left: -8px;
  }

  [class^='col-'] {
    padding-right: 8px;
    padding-left: 8px;
  }

  .empty {
    padding: 120px 0;
    text-align: center;
    p {
      margin-top: 24px;
    }
  }
  .table {
    th,
    td {
      border: none;
    }
    th {
      padding: 8px 12px;
      background-color: #f6f7f7;
      color: #626363;
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
    }
    td {
      padding: 12px 12px 11px;
      color: #111212;
    }
    tr + tr {
      td {
        border-top: 1px solid #edeeee;
      }
    }
  }

  .table-hover tbody tr:first-child td {
    border-top: 0;
  }
}
</style>
