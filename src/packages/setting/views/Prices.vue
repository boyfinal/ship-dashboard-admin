<template>
  <div class="pages setting">
    <div class="d-flex t-types mb-20">
      <button
        v-for="item in types"
        :key="item.value"
        class="btn"
        :class="{ active: item.active }"
        @click="switchTypeHandle(item.value)"
        >{{ item.text }}</button
      >
    </div>
    <div class="d-flex t-services mb-20">
      <button
        class="btn"
        v-for="service in services"
        :key="service.id"
        :class="{ active: service.id == filter.service }"
        @click="switchServiceHandle(service.id)"
      >
        {{ service.name }}
      </button>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <VclTable v-if="isloading"></VclTable>
          <template v-else-if="prices.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th width="200">Hạng</th>
                    <th width="150">Dịch vụ</th>
                    <th width="200">Cân nặng</th>
                    <th width="100">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  <PriceItem
                    v-for="(item, i) in prices"
                    :key="i"
                    :current="item"
                  />
                </tbody>
              </table>
            </div>

            <div class="actions text-right mt-20">
              <button
                class="btn btn-danger"
                @click="discardHandle"
                :disabled="!hasChangePrice"
                >Discard</button
              >
              <button
                class="btn btn-info ml-10"
                @click="saveHandle"
                :disabled="!hasChangePrice"
                >Save</button
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import PriceItem from '../components/PriceItem.vue'
import {
  SWICTH_TYPE,
  SWICTH_SERVICE,
  FETCH_SERVICES,
  UPDATE_PRICES,
  DISCARD_UPDATE_PRICE,
} from '../store'

export default {
  name: 'Prices',
  components: { PriceItem },
  computed: {
    ...mapState('setting', {
      types: (state) => state.types,
      filter: (state) => state.filter,
      services: (state) => state.services,
      prices: (state) => state.prices,
    }),
    ...mapGetters('setting', ['hasChangePrice']),
  },
  data() {
    return {
      isloading: false,
    }
  },
  mounted() {
    this.init()
    this.beforeLeaveHandle()
  },
  methods: {
    ...mapActions('setting', {
      switchType: SWICTH_TYPE,
      switchService: SWICTH_SERVICE,
      fetchServices: FETCH_SERVICES,
      updatePrices: UPDATE_PRICES,
    }),

    ...mapMutations('setting', {
      discardHandle: DISCARD_UPDATE_PRICE,
    }),

    async init() {
      this.isloading = true
      const res = await this.fetchServices()
      if (res.error) {
        this.$toast.error(res.message)
      }

      this.isloading = false
    },

    switchTypeHandle(value) {
      if (value == this.filter.user_class) return

      if (!this.hasChangePrice) {
        this.delayLoadHandle()
        this.switchType(value)
        return
      }

      this.$dialog.confirm({
        title: `Thông tin chưa được lưu, bạn có muốn chuyển tab khác?`,
        onConfirm: () => {
          this.delayLoadHandle()
          this.switchType(value)
        },
      })
    },

    switchServiceHandle(value) {
      if (value == this.filter.service) return

      if (!this.hasChangePrice) {
        this.delayLoadHandle()
        this.switchService(value)
        return
      }

      this.$dialog.confirm({
        title: `Thông tin chưa được lưu, bạn có muốn chuyển tab khác?`,
        onConfirm: () => {
          this.delayLoadHandle()
          this.switchService(value)
        },
      })
    },

    delayLoadHandle() {
      this.isloading = true
      setTimeout(() => {
        this.isloading = false
      }, 300)
    },

    async saveHandle() {
      this.isloading = true
      const res = await this.updatePrices()
      if (res.error) {
        this.$toast.error(res.message)
      } else {
        this.$toast.success('Update prices successfully!')
      }

      this.isloading = false
    },

    beforeLeaveHandle() {
      window.onbeforeunload = () => {
        if (this.hasChangePrice) {
          return 'Thông tin chưa được lưu, bạn có muốn thoát khỏi page'
        }

        return null
      }
    },
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from, next) {
    if (this.hasChangePrice) {
      const answer = window.confirm(
        'Thông tin chưa được lưu, bạn có muốn thoát khỏi page?'
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
<style lang="scss">
.t-types {
  .btn {
    border: 1px solid #ddd;
    border-radius: 0;
    + .btn {
      border-left: 0;
    }

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &.active {
      color: #fff;
      background: #00b4c3;
      border-color: #00b4c3;
    }
  }
}
.t-services {
  .btn {
    border: 1px solid #ddd;
    border-radius: 0;
    + .btn {
      margin-left: 15px;
    }

    &.active {
      color: #fff;
      background: #00b4c3;
      border-color: #00b4c3;
    }
  }
}
</style>
