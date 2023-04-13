<template>
  <div class="package-detail fba pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_back">
          <router-link :to="{ name: 'package-fba' }" class="text">
            <span class="page-header_back_icon">
              <p-svg name="chevron-left"></p-svg>
            </span>
            <span>Đơn hàng FBA</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info grib_header" v-if="!isFetching">
            <div>
              <div>Mã lô hàng:</div>
              <div> #{{ shipment.id }} </div>
            </div>
            <div>
              <div>Ngày tạo: </div>
              <div>{{
                shipment.created_at | datetime('dd/MM/yyyy HH:mm')
              }}</div>
            </div>
            <div>
              <div>Khách hàng </div>
              <div>{{ shipment.user ? shipment.user.full_name : '' }}</div>
            </div>
            <div>
              <div>Khối lượng: </div>
              <div> {{ shipment.weight | formatWeight }}kg </div>
            </div>
            <div>
              <div>Tổng giá: </div>
              <div>
                {{ shipment.total_amount | formatPrice }}
              </div>
            </div>
            <div>
              <div>Trạng thái: </div>
              <div>
                <Status :status="shipment.status" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="">
          <div class="">
            <div class="row">
              <div class="col-3">
                <div class="row mb-24">
                  <div class="col">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Người nhận</div>
                      </div>
                      <div class="card-content text-center" v-if="isFetching">
                        <img src="@assets/img/no_data.png" />
                      </div>
                      <div class="card-content" v-else>
                        <div class="row">
                          <div class="col-5 mb-8">Họ và tên:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].recipient : ''
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Điện thoại:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].phone_number : ''
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Địa chỉ:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].address_1 : ''
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Địa chỉ phụ:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].address_1 : ''
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Thành phố:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].city : ''
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã vùng:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].state_code : ''
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5 mb-8">Mã bưu điện:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].zipcode : ''
                            }}</div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5">Mã quốc gia:</div>
                          <div class="col-7">
                            <div>{{
                              packages.length ? packages[0].country_code : ''
                            }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-9" style="padding: 0 30px 0 30px">
                <div class="row">
                  <div class="col-12 p-0">
                    <div class="card-block">
                      <div class="card-header">
                        <div class="card-title">Chi tiết lô hàng</div>
                      </div>
                      <div class="card-content text-center">
                        <template v-if="!isFetching">
                          <div class="table-responsive" style="overflow: unset">
                            <table class="table table-hover table-packages">
                              <thead>
                                <th width="80">ORDER NO.</th>
                                <th>LionBay tracking</th>
                                <th>Last mile tracking</th>
                                <th>Trọng lượng</th>
                                <th>Dài x Rộng x Cao (cm)</th>
                                <th></th>
                              </thead>
                              <tbody>
                                <tr v-for="(item, i) in packages" :key="i">
                                  <td width="80">
                                    <router-link
                                      class="text-no-underline"
                                      :to="{
                                        name: 'package-detail',
                                        params: { id: item.id },
                                      }"
                                    >
                                      {{ item.order_number }}
                                    </router-link>
                                  </td>
                                  <td>{{
                                    item.package_code
                                      ? item.package_code.code
                                      : 'N/A'
                                  }}</td>
                                  <td>{{
                                    item.tracking
                                      ? item.tracking.tracking_number
                                      : 'N/A'
                                  }}</td>
                                  <td>{{ item.weight | formatWeight }}kg</td>
                                  <td
                                    >{{ item.length }} x {{ item.width }} x{{
                                      item.height
                                    }}</td
                                  >
                                  <td>
                                    <p-button
                                      v-if="item.label"
                                      @click.prevent="downloadLabel(item)"
                                      class="btn-sm btn-info"
                                      >Tải label</p-button
                                    >
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </template>
                        <template v-else>
                          <img src="@assets/img/no_data.png" />
                        </template>
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
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mixinTable from '@core/mixins/table'
import { FETCH_DETAIL_CUSTOMER_SHIPMENT } from '../store'
import Status from '../components/Status.vue'
import { print } from '@core/utils/print'
import { KG_TO_GRAM } from '@core/constants'
export default {
  name: 'PackageDetail',
  mixins: [mixinTable],
  components: {
    Status,
  },
  computed: {
    ...mapState('package', {
      shipment: (state) => state.customerShipment,
      packages: (state) => state.customerShipmentPkgs,
    }),
  },
  data() {
    return {
      isFetching: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('package', [FETCH_DETAIL_CUSTOMER_SHIPMENT]),
    async init() {
      this.isFetching = true
      const payload = {
        id: parseInt(this.$route.params.id),
      }
      let result = await this[FETCH_DETAIL_CUSTOMER_SHIPMENT](payload)
      this.isFetching = false
      if (!result.success) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
    },
    downloadLabel({ label }) {
      document.activeElement && document.activeElement.blur()
      try {
        print(label)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
  },
  filters: {
    formatWeight(val) {
      return (val / KG_TO_GRAM).toFixed(2).replace('.00', '')
    },
  },
}
</script>

<style scoped>
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
