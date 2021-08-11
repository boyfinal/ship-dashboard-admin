<template>
  <div class="pages check-package">
    <div class="page-content">
      <div class="row">
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <div class="d-flex">
                <p-input
                  :value="keyword"
                  @keydown.enter.prevent="searchHandle"
                  placeholder="Nhập mã vận đơn"
                ></p-input>
                <button
                  :disabled="disBtnAccept"
                  @click="quickAcceptHandle"
                  class="btn btn-info ml-3 text-nowrap"
                  >In label</button
                >
              </div>
            </div>
          </div>
          <div class="card mt-5">
            <div class="card-header">
              <div class="card-title">Kiểm tra số đo</div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Trọng lượng gốc:</label>
                    <p-input
                      :value="current.weight"
                      type="text"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài gốc:</label>
                    <p-input
                      type="text"
                      :value="current.length"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng gốc:</label>
                    <p-input
                      type="text"
                      :value="current.width"
                      readonly
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao gốc:</label>
                    <p-input
                      type="text"
                      :value="current.height"
                      readonly
                    ></p-input>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Trọng lượng thực:</label>
                    <p-input
                      type="text"
                      v-model.number="volume.weight"
                      placeholder="eg: 69 (đơn vị grams)"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài thực:</label>
                    <p-input
                      type="text"
                      v-model.number="volume.length"
                      placeholder="eg: 15 (đơn vị cm)"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng thực:</label>
                    <p-input
                      type="text"
                      v-model.number="volume.width"
                      placeholder="eg: 10 (đơn vị cm)"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao thực:</label>
                    <p-input
                      type="text"
                      v-model.number="volume.height"
                      placeholder="eg: 3 (đơn vị cm)"
                      :disabled="disInput"
                    ></p-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer pt-4">
              <div class="d-flex" style="align-self: flex-start;">
                <span>Kết quả:</span>
                <div class="messages pl-5">
                  <p v-if="disBtnIncurred" class="mb-0 text-success">Phù hợp</p>
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
        <div class="col-4">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Kiểm tra loại hàng</div>
            </div>
            <div class="card-body">
              <div class="row">
                <p class="col-5">Mã vận đơn:</p>
                <p class="col-7">{{
                  current.package_code ? current.package_code.code : ''
                }}</p>
              </div>
              <div class="row">
                <p class="col-5">Chi tiết hàng hóa:</p>
                <p class="col-7">{{ current.detail }}</p>
              </div>
              <div class="row">
                <p class="col-5">Trạng thái:</p>
                <p class="col-7" v-if="statusText"
                  ><span class="badge badge-round" :class="statusClass">{{
                    statusText
                  }}</span></p
                >
              </div>
              <div class="d-flex" v-if="tracking.id">
                <p style="width: 130px;">Tracking:</p>
                <p
                  ><a href="#" @click.prevent="printLabel">{{
                    tracking.tracking_number
                  }}</a></p
                >
              </div>
            </div>
            <div class="card-footer d-block">
              <div class="mt-4">
                <div class="d-flex justify-content-between">
                  <label class="form-label">Lý do trả hàng:</label>
                  <i class="text-danger" style="font-size: 12px;">*Bắt buộc</i>
                </div>
                <textarea
                  class="p-input form-control"
                  v-model.trim="note"
                  rows="3"
                  :disabled="disReturn"
                ></textarea>
              </div>
              <div class="text-right mt-4">
                <button
                  :disabled="disBtnReturn"
                  @click.prevent="returnHandle"
                  class="btn btn-danger"
                  >Trả hàng</button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalAccept :visible.sync="isVisibleModalAccept" @accept="acceptHandle" />
  </div>
</template>
<script>
import {
  FETCH_PACKAGE_DETAIL,
  ACCEPT_PACKAGE_LABEL,
  RETURN_PACKAGE,
} from '../store'
import { mapActions, mapState, mapMutations } from 'vuex'
import ModalAccept from '../components/ModalAccept'
import {
  MAP_NAME_STATUS_PACKAGE,
  PACKAGE_WAREHOUSE_STATUS_RETURN,
  PACKAGE_WAREHOUSE_STATUS_CANCELLED,
  PACKAGE_WAREHOUSE_STATUS_PICK,
} from '../constants'
import mixinBarcode from '@core/mixins/barcode'
import { printImage } from '@core/utils/print'
import http from '@core/services/http'

