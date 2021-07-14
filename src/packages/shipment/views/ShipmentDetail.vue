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
            <span>Lô hàng</span>
          </router-link>
        </div>

        <div class="page-header__subtitle">
          <div class="page-header__info">
            <p-input
              placeholder="Tìm theo mã kiện hàng"
              prefixIcon="search"
              type="search"
              :value="filter.search"
              @keyup.enter="handleSearch"
            >
            </p-input>
            <p-button type="info">
              Thêm
            </p-button>
          </div>
          <div class="page-header__action">
            <p-button type="info">
              Bắt đầu quét
            </p-button>
            <p-button type="primary">
              Đóng lô hàng
            </p-button>
            <p-button type="danger">
              Hủy lô hàng
            </p-button>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            12131231
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
export default {
  name: 'ShipmentDetail',
  mixins: [mixinRoute, mixinTable],
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('package', {
      package_detail: (state) => state.package_detail,
    }),
  },
  created() {
    this.packageID = parseInt(this.$route.params.id, 10)
  },
  mounted() {},
  methods: {
    ...mapActions('shipment', []),
  },

  watch: {},
}
</script>
