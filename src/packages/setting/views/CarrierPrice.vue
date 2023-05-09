<template>
  <div class="pages setting">
    <div class="page-content">
      <div class="card">
        <div class="card-body p-24">
          <VclTable v-if="isFetching"></VclTable>
          <div class="table-responsive" v-else>
            <table class="table table-hover table-services">
              <tr>
                <th width="200" v-text="'<450'"></th>
                <th width="200" v-text="'>450'"></th>
                <th width="200" v-text="'>3000'"></th>
              </tr>
              <tr>
                <td>
                  <span>{{ small.name }}</span>
                  <a href="#" class="ml-8" @click="editHandle(small)">
                    <svgicon name="pencil"></svgicon>
                  </a>
                </td>
                <td>
                  <span>{{ large.name }}</span>
                  <a href="#" class="ml-8" @click="editHandle(large)">
                    <svgicon name="pencil"></svgicon>
                  </a>
                </td>
                <td>
                  <span>{{ over.name }}</span>
                  <a href="#" class="ml-8" @click="editHandle(over)">
                    <svgicon name="pencil"></svgicon>
                  </a>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="card mt-24">
        <div class="card-body p-0">
          <VclTable v-if="isFetching"></VclTable>
          <template v-else-if="logs.length">
            <div class="table-responsive">
              <table class="table table-hover table-log">
                <tr>
                  <th width="200"></th>
                  <th colspan="2" v-text="'<450'"></th>
                  <th colspan="2" v-text="'>450'"></th>
                  <th colspan="2" v-text="'>3000'"></th>
                </tr>
                <tr>
                  <th width="200">Thời gian</th>
                  <th>IB BLUE</th>
                  <th>SHIPPO</th>
                  <th>IB BLUE</th>
                  <th>SHIPPO</th>
                  <th>IB BLUE</th>
                  <th>SHIPPO</th>
                </tr>
                <tr v-for="item in items" :key="item.id">
                  <td width="200">{{
                    item.created_at | datetime('dd/MM/yyyy HH:mm:ss')
                  }}</td>
                  <td :class="item.small.ibblue.class">{{
                    item.small.ibblue.price | formatPrice
                  }}</td>
                  <td :class="item.small.shippo.class">{{
                    item.small.shippo.price | formatPrice
                  }}</td>
                  <td :class="item.large.ibblue.class">{{
                    item.large.ibblue.price | formatPrice
                  }}</td>
                  <td :class="item.large.shippo.class">{{
                    item.large.shippo.price | formatPrice
                  }}</td>
                  <td :class="item.over.ibblue.class">{{
                    item.over.ibblue.price | formatPrice
                  }}</td>
                  <td :class="item.over.shippo.class">{{
                    item.over.shippo.price | formatPrice
                  }}</td>
                </tr>
              </table>
            </div>
          </template>
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center"
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
    <ModalEdit
      :visible.sync="isVisibleModalEdit"
      :carriers="carriers"
      :current="current"
      @success="onEditSuccess"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  FETCH_LIST_CHECK_PRICE_LOGS,
  FETCH_COUNT_CHECK_PRICE_LOGS,
  FETCH_CARRIER_SERVICE,
  UPDATE_CARRIER_SERVICE,
} from '../store'
import { CARRIER_CODE_IBBLUE, CARRIER_CODE_SHIPPO } from '../constants'
import ModalEdit from '../components/ModalCarrierPrice'

