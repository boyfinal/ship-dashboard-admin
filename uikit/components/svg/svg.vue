<template>
  <Component :is="com" v-bind="$attrs" @v-on="$listeners" />
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
}
</script>
