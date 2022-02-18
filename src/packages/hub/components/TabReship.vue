<template>
  <table class="table table-hover" id="tbl-packages">
    <thead>
      <tr>
        <template>
          <th>MÃ ĐƠN HÀNG</th>
          <th>LIONBAY TRACKING</th>
          <th>LAST MILE TRACKING</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in displayItems" :key="i">
        <td>
          <a href="#">
            {{ item.id }}
          </a>
        </td>
        <td>{{ item.code }}</td>
        <td>{{ item.tracking_number }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'ListReship',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    displayItems() {
      return this.items
    },
  },
}
</script>
