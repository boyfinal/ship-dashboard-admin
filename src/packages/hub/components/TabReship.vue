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
          <router-link :to="item.route" v-if="$isAdmin()">
            {{ item.id }}
          </router-link>
          <a href="#" v-else>
            {{ item.id }}
          </a>
        </td>
        <td>{{ item.code }}</td>
        <td>
          {{ item.tracking_number }}
          <a href="#" @click.prevent="printHandle(item.label_url)"
            ><p-svg name="print"></p-svg
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { printImage } from '@core/utils/print'
import http from '@core/services/http'

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
        item.route = { name: 'package-detail', params: { id: item.id } }
        return item
      })
    },
  },
  methods: {
    async printHandle(label) {
      document.activeElement && document.activeElement.blur()

      try {
        if (!label) return

        if (/^http/gi.test(label)) {
          printImage(label)
          return
        }

        const res = await http.get(
          `/uploads/file-export/download?type=labels&url=${label}`,
          { type: 'blob' }
        )

        if (!res || res.error) {
          return this.$toast.error(res.errorMessage || '')
        }

        const src = (window.webkitURL || window.URL).createObjectURL(res)
        printImage(src)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
  },
}
</script>
