<template>
  <div class="pages packages__return">
    <div class="page-header">
      <div class="d-flex jc-sb mb-12 search-input">
        <p-input
          placeholder="Tìm theo order number hoặc lionbay tracking"
          prefixIcon="search"
          type="search"
          clearable
          v-model="search"
          @keyup.enter="searchHandle"
          @clear="clearSearch"
        >
        </p-input>
        <p-button
          id="export-btn"
          @click="searchHandle"
          class="btn btn-info ml-3 text-nowrap"
          >Quét</p-button
        >
      </div>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <template v-if="returnItems.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <template>
                      <th>Order Number</th>
                      <th>LIONBAY TRACKING</th>
                      <th class="text-center">Action</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in returnItems" :key="i">
                    <td>{{ item.order_number }}</td>
                    <td>{{ item.package_code.code }}</td>
                    <td class="text-center">
                      <p-button
                        :style="`width:85px;`"
                        class="btn-promotion"
                        type="danger"
                        @click="confirmRemove(item)"
                      >
                        Xóa
                      </p-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <PageLoading :is-loading="isFetching" />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import mixinBarcode from '@core/mixins/barcode'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import { HUB_SCAN_RETURN, REMOVE_SCAN_RETURN_ITEM } from '../store'
import PageLoading from '@components/shared/OverLoading'
export default {
  name: 'ListReturn',
  mixins: [mixinRoute, mixinTable, mixinBarcode],
  components: { EmptySearchResult, PageLoading },
  data() {
    return {
      isFetching: false,
      search: '',
      returnItems: [],
    }
  },
  methods: {
    ...mapActions('hub', [HUB_SCAN_RETURN, REMOVE_SCAN_RETURN_ITEM]),
    async searchHandle() {
      this.isFetching = true
      const payload = {
        search: this.search.trim(),
      }
      let result = await this[HUB_SCAN_RETURN](payload)
      this.isFetching = false
      if (result.error) {
        this.$toast.error(result.message)
        return
      }
      this.returnItems.push(result.package)
    },
    clearSearch() {
      this.search = ''
    },
    confirmRemove(item) {
      this.$dialog.confirm({
        title: `Xác nhận`,
        message: 'Bạn có chắc chắn muốn thực hiện hành động này ?',
        onConfirm: () => {
          this.removeReturnPackage(item)
        },
      })
    },
    async removeReturnPackage(item) {
      this.isFetching = true
      const payload = {
        id: item.id,
      }
      let result = await this[REMOVE_SCAN_RETURN_ITEM](payload)
      this.isFetching = false
      if (result.error) {
        this.$toast.error(result.message)
        return
      }
      this.returnItems = this.returnItems.filter((i) => i.id !== payload.id)
    },
    barcodeSubmit(keyword) {
      if (keyword.length > 22) {
        keyword = keyword.slice(-22)
      }
      this.search = keyword
      this.searchHandle()
    },
  },
}
</script>
