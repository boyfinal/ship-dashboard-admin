import Vue from 'vue'
import Notifications from 'vue-notification'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import MainPlugin from './plugins/main'
import * as filters from './core/helpers/filters'
import initGlobalDirectives from '@core/vue/directives'
import router from './core/router'
import store from './core/store'
import '../uikit'
import { VclTable } from 'vue-content-loading'
import validationMessagesVi from 'vee-validate/dist/locale/vi'
import VeeValidate from 'vee-validate'
// import validationMessagesEn from 'vee-validate/dist/locale/en'

Vue.use(VueClipboard)
Vue.use(VeeValidate, {
  locale: 'vi',
  dictionary: { vi: validationMessagesVi },
  aria: true,
})
Vue.use(Notifications)
Vue.use(MainPlugin)

Vue.component('VclTable', VclTable)
initGlobalDirectives()

VeeValidate.Validator.extend('username', {
  getMessage: () => `Tài khoản chỉ chứa số và chữ cái`,
  validate: (value) => {
    const regex = new RegExp(/^[a-zA-Z0-9]{4,36}$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('phone', {
  getMessage: () =>
    `Nhập số điện thoại từ 10 đến 11 chữ số, bắt đầu bằng 0,84 hoặc +84`,
  validate: (value) => {
    const regex = new RegExp(/^[0-9+()-. ]+$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('phone_number', {
  getMessage: () =>
    `Phone must be in a valid phone number (e.g., 123 456-789).`,
  validate: (value) => {
    /* eslint-disable */
    const regex = new RegExp(
      /^[0-9+()-. ]+$/
      // /\(?([0-9]{2})\)?([ .-]?)([0-9]{2})+$/
    )
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('phone_number_space', {
  getMessage: () => `Your phone number can't end with a blank space`,
  validate: (value) => {
    const regex = new RegExp(/.*[ ]$/)
    return !regex.test(value)
  },
})
VeeValidate.Validator.extend('shop_email', {
  getMessage: () =>
    `Email must be in a valid email format (e.g., you@example.com).`,
  validate: (value) => {
    const regex = new RegExp(
      /^[a-z0-9A-Z_\\.]{1,32}@[a-z0-9A-Z]{2,}(\.[a-z0-9A-Z]{2,4}){1,2}$/
    )
    return regex.test(value)
  },
})

VeeValidate.Validator.extend('fullName', {
  getMessage: () => `Tên không hợp lệ`,
  validate: (value) => {
    const regex = new RegExp(
      /^([^0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*){0,150}$/
    )
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('shopName', {
  getMessage: () => `Be between 1-100 characters.`,
  validate: (value) => {
    const regex = new RegExp(/^.{1,100}$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('phoneAddress', {
  getMessage: () => `Số điện thoại không hợp lệ `,
  validate: (value) => {
    /* eslint-disable */
    const regex = new RegExp(/^[0-9+\-() ]{1,}$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('city', {
  getMessage: () => `Thành phố không hợp lệ`,
  validate: (value) => {
    const regex = new RegExp(/^[\s+a-zA-Z0-9_.,\-\u00A1-\uFFFF]{1,50}$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('state', {
  getMessage: () => `Mã vùng không hợp lệ`,
  validate: (value) => {
    const regex = new RegExp(/^[\s+a-zA-Z0-9_.,\-\u00A1-\uFFFF]{1,15}$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('postcode', {
  getMessage: () => `Mã bưu điện không hợp lệ`,
  validate: (value) => {
    const regex = new RegExp(/^[0-9\-\_\ ]{1,15}$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('countrycode', {
  getMessage: () => `Mã quốc gia không hợp lệ `,
  validate: (value) => {
    const regex = new RegExp(/^[a-zA-Z0-9\-\_\ ]{1,3}$/)
    return regex.test(value)
  },
})

VeeValidate.Validator.extend('weight', {
  getMessage: () => `Số  cân nặng  không hợp lệ `,
  validate: (value) => {
    const regex = new RegExp(/^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('length', {
  getMessage: () => `Số đo chiều dài  không hợp lệ `,
  validate: (value) => {
    const regex = new RegExp(/^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('height', {
  getMessage: () => `Số đo chiều cao  không hợp lệ `,
  validate: (value) => {
    const regex = new RegExp(/^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('width', {
  getMessage: () => `Số đo chiều rộng  không hợp lệ `,
  validate: (value) => {
    const regex = new RegExp(/^\s*(?=.*[1-9])\d*(?:\.\d{1,20})?\s*$/)
    return regex.test(value)
  },
})
VeeValidate.Validator.extend('address', {
  getMessage: () => `Địa chỉ  không hợp lệ `,
  validate: (value) => {
    const regex = new RegExp(/[A-Za-z0-9'\.\-\s\,]/)
    return regex.test(value)
  },
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

// Register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
