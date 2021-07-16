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
                  @keydown.enter="searchHandle"
                ></p-input>
                <button
                  :disabled="disBtnAccept"
                  @click="showModalAcceptHandle"
                  class="btn btn-info ml-3 text-nowrap"
                  >Duyệt</button
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
                      v-model="volume.weight"
                      placeholder="eg: 69 (đơn vị grams)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài thực:</label>
                    <p-input
                      type="text"
                      v-model="volume.length"
                      placeholder="eg: 15 (đơn vị cm)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng thực:</label>
                    <p-input
                      type="text"
                      v-model="volume.width"
                      placeholder="eg: 10 (đơn vị cm)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao thực:</label>
                    <p-input
                      type="text"
                      v-model="volume.height"
                      placeholder="eg: 3 (đơn vị cm)"
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
              <div class="text-right" style="align-self: flex-start;">
                <button
                  :disabled="disBtnIncurred"
                  class="btn btn-outline-danger"
                  >Phát sinh</button
                >
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
              <div class="d-flex">
                <p style="width: 120px;">Mã hàng hoá:</p>
                <p>{{ current.code }}</p>
              </div>
              <div class="d-flex">
                <p style="width: 120px;">Tên hàng hoá:</p>
                <p>{{ current.detail }}</p>
              </div>
              <div class="d-flex">
                <p style="width: 120px;">Trạng thái:</p>
                <p v-if="statusText"
                  ><span class="badge badge-round" :class="statusClass">{{
                    statusText
                  }}</span></p
                >
              </div>
              <div class="d-flex" v-if="tracking.id">
                <p style="width: 120px;">Tracking:</p>
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
                ></textarea>
              </div>
              <div class="text-right mt-4">
                <button :disabled="disBtnReturn" class="btn btn-danger"
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
import { mapActions, mapState } from 'vuex'
import ModalAccept from '../components/ModalAccept'
import {
  PackageStatusWareHouseLabeled,
  MAP_NAME_STATUS_PACKAGE,
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
    isAccepted() {
      return (
        this.current.id && this.current.status >= PackageStatusWareHouseLabeled
      )
    },
    disBtnReturn() {
      return !this.current.id || this.note === '' || this.isSubmitting
    },
    disBtnAccept() {
      return !this.current.id || this.isAccepted || this.isSubmitting
    },
    disBtnIncurred() {
      return !this.messages.length || this.isSubmitting
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
      isVisibleModalAccept: false,
      isSubmitting: false,
    }
  },
  methods: {
    ...mapActions('shared', ['loading']),
    ...mapActions('warehouse', {
      fetchPackage: FETCH_PACKAGE_DETAIL,
      acceptPackageSubmit: ACCEPT_PACKAGE_LABEL,
      returnPackageSubmit: RETURN_PACKAGE,
    }),

    searchHandle(e) {
      this.beforeFetchPackge(e.target.value || '')
    },

    barcodeSubmit(keyword) {
      this.beforeFetchPackge(keyword)
    },

    beforeFetchPackge(keyword) {
      keyword = keyword.trim()
      // if (this.keyword === keyword) return

      if (!this.current.id || this.isAccepted) {
        this.keyword = keyword
        this.fetchPackageSubmit()
        return
      }

      this.$dialog.confirm({
        title: 'Xác nhận duyệt?',
        message: 'Đơn hàng chưa duyệt. Bạn có muốn duyệt không',
        onConfirm: () => {
          console.log('accept', keyword)
          this.acceptHandle()
        },
        onCancel: () => {
          this.keyword = keyword
          console.log('cancel', keyword)
          this.fetchPackageSubmit()
        },
      })
    },

    async fetchPackageSubmit() {
      if (this.keyword === '') return

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

    showModalAcceptHandle() {
      this.isVisibleModalAccept = true
    },

    async acceptHandle() {
      // if (this.isAccepted || this.isSubmitting || !this.current.id) return
      // this.loading(true)
      // this.isSubmitting = true
      // const body = { id: this.current.id }
      // if (this.messages.length) {
      //   body.weight = this.volume.weight
      //   body.length = this.volume.length
      //   body.width = this.volume.width
      //   body.height = this.volume.height
      // }
      // const res = await this.acceptPackageSubmit(body)
      // this.isSubmitting = false
      // this.loading(false)
      // if (res.error) {
      //   this.$toast.error(res.message)
      //   return
      // }
      // this.isVisibleModalAccept = false
      // this.printLabel()
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
        if (this.tracking.base64_label) {
          printImage(this.tracking.base64_label)
          return
        }

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
  },
}
</script>
