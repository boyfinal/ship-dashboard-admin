<template>
  <div :class="wrapperClasses">
    <template
      v-if="
        type !== 'textarea' &&
          type !== 'password' &&
          type !== 'phonenumber' &&
          type !== 'search'
      "
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

      <!-- <i
        v-if="hiddenPass == 'on'"
        class="form-control-icon form-control-icon-right"
        :class="`wb-${typeInputPassword == 'password' ? 'eye' : 'eye-close'}`"
        @click.prevent="togglePasswordVisibelity()"
      ></i> -->
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

    <span
      class="invalid-error"
      v-if="
        !validateField.valid &&
          type != 'username' &&
          type != 'designname' &&
          validate == 'on' &&
          required == false
      "
    >
      {{ validateField.errors[0] }}
    </span>

    <span class="invalid-error" v-if="required == true && type != 'username'">
      Vui lòng không để trống!
    </span>

    <span
      class="invalid-error"
      v-if="required == true && type == 'username' && focusUsername == false"
    >
      Vui lòng không để trống!
    </span>

    <span
      v-if="
        type == 'username' &&
          focusUsername == true &&
          validate == 'on' &&
          this.input != ''
      "
      class="check-list"
    >
      <div class="hints">
        <p
          v-for="(item, index) in validateUsername"
          :key="index"
          class="checkList"
        >
          <i class="wb-check" :class="{ success: checkValidate(item.message) }">
          </i>
          {{ item.message }}</p
        >
      </div>
    </span>

    <span
      v-if="
        type == 'designname' &&
          focusUsername == true &&
          validate == 'on' &&
          this.input != ''
      "
      class="check-list"
    >
      <div class="hints">
        <p
          v-for="(item, index) in validateDesignname"
          :key="index"
          class="checkList"
        >
          <i class="wb-check" :class="{ success: checkValidate(item.message) }">
          </i>
          {{ item.message }}</p
        >
      </div>
    </span>
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
    validate: {
      type: String,
      default: 'off',
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
  },
  data() {
    return {
      formatInput: '',
      focusUsername: false,
      typeInputPassword: 'password',
      validatePassword: [
        // {
        //   message: 'Not contain special characters.',
        //   regex: /[^A-Za-z\d@$!%*#?& ]/,
        //   result: false,
        // },
        // {
        //   message: 'Mật khẩu không hợp lệ ',
        //   regex: /^[ ].*|[ ]$/,
        //   result: false,
        // },
        {
          message: 'Mật khẩu không hợp lệ',
          regex: /^.{4,}$/,
          result: true,
        },
      ],
      validateEmail: [
        {
          message: 'Số điện thoại / Email không hợp lệ',
          regex: /^[a-z0-9A-Z_\\.]{1,32}@[a-z0-9A-Z]{2,}(\.[a-z0-9A-Z]{2,4}){1,2}$/,
          result: true,
        },
      ],
      validateUsername: [
        {
          message: 'Not contain special characters.',
          regex: /[^\w]/,
          result: false,
        },
        {
          message: 'Be between 5-50 characters.',
          regex: /^.{5,50}$/,
          result: true,
        },
      ],
      validateDesignname: [
        {
          message: 'Not contain special characters (except - and _ ).',
          regex: /[^\w|-]/,
          result: false,
        },
      ],
      validatePhonenumber: [
        {
          message: 'Số điện thoại / Email không hợp lệ',
          // regex: /^[+]?[(]?[0-9]{2,3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
          regex: /^[0-9+\-() ]{1,20}$/,
          result: true,
        },
      ],
      validateShopName: [
        {
          message: 'Be between 1-100 characters.',
          regex: /^.{1,100}$/,
          result: true,
        },
        {
          message: 'Shop name must be in a valid shop name format.',
          regex: /<[^>]*>$/,
          result: false,
        },
      ],
      validateOrderID: [
        {
          message: ' OrderID must be in a  number format and great than 0 .',
          regex: /^[1-9][0-9]*$/,
          result: true,
        },
      ],
      validateFullName: [
        {
          message: 'Tên không hợp lệ',
          regex: /^([^0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*){0,150}$/,
          result: true,
        },
      ],
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
        },
        this.type == 'password' &&
        !this.validateField.valid &&
        this.validate == 'on'
          ? 'input-invalid'
          : '',
        this.type == 'email' &&
        !this.validateField.valid &&
        this.validate == 'on'
          ? 'input-invalid'
          : '',
        this.type == 'username' &&
        !this.validateField.valid &&
        this.validate == 'on'
          ? 'input-invalid'
          : '',
        this.type == 'shopname' &&
        !this.validateField.valid &&
        this.validate == 'on'
          ? 'input-invalid'
          : '',
        this.type == 'phonenumber' &&
        !this.validateField.valid &&
        this.validate == 'on'
          ? 'input-invalid'
          : '',
        this.type == 'OrderId' &&
        !this.validateField.valid &&
        this.validate == 'on'
          ? 'input-invalid'
          : '',
        this.type == 'designname' &&
        !this.validateField.valid &&
        this.validate == 'on'
          ? 'input-invalid'
          : '',
        this.required == true ? 'input-invalid' : '',
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
    validateField() {
      let errors = []
      if (this.input == '') return { valid: true, errors }
      if (this.type == 'password') {
        for (let condition of this.validatePassword) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'email') {
        for (let condition of this.validateEmail) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'username') {
        for (let condition of this.validateUsername) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'designname') {
        for (let condition of this.validateDesignname) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'emailornumber' && !this.value.match(/[a-z]/i)) {
        for (let condition of this.validatePhonenumber) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'emailornumber' && this.value.match(/[a-z]/i)) {
        for (let condition of this.validateEmail) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'shopname') {
        for (let condition of this.validateShopName) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'phone') {
        for (let condition of this.validatePhonenumber) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'OrderId') {
        for (let condition of this.validateOrderID) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else if (this.type == 'fullname') {
        for (let condition of this.validateFullName) {
          if (!condition.regex.test(this.input) == condition.result) {
            errors.push(condition.message)
          }
        }
        if (errors.length == 0) {
          return { valid: true, errors }
        } else {
          return { valid: false, errors }
        }
      } else {
        return { valid: true, errors }
      }
    },
  },
  methods: {
    checkValidate(item) {
      return !this.validateField.errors.includes(item)
    },
    onInput(event) {
      if (event.target.value !== this.value) {
        this.$emit('input', event.target.value)
        // this.input = event.target.value
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
    },
  },
  watch: {
    input: {
      handler(newVal) {
        this.$emit('status', this.validateField.valid)
        this.formatInput = newVal
      },
      deep: true,
    },
  },
}
</script>
