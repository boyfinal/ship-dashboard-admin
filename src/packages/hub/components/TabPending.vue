<template>
  <table class="table table-hover" id="tbl-shipments">
    <thead>
      <tr>
        <template>
          <th>MÃ LÔ</th>
          <th>MANIFEST</th>
        </template>
      </tr>
    </thead>
    <tbody
      v-for="(item, i) in displayItems"
      :key="i"
      :class="{ 'tbody-opened': opened.includes(item.id) }"
    >
      <tr
        :class="{ opened: opened.includes(item.id) }"
        @click="toggle(item.id)"
      >
        <td>
          <router-link :to="item.route" v-if="$isAdmin()">
            {{ item.id }}
          </router-link>
          <a href="#" v-else>
            {{ item.id }}
          </a>
        </td>
        <td>{{ item.tracking_number }}</td>
      </tr>
      <tr
        class="info"
        v-if="item.containers.length > 0"
        v-show="opened.includes(item.id) && !isFetching && item.containers"
      >
        <td colspan="2">
          <table class="table table-container">
            <thead>
              <tr>
                <th>Mã kiện hàng</th>
                <th>Ngày tạo</th>
                <th>Nhãn kiện hàng</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Trọng lượng</th>
                <th class="text-center">Dài x Rộng x Cao</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in item.containers" :key="i">
                <td>
                  <router-link
                    :to="{
                      name: 'container-detail',
                      params: {
                        code: item.code,
                      },
                    }"
                  >
                    {{ item.code }}
                  </router-link></td
                >
                <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                <td>
                  <a v-if="item.tracking_number" href="javascript:void(0)">{{
                    item.tracking_number
                  }}</a></td
                >
                <td class="text-center">{{
                  item.container_items ? item.container_items.length : '0'
                }}</td>
                <td class="text-center">{{ item.weight }}</td>
                <td class="text-center">
                  {{ getBoxInfo(item) }}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { FETCH_SHIPMENT_DETAIL } from '../../shipment/store'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ListInHub',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      opened: [],
      isFetching: false,
    }
  },
  computed: {
    ...mapState('shipment', {
      shipment: (state) => state.shipment,
    }),
    displayItems() {
      return this.items.map((item) => ({
        id: item.id,
        tracking_number: item.tracking_number,
        route: { name: 'shipment-detail', params: { id: item.id } },
        containers: [],
      }))
    },
  },

  methods: {
    ...mapActions('shipment', [FETCH_SHIPMENT_DETAIL]),

    async toggle(id) {
      const index = this.opened.indexOf(id)
      if (index > -1) {
        this.opened.splice(index, 1)
      } else {
        this.isFetching = true
        const result = await this[FETCH_SHIPMENT_DETAIL]({ id: id })
        this.isFetching = false
        if (!result.success) {
          this.$toast.open({ message: result.message, type: 'error' })
        }
        this.displayItems.map((item) => {
          if (item.id == this.shipment.id) {
            item.containers = [...this.shipment.containers]
          }
        })
        console.log(this.displayItems)
        this.opened.push(id)
      }
    },
    getBoxInfo(container) {
      return `${container.length} x ${container.width}  x ${container.height}`
    },
  },
}
</script>