export default {
  name: 'CarrierPrice',
  components: { ModalEdit },
  computed: {
    ...mapState('setting', {
      logs: (state) => state.check_price_logs || [],
      count: (state) => state.count_check_price_logs || 0,
      carrier_service: (state) => state.carrier_service || {},
    }),
    carriers() {
      const carriers = (this.carrier_service.carriers || []).map(
        ({ id, name, code }) => ({ id, name, code })
      )
      carriers.sort((a, b) => a.id > b.id)
      return carriers
    },
    small() {
      const { size_small } = this.carrier_service
      const item = this.carriers.find(({ code }) => code == size_small)
      return item ? { size: 'smallsize', ...item } : {}
    },
    large() {
      const { size_large } = this.carrier_service
      const item = this.carriers.find(({ code }) => code == size_large)
      return item ? { size: 'largesize', ...item } : {}
    },
    over() {
      const { size_over } = this.carrier_service
      const item = this.carriers.find(({ code }) => code == size_over)
      return item ? { size: 'oversize', ...item } : {}
    },
    items() {
      const items = []

      let ibblueID = 0
      let shippoID = 0
      for (const { id, code } of this.carriers) {
        if (code == CARRIER_CODE_IBBLUE) {
          ibblueID = id
        }
        if (code == CARRIER_CODE_SHIPPO) {
          shippoID = id
        }
      }

      for (const log of this.logs) {
        const item = {
          id: log.id,
          created_at: log.created_at,
          small: {
            ibblue: {
              price: 0,
              class: '',
            },
            shippo: {
              price: 0,
              class: '',
            },
          },
          large: {
            ibblue: {
              price: 0,
              class: '',
            },
            shippo: {
              price: 0,
              class: '',
            },
          },
          over: {
            ibblue: {
              price: 0,
              class: '',
            },
            shippo: {
              price: 0,
              class: '',
            },
          },
        }

        if (typeof log.data === 'string') {
          try {
            log.data = JSON.parse(log.data)
          } catch (error) {
            log.data = []
          }
        }

        for (const line of log.data) {
          const prices = {
            ibblue: {
              price: 0,
              class: '',
            },
            shippo: {
              price: 0,
              class: '',
            },
          }

          for (const { carrier_id, price } of line.data) {
            if (carrier_id == ibblueID) {
              prices.ibblue.price = price
            }

            if (carrier_id == shippoID) {
              prices.shippo.price = price
            }
          }

          if (prices.shippo.price < prices.ibblue.price) {
            prices.shippo.class = 'selected'
          } else {
            prices.ibblue.class = 'selected'
          }

          if (line.point == 0) {
            item.small = prices
          }
          if (line.point == 450) {
            item.large = prices
          }
          if (line.point == 3000) {
            item.over = prices
          }
        }

        items.push(item)
      }

      return items
    },
  },
  data() {
    return {
      isFetching: false,
      current: null,
      isVisibleModalEdit: false,
      filter: {
        page: 1,
        limit: 25,
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('setting', {
      updateCarrierService: UPDATE_CARRIER_SERVICE,
      fetchCarrierService: FETCH_CARRIER_SERVICE,
      fetchListLogs: FETCH_LIST_CHECK_PRICE_LOGS,
      fetchCountLogs: FETCH_COUNT_CHECK_PRICE_LOGS,
    }),

    async init() {
      this.isFetching = true

      const arrResponse = await Promise.all([
        this.fetchCarrierService(),
        this.fetchListLogs(),
        this.fetchCountLogs(),
      ])

      for (const res of arrResponse) {
        if (res.error) {
          this.$toast.error(res.message)
        }
      }

      this.isFetching = false
    },
    editHandle(item) {
      this.current = item
      this.isVisibleModalEdit = true
    },
    async onEditSuccess() {
      this.isFetching = true
      const res = await this.fetchCarrierService()

      if (res.error) {
        this.$toast.error(res.message)
      }

      this.isFetching = false
    },
  },
}
</script>
<style lang="scss">
.table-services {
  max-width: 500px;
  margin: 0 auto;

  tr {
    td {
      border: 1px solid #007672;
      border-right: 1px solid transparent;
      background-color: #e8fffe;
      padding: 16px 12px;
      font-weight: bold;

      &:first-child,
      &:last-child {
        border-left: 1px solid #007672;
        border-radius: 0;
      }

      &:last-child {
        border-right: 1px solid #007672;
      }

      span {
        vertical-align: text-top;
      }
    }

    th {
      background-color: #e8fffe;
      padding: 12px;
      border-left: 1px solid #007672;
      border-top: 1px solid #007672;

      &:last-child {
        border-right: 1px solid #007672;
      }
    }
  }
}
.table-log {
  margin-bottom: 0;

  tr {
    th,
    td {
      padding: 12px;
      border: 0;
      text-align: center;

      &:first-child {
        border: 0;
      }
      &:last-child {
        border-right: 0;
      }
    }

    td {
      border-top: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
      &:first-child {
        border-top: 1px solid #e0e0e0;
      }

      &:first-child,
      &:nth-child(3),
      &:nth-child(5) {
        border-right: 4px solid #e5e5e5;
      }

      &.selected {
        font-weight: bold;
        color: #007672;
      }
    }

    &:nth-child(2) {
      th {
        background: #f6f7f7;
        border-top: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;

        &:first-child {
          border-top: 1px solid #e0e0e0;
        }

        &:last-child {
          border-right: 0;
        }

        &:first-child,
        &:nth-child(3),
        &:nth-child(5) {
          border-right: 4px solid #e5e5e5;
        }
      }
    }

    &:first-child {
      th {
        &:first-child,
        &:nth-child(2),
        &:nth-child(3) {
          border-right: 4px solid #e5e5e5;
        }
      }
    }
  }
}
</style>
