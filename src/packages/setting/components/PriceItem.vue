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
      let value = e.target.value.toString().trim()
      if (value == '') {
        e.target.value = 0
        return
      }

      value = value.replace(/^0*/, '')
      if (/^\d+\.?\d{0,2}$/gm.test(value)) {
        this.price_value = value
        this.updatePrice({ id: this.current.id, price: value })
      }

      e.target.value = this.price_value
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
