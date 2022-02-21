<template>
  <table class="table table-hover" id="tbl-packages">
    <thead>
      <tr>
        <template>
          <th>MÃ ĐƠN/KIỆN</th>
          <th>LOẠI</th>
          <th>LIONBAY TRACKING</th>
          <th>LAST MILE TRACKING</th>
          <th>NHÃN KIỆN</th>
          <th>NGÀY XUẤT</th>
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
        <td>{{ item.type }}</td>
        <td>{{ item.code }}</td>
        <td>{{ item.tracking_number }}</td>
        <td>{{ item.label_number }}</td>
        <td>{{ item.date }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { datetime } from '@/core/utils/datetime'

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
      return this.items.map((item) => {
        if (item.type == 'container') {
          return {
            id: item.code,
            type: 'Kiện hàng',
            code: 'N/A',
            tracking_number: 'N/A',
            label_number: item.tracking_number,
            date: datetime(item.hub_exported_at, 'dd/MM/yyyy'),
          }
        }

        if (item.type == 'package') {
          return {
            id: item.id,
            type: 'Đơn hàng',
            code: item.code,
            tracking_number: item.tracking_number,
            label_number: 'N/A',
            date: datetime(item.hub_exported_at, 'dd/MM/yyyy'),
          }
        }

        return item
      })
    },
  },
}
</script>
