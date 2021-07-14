<template>
  <div class="pages check-package">
    <div class="page-content">
      <div class="row">
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <div class="d-flex">
                <p-input @keydown.enter="searchHandle"></p-input>
                <button class="btn btn-info ml-3 text-nowrap">Duyệt</button>
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
                      type="text"
                      placeholder="eg: 69 (đơn vị grams)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài gốc:</label>
                    <p-input
                      type="text"
                      placeholder="eg: 15 (đơn vị cm)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng gốc:</label>
                    <p-input
                      type="text"
                      placeholder="eg: 10 (đơn vị cm)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao gốc:</label>
                    <p-input
                      type="text"
                      placeholder="eg: 3 (đơn vị cm)"
                    ></p-input>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Trọng lượng thực:</label>
                    <p-input
                      type="text"
                      placeholder="eg: 69 (đơn vị grams)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều dài thực:</label>
                    <p-input
                      type="text"
                      placeholder="eg: 15 (đơn vị cm)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều rộng thực:</label>
                    <p-input
                      type="text"
                      placeholder="eg: 10 (đơn vị cm)"
                    ></p-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chiều cao thực:</label>
                    <p-input
                      type="text"
                      placeholder="eg: 3 (đơn vị cm)"
                    ></p-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer pt-4">
              <p>Kết quả: <span class="text-success">Phù hợp</span></p>
              <div class="text-right">
                <button class="btn btn-outline-danger">Phát sinh</button>
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
                <p>69696969</p>
              </div>
              <div class="d-flex">
                <p style="width: 120px;">Tên hàng hoá:</p>
                <p>Quan ao T-Shirt</p>
              </div>
            </div>
            <div class="card-footer d-block">
              <div class="mt-4">
                <div class="d-flex justify-content-between">
                  <label class="form-label">Lý do trả hàng:</label>
                  <i class="text-danger" style="font-size: 12px;">*Bắt buộc</i>
                </div>
                <p-input type="textarea" rows="3"></p-input>
              </div>
              <div class="text-right mt-4">
                <button class="btn btn-danger">Trả hàng</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { FETCH_PACKAGE_DETAIL } from '../store'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CheckPackage',
  computed: {
    ...mapState('warehouse', {
      current: (state) => state.package,
    }),
  },
  data() {
    return {
      isFetching: false,
    }
  },
  methods: {
    ...mapActions('warehouse', {
      fetchPackage: FETCH_PACKAGE_DETAIL,
    }),

    searchHandle(e) {
      const keyword = e.target.value.trim()
      if (keyword === '') return

      this.fetchPackageSubmit(keyword)
    },

    async fetchPackageSubmit(keyword) {
      this.isFetching = true
      const res = await this.fetchPackage(keyword)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },
  },
}
</script>
