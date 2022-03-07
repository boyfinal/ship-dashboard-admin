<template>
  <table class="table table-hover" id="tbl-packages">
    <thead>
      <tr>
        <template>
          <th>MÃ LÔ</th>
          <th>MANIFEST</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in displayItems" :key="i">
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
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'ListInHub',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    displayItems() {
      return this.items.map((item) => ({
        id: item.id,
        tracking_number: item.tracking_number,
        route: { name: 'shipment-detail', params: { id: item.id } },
      }))
    },
  },
}
</script>
