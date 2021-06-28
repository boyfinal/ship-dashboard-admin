<template>
  <div :class="wrapperClasses">
    <template>
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>

      <i
        class="form-control-icon form-control-icon-left"
        v-if="prefixIcon"
        :class="`wb-${prefixIcon}`"
      >
      </i>

      <i
        class="form-control-icon form-control-icon-right"
        v-if="suffixIcon"
        :class="`wb-${suffixIcon}`"
      ></i>

      <i
        class="form-control-icon form-control-icon-right wb-close"
        v-else-if="isShowClear"
        @click="clear"
      >
      </i>

      <input
        :class="formControlClasses"
        v-bind="$attrs"
        :value="nativeInputValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @change="handleChange"
        v-on="listeners"
        :type="type"
        ref="input"
      />

      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <slot name="input-footer" v-bind:isFocused="isFocused"></slot>
    <template v-if="hasError">
      <span class="invalid-error" v-for="(message, i) in messages" :key="i">
        {{ message }}
      </span>
    </template>
  </div>
</template>
<script>
import FormElementMixin from '../../mixins/FormElement'
export default {
  name: 'PInput',
  inheritAttrs: false,
  mixins: [FormElementMixin],
  props: {
    value: {
      type: [String, Number],
    },
    size: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'lg', 'sm'].indexOf(value) > -1
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    suffixIcon: {
      type: String,
      default: '',
    },
    prefixIcon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: [Object, Array, String],
  },
  computed: {
    hasError() {
      if (!this.error) return false
      if (Array.isArray(this.error)) return this.error.length > 0
      return this.error.keys().length > 0
    },
    messages() {
      return typeof this.error === 'object' ? this.error : [this.error]
    },
    wrapperClasses() {
      const classList = ['p-input-group', 'input-group']

      if (this.size) classList.push(`input-group-${this.size}`)

      if (this.prefixIcon || this.suffixIcon || this.isShowClear) {
        classList.push('form-icons')
      }

      if (this.type === 'file') {
        classList.push('input-group-file')
      }

      if (this.error) classList.push('border-color')
      return classList
    },
    formControlClasses() {
      return ['p-input', 'form-control', { rounded: this.rounded }]
    },
    isShowClear() {
      return (
        this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.nativeInputValue
      )
    },

    nativeInputValue() {
      return this.value === null || typeof this.value === undefined
        ? ''
        : this.value
    },

    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        blur: this.onBlur,
        focus: this.onFocus,
        keypress: this.keypress,
      }
    },
  },
  methods: {
    focus() {
      this.getInput().focus()
    },
    blur() {
      this.getInput().blur()
    },
    onInput(event) {
      if (event.target.value !== this.value) {
        this.$emit('input', event.target.value)
      }
    },
    keypress(evt) {
      if (this.type !== 'number') return true
      evt = evt ? evt : window.event
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46 &&
        charCode !== 45
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    handleChange(e) {
      this.$emit('input', e.target.value)
    },
    clear() {
      this.$emit('input', '')
    },
    getInput() {
      return this.$refs.input
    },
  },
}
</script>
