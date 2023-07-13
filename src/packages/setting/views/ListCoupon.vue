<template>
  <div class="pages list__product">
    <div class="search-input d-flex">
      <p-input
        placeholder="Tìm mã coupon"
        prefixIcon="search"
        class="mb-2"
        type="search"
        :value="filter.search"
        @keyup.enter="handleSearch"
      >
      </p-input>
      <p-button
        style="width: 154px"
        class="ml-3"
        type="info"
        @click="showModalCreateCoupon"
      >
        Tạo mã Coupon
      </p-button>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="false">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="list__product-title">
                    <th>TÊN SẢN PHẨM</th>
                    <th>SKU</th>
                    <th>LOẠI SẢN PHẨM</th>
                    <th>CHẤT LIỆU SẢN PHẨM</th>
                    <th class="text-center">TRỌNG LƯỢNG (GRAM)</th>
                    <th class="text-center">KÍCH THƯỚC (CM)</th>
                  </tr>
                </thead>

                <tbody> </tbody>
              </table>
            </div>
          </template>
          <EmptySearchResult v-else></EmptySearchResult>
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center mb-80 paginate"
        v-if="count > 0"
      >
        <p-pagination
          :total="count"
          :perPage.sync="filter.limit"
          :current.sync="filter.page"
          size="sm"
        ></p-pagination>
      </div>
    </div>
    <modal-create-coupon
      :visible.sync="visibleModalCreateCoupon"
      :loading="isSubmitting"
      @save="hanldeSaveCoupon"
    ></modal-create-coupon>
  </div>
</template>
<script>
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { mapActions, mapState } from 'vuex'
import ModalCreateCoupon from '../components/ModalCreateCoupon'
import { CREATE_COUPON } from '../store/index'

export default {
  name: 'ListCoupon',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalCreateCoupon,
  },
  data() {
    return {
      filter: {
        limit: 30,
        page: 1,
      },
      isFetching: false,
      isSubmitting: false,
      visibleModalCreateCoupon: false,
      product: {},
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('setting', {}),
  },
  methods: {
    ...mapActions('setting', [CREATE_COUPON]),
    async init() {},
    async hanldeSaveCoupon(payload) {
      this.isSubmitting = true
      let r = await this[CREATE_COUPON](payload)
      this.isSubmitting = false
      if (r.error) {
        this.$toast.error(r.message)
        return
      }
      this.$toast.success('Tạo coupon thành công')
      this.visibleModalCreateCoupon = false
      this.init()
    },
    showModalCreateCoupon() {
      this.visibleModalCreateCoupon = true
    },
  },
  watch: {
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
