<template>
  <div :class="wrapperClasses">
    <template
      v-if="!['textarea', 'password', 'phonenumber', 'search'].includes(type)"
    >
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
        @focus="focusUsername = true"
        @blur="focusUsername = false"
        :class="formControlClasses"
        v-bind="$attrs"
        :value="nativeInputValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @change="handleChange"
        v-on="listeners"
        v-model="formatInput"
        :type="type"
        ref="input"
      />
      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>

    <template v-if="type == 'phonenumber'">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :class="formControlClasses"
        v-bind="$attrs"
        :value="nativeInputValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @change="handleChange"
        v-on="listeners"
        v-model="formatInput"
        :type="type"
        name="phonenumber"
        ref="input"
      />
      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>

    <template v-if="type == 'password'">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <img
        v-if="hiddenPass == 'on'"
        class="form-control-icon form-control-icon-right"
        :src="
          `${
            typeInputPassword == 'password'
              ? require('@assets/img/eye.svg')
              : require('@assets/img/eye-close.svg')
          }`
        "
        @click.prevent="togglePasswordVisibelity()"
      />

      <input
        :class="formControlClasses"
        v-bind="$attrs"
        :value="nativeInputValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @change="handleChange"
        v-on="listeners"
        v-model="formatInput"
        :type="typeInputPassword"
        name="password"
        ref="input"
      />
      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>

    <template v-if="type == 'textarea'">
      <textarea
        :class="formControlClasses"
        v-bind="$attrs"
        :value="value"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        @change="handleChange"
        ref="textarea"
      >
      </textarea>
    </template>

    <template v-if="type == 'search'">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>

      <img
        class="form-control-icon form-control-icon-left"
        v-if="prefixIcon"
        src="@assets/img/search.svg"
      />

      <img
        class="form-control-icon form-control-icon-right"
        v-if="suffixIcon"
        src="@assets/img/search.svg"
        style="cursor: pointer"
        @click="suffixFunc"
      />

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
        ref="input"
        class="p-input-search"
      />

      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
      <slot />
    </template>

    <span class="invalid-error" v-if="hasError">{{ error }}</span>
  </div>
</template>
<script>
import FormElementMixin from '../../mixins/FormElement'
export default {
  name: 'PInput',
  inheritAttrs: false,
  mixins: [FormElementMixin],
  props: {
    input: {
      type: [String, Number],
      default: '',
    },
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
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    suffixIcon: {
      type: String,
      default: '',
    },
    suffixFunc: {
      type: Function,
      default: () => {},
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
    hiddenPass: {
      type: String,
      default: 'off',
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: String,
  },
  data() {
    return {
      formatInput: '',
      focusUsername: false,
      typeInputPassword: 'password',
    }
  },
  computed: {
    wrapperClasses() {
      return [
        'p-input-group',
        'input-group',
        this.size ? `input-group-${this.size}` : '',
        {
          'form-icons':
            this.prefixIcon ||
            this.suffixIcon ||
            this.isShowClear ||
            this.hiddenPass,
        },
        this.type === 'file' ? 'input-group-file' : '',
      ]
    },

    formControlClasses() {
      return [
        'p-input',
        'form-control',
        {
          rounded: this.rounded,
          'input-invalid': this.hasError,
        },
      ]
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

    setInputValue: {
      get() {
        return this.formatInput
      },
      set(value) {
        this.formatInput = value
      },
    },

    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        focus: this.onFocus,
        keypress: this.keypress,
      }
    },

    hasError() {
      return this.error !== undefined && this.error !== ''
    },
  },
  methods: {
    onInput(event) {
      if (event.target.value !== this.value) {
        this.$emit('input', event.target.value)
        this.$emit('onchange', true)
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

    togglePasswordVisibelity() {
      this.typeInputPassword =
        this.typeInputPassword == 'password' ? 'text' : 'password'
    },

    clear() {
      this.$emit('input', '')
      this.$emit('update:value', '')
      this.$emit('clear')
    },
  },
  watch: {
    input: {
      handler(newVal) {
        this.formatInput = newVal
      },
      deep: true,
    },
  },
}
</script>
