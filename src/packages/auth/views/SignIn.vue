<template>
  <div class="page vertical-align sign-in">
    <div class="vertical-align-middle">
      <div class="mb-16 header-text">
        <div class="header-2 text-center">
          Đăng nhập
        </div>
      </div>
      <div>
        <form @submit.prevent="onSignIn">
          <div class="mb-16">
            <label class=" color-newtral-10 font-weight-600"
              >Số điện thoại / Email</label
            >
            <p-input
              placeholder="Nhập số điện thoại hoặc email"
              v-model="form.email"
              @keyup.enter="onSignIn"
            />
            <span class="invalid-error" v-if="!!errors.email">
              {{ errors.email }}
            </span>
          </div>
          <div class="mb-16">
            <div class="label">
              <label class=" color-newtral-10 font-weight-600">Mật khẩu</label>
            </div>
            <p-input
              placeholder="Nhập mật khẩu của bạn"
              type="password"
              hiddenPass="on"
              v-model="form.password"
              @keyup.enter="onSignIn"
            />
            <span class="invalid-error" v-if="!!errors.password">
              {{ errors.password }}
            </span>
          </div>
          <div class="captcha mt-40" v-if="count >= 1">
            <vue-recaptcha
              ref="recapcha"
              @verify="onVerify"
              :sitekey="`${recapchaKey}`"
              :loadRecaptchaScript="true"
            >
            </vue-recaptcha>
            <span class="invalid-error" v-if="check == false">
              Please check the captcha
            </span>
          </div>
          <p-button
            class="mb-16 btn btn-special  "
            :loading="isLoading"
            @click="onSignIn"
            :type="`java-blue`"
          >
            Đăng nhập
          </p-button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import mixinRoute from '@core/mixins/route'
import * as yup from 'yup'
export default {
  components: { VueRecaptcha },
  mixins: [mixinRoute],
  name: 'SignIn',
  data() {
    return {
      isLoading: false,
      result: { success: false, message: '' },
      form: {
        checkCaptcha: false,
        email: '',
        password: '',
      },
      errors: {
        email: '',
        password: '',
      },
      count: 0,
      status: false,
      requiredEmail: false,
      check: true,
    }
  },
  computed: {
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
    recapchaKey() {
      return `${process.env.VUE_APP_RECAPCHA_KEY}`
    },
  },
  mounted() {
    const { type, message } = this.$route.query

    if (type && message) {
      this.$toast.open({ type: type, message: decodeURI(message) })
      this.handleUpdateRouteQuery({}, true)
    }
  },
  methods: {
    ...mapActions('auth', ['signIn']),

    redirect() {
      return this.$router.push('/forgot')
    },

    async validate() {
      const formSchema = yup.object().shape({
        email: yup.string().required('Email không để trống'),
        password: yup.string().required('Password không để trống'),
      })
      await formSchema
        .validate(this.form, { abortEarly: false })
        .then(() => {
          this.errors = []
        })
        .catch((err) => {
          err.inner.forEach((x) => {
            this.errors[x.path] = x.message
          })
        })
      return !this.errors.email && !this.errors.password
    },
    async onSignIn() {
      if (!(await this.validate())) {
        return
      }
      const data = {
        password: this.form.password,
      }

      if (this.form.email.includes('@')) {
        data.email = this.form.email.trim().toLowerCase()
      } else {
        data.phone_number = this.form.email.trim()
      }

      if (this.count >= 1 && !this.form.checkCaptcha) {
        this.check = false
        return
      }
      this.isLoading = true
      this.result = await this.signIn(data)
      setTimeout(() => {
        this.isLoading = false
      }, 1000)

      if (this.result.number_incorrect >= 3) {
        this.count += 1
      }

      if (this.result.success) {
        setTimeout(() => {
          let { path } = this.$route.query
          if (!path) {
            path = '/'
          } else {
            path = decodeURIComponent(path.replace(/\+/g, '%20'))
          }
          this.$router.push(path)
        }, 1000)
      } else {
        this.$toast.open({
          type: 'error',
          message: this.result.message,
          duration: 3000,
        })
      }
    },
    onVerify: function(response) {
      if (response) this.form.checkCaptcha = true
      this.check = true
    },
  },
}
</script>
