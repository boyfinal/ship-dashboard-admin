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
      <div class="ml-3">
        <select
          v-model="filter.search_by"
          class="form-control"
          style="width: auto"
        >
          <option :value="key" v-for="(value, key) in searchBy" :key="key">
            {{ value }}
          </option>
        </select>
      </div>
      <p-button
        style="min-width: 154px"
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
          <template v-else-if="coupons.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="list__product-title">
                    <th>Mã coupon</th>
                    <th>Tên khách</th>
                    <th class="text-center">bắt đầu</th>
                    <th class="text-center">hết hạn</th>
                    <th class="text-center">Điểm mua</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-center">Đã dùng</th>
                    <th class="text-center">Loại</th>
                    <th class="text-center">tối thiểu</th>
                    <th class="text-center">tối đa</th>
                    <th class="text-center">Giá trị giảm</th>
                    <th class="text-center">Trạng thái</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(item, i) in coupons"
                    :key="i"
                    @click="showDetailCoupon(item.id)"
                    :class="{ expire: checkExpireCoupon(item) }"
                  >
                    <td>{{ item.code }}</td>
                    <td>{{ item.customer.full_name }}</td>
                    <td class="text-center">{{
                      item.start_date | date('dd/MM/yyyy')
                    }}</td>
                    <td class="text-center">{{
                      item.end_date | date('dd/MM/yyyy')
                    }}</td>
                    <td class="text-center">{{ item.point }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-center">{{ getTypeCoupon(item.type) }}</td>
                    <td class="text-center">{{
                      item.min_apply | formatPrice
                    }}</td>
                    <td class="text-center">{{
                      item.max_apply | formatPrice
                    }}</td>
                    <td class="text-center">{{ item.value }}</td>
                    <td class="text-center">
                      <span
                        v-if="!checkExpireCoupon(item)"
                        class="badge badge-round badge-success"
                        >Còn hiệu lực</span
                      >
                      <span v-else class="badge badge-round badge-expired"
                        >Hết hiệu lực</span
                      >
                    </td>
                  </tr>
                </tbody>
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
      :coupon="coupon"
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
import { TYPE_COUPON } from '../constants'
import {
  CREATE_COUPON,
  GET_LIST_COUPON,
  GET_DETAIL_COUPON,
} from '../store/index'

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
        search_by: 'code',
      },
      coupon: null,
      isFetching: false,
      isSubmitting: false,
      visibleModalCreateCoupon: false,
      searchBy: {
        code: 'Tìm theo mã coupon',
        customer_name: 'Tìm theo khách hàng',
      },
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('setting', {
      count: (state) => state.countCoupons,
      coupons: (state) => state.coupons,
    }),
  },
  methods: {
    ...mapActions('setting', [
      CREATE_COUPON,
      GET_LIST_COUPON,
      GET_DETAIL_COUPON,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[GET_LIST_COUPON](this.filter)
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.isFetching = false
    },
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
    checkExpireCoupon(item) {
      if (item.used < item.quantity) {
        return false
      }
      return true
    },
    async showDetailCoupon(id) {
      const p = {
        id: id,
      }
      const result = await this[GET_DETAIL_COUPON](p)
      if (result.error) {
        this.$toast.error(result.message)
        return
      }
      this.coupon = result.coupon
      this.visibleModalCreateCoupon = true
    },
    showModalCreateCoupon() {
      this.visibleModalCreateCoupon = true
    },
    getTypeCoupon(type) {
      return TYPE_COUPON[type]
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
<style>
tr.expire {
  opacity: 0.7;
}
</style>
