<template>
  <table class="table table-hover" id="tbl-packages">
    <thead>
      <tr>
        <template>
          <th>MÃ ĐƠN HÀNG</th>
          <th>LIONBAY TRACKING</th>
          <th>TRẠNG THÁI</th>
          <th></th>
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
        <td>{{ item.status_text }}</td>
        <td class="text-right">
          <button class="btn btn-outline-info" @click="select(item)"
            >Lý do</button
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'ListReturn',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    displayItems() {
      return this.items.map((item) => {
        item.status_text = item.package_return_id
          ? 'Đã gửi lý do'
          : 'Chưa gửi lý do'
        return item
      })
    },
  },
  methods: {
    select(item) {
      this.$emit('select', item)
    },
  },
}
</script>
