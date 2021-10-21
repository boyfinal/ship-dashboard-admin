<template>
  <tr>
    <td>{{ current.type_name }}</td>
    <td>{{ current.service_name }}</td>
    <td>{{ current.weight_text }}</td>
    <td>
      <input
        type="text"
        class="form-control"
        :value="price_value"
        @input="updateHandle"
      />
    </td>
  </tr>
</template>

<script>
import { mapMutations } from 'vuex'
import { UPDATE_PRICE } from '../store'

export default {
  name: 'PriceItem',
  props: {
    current: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      price_value: 0,
    }
  },
  methods: {
    ...mapMutations('setting', {
      updatePrice: UPDATE_PRICE,
    }),

    updateHandle(e) {
      const value = e.target.value

      if (/^\d+(?:.\d{0,2}){0,1}$/gm.test(value)) {
        this.price_value = parseFloat(value)
        this.updatePrice({ id: this.current.id, price: value })
      } else {
        e.target.value = this.price_value
      }
    },
  },
  watch: {
    current: {
      handler: function(val) {
        this.price_value = val.new_price
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style></style>