export default {
  name: 'CheckPackage',
  components: { ModalAccept },
  mixins: [mixinBarcode],
  computed: {
    ...mapState('warehouse', {
      current: (state) => state.package,
    }),
    messages() {
      if (!this.current.id) return []

      const messages = []
      if (this.volume.weight > this.current.weight) {
        messages.push('Trọng lượng vượt ngưỡng')
      }

      if (this.volume.length > this.current.length) {
        messages.push('Chiều dài vượt ngưỡng')
      }

      if (this.volume.width > this.current.width) {
        messages.push('Chiều rộng vượt ngưỡng')
      }

      if (this.volume.height > this.current.height) {
        messages.push('Chiều cao vượt ngưỡng')
      }

      return messages
    },
    disInput() {
      return (
        !this.current.id || this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    isAccepted() {
      return (
        this.current.id && this.current.status > PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    disReturn() {
      return (
        !this.current.id ||
        this.current.status == PACKAGE_WAREHOUSE_STATUS_RETURN ||
        this.current.status == PACKAGE_WAREHOUSE_STATUS_CANCELLED ||
        this.current.status < PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    disBtnReturn() {
      return (
        !this.current.id ||
        this.note === '' ||
        this.isSubmitting ||
        this.disReturn
      )
    },
    disBtnAccept() {
      return (
        !this.current.id ||
        this.isSubmitting ||
        this.isFetching ||
        this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK
      )
    },
    disBtnIncurred() {
      return (
        !this.messages.length ||
        this.isSubmitting ||
        this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK ||
        !this.volume.weight ||
        !this.volume.length ||
        !this.volume.width ||
        !this.volume.height
      )
    },
    statusText() {
      if (!this.current.id) return ''
      if (!MAP_NAME_STATUS_PACKAGE[this.current.status]) return 'unknown'
      return MAP_NAME_STATUS_PACKAGE[this.current.status].value
    },
    statusClass() {
      if (!this.current.id) return ''
      if (!MAP_NAME_STATUS_PACKAGE[this.current.status]) return 'badge-default'
      return MAP_NAME_STATUS_PACKAGE[this.current.status].class
    },

    tracking() {
      return this.current.tracking || {}
    },
  },
  data() {
    return {
      keyword: '',
      isFetching: false,
      note: '',
      volume: {
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
      },
      isChange: false,
      isVisibleModalAccept: false,
      isSubmitting: false,
    }
  },
  mounted() {
    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword.trim()
      this.fetchPackageSubmit()
    } else {
      this.setPackage({})
    }

    this.beforeLeaveHandle()
  },
  methods: {
    ...mapActions('shared', ['loading']),
    ...mapActions('warehouse', {
      fetchPackage: FETCH_PACKAGE_DETAIL,
      acceptPackageSubmit: ACCEPT_PACKAGE_LABEL,
      returnPackageSubmit: RETURN_PACKAGE,
    }),
    ...mapMutations('warehouse', {
      setPackage: FETCH_PACKAGE_DETAIL,
    }),

    searchHandle(e) {
      this.beforeFetchPackge(e.target.value || '')
    },

    barcodeSubmit(keyword) {
      this.beforeFetchPackge(keyword)
    },

    beforeFetchPackge(keyword) {
      keyword = keyword.trim()
      if (this.keyword === keyword) return

      if (!this.current.id || this.isAccepted) {
        this.keyword = keyword
        this.pushQuery(keyword)
        this.fetchPackageSubmit()
        return
      }

      this.$dialog.confirm({
        title: `Xác nhận duyệt mã vận đơn ${this.keyword}?`,
        message: 'Đơn hàng chưa duyệt. Bạn có muốn duyệt không.',
        onConfirm: () => {
          this.quickAcceptHandle()
        },
        onCancel: () => {
          this.keyword = keyword
          this.pushQuery(keyword)
          this.fetchPackageSubmit()
        },
      })
    },

    pushQuery(keyword) {
      this.$router.push({
        query: { keyword: keyword },
        path: this.$route.path,
      })
    },

    async fetchPackageSubmit() {
      if (this.keyword === '') return

      this.reset()

      this.loading(true)
      this.isFetching = true
      const res = await this.fetchPackage(this.keyword)
      this.isFetching = false
      this.loading(false)

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.volume.weight = this.current.weight
      this.volume.length = this.current.length
      this.volume.width = this.current.width
      this.volume.height = this.current.height
    },

    quickAcceptHandle() {
      this.isChange = false

      if (
        parseFloat(this.volume.weight) != parseFloat(this.current.weight) ||
        parseFloat(this.volume.length) != parseFloat(this.current.length) ||
        parseFloat(this.volume.width) != parseFloat(this.current.width) ||
        parseFloat(this.volume.height) != parseFloat(this.current.height)
      ) {
        this.isChange = true
        this.extraHandle()
        return
      }

      this.volume.weight = this.current.weight
      this.volume.length = this.current.length
      this.volume.width = this.current.width
      this.volume.height = this.current.height
      this.showModalAcceptHandle()
    },

    showModalAcceptHandle() {
      this.isVisibleModalAccept = true
    },

    extraHandle() {
      this.$dialog.confirm({
        title: 'Xác nhận thay đổi trọng lượng và kích thước?',
        onConfirm: () => this.showModalAcceptHandle(),
      })
    },

    async acceptHandle() {
      if (
        this.current.status != PACKAGE_WAREHOUSE_STATUS_PICK ||
        this.isSubmitting
      )
        return

      this.loading(true)
      this.isSubmitting = true
      const body = { id: this.current.id }

      if (this.isChange) {
        body.weight = this.volume.weight || 0
        body.length = this.volume.length || 0
        body.width = this.volume.width || 0
        body.height = this.volume.height || 0
      }

      const res = await this.acceptPackageSubmit(body)
      this.isSubmitting = false
      this.loading(false)
      if (res.error) {
        this.$toast.error(res.message)
        return
      }
      this.isVisibleModalAccept = false
      this.printLabel()
    },

    returnHandleConfirm() {
      this.$dialog.confirm({
        title: 'Xác nhận trả hàng?',
        onConfirm: () => this.returnHandle(),
      })
    },

    async returnHandle() {
      if (this.isSubmitting || !this.current.id || this.note == '') return

      this.loading(true)
      this.isSubmitting = true
      const body = { id: this.current.id, note: this.note }
      const res = await this.returnPackageSubmit(body)
      this.isSubmitting = false
      this.loading(false)

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },

    async printLabel() {
      document.activeElement && document.activeElement.blur()

      try {
        if (!this.tracking.label_url) return
        const url = this.tracking.label_url

        if (/^http/gi.test(url)) {
          printImage(url)
          return
        }

        const res = await http.get(
          `/uploads/file-export/download?type=labels&url=${url}`,
          { type: 'blob' }
        )

        if (!res || res.error) {
          return this.$toast.error(res.errorMessage || '')
        }

        const src = (window.webkitURL || window.URL).createObjectURL(res)
        printImage(src)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },

    beforeLeaveHandle() {
      window.onbeforeunload = () => {
        if (
          this.current.id &&
          this.current.status == PACKAGE_WAREHOUSE_STATUS_PICK
        ) {
          return 'Đơn chưa được duyệt, bạn có muốn thoát khỏi page'
        }

        return null
      }
    },

    reset() {
      ;(this.note = ''),
        (this.volume = { weight: 0, length: 0, width: 0, height: 0 })
    },
  },

  beforeRouteLeave(to, from, next) {
    if (
      this.current.id &&
      this.current.status == PACKAGE_WAREHOUSE_STATUS_PICK
    ) {
      const answer = window.confirm(
        'Đơn chưa được duyệt, bạn có muốn thoát khỏi page'
      )
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },
}
</script>
