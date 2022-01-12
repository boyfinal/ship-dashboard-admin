<template>
  <Component
    :is="com"
    v-bind="$attrs"
    @v-on="$listeners"
    @click="handleClick"
  />
</template>

<script>
export default {
  name: 'PSvg',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    com() {
      return require(`@/assets/img/${this.name}.svg`).default
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>
