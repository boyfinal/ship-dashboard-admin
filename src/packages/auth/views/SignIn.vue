<template>
  <div class="page vertical-align sign-in">
    <div class="vertical-align-middle">
      <div class="mb-16">
        <div class="header-2">
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
              v-model="email"
              @keyup.enter="onSignIn"
              :required="requiredEmail"
            />
          </div>
          <div class="mb-16">
            <div class="label">
              <label class=" color-newtral-10 font-weight-600">Mật khẩu</label>
            </div>
            <p-input
              placeholder="Nhập mật khẩu của bạn"
              type="password"
              hiddenPass="on"
              v-model="password"
              :required="requiredPassword"
              @keyup.enter="onSignIn"
            />
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

      <p class="new-member">
        <span>Bạn là thành viên mới?</span>
        <router-link class=" creatAcount" :to="{ name: 'sign-up' }"
          >Tạo tài khoản
        </router-link>
      </p>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import mixinRoute from '@core/mixins/route'

export default {
  components: { VueRecaptcha },
  mixins: [mixinRoute],
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      result: { success: false, message: '' },
      form: {
        checkCaptcha: false,
      },
      count: 0,
      status: false,
      requiredPassword: false,
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

    checkRequired() {
      let result = true
      if (this.password == '') {
        this.requiredPassword = true
        result = false
      } else {
        this.requiredPassword = false
      }

      if (this.email == '') {
        this.requiredEmail = true
        result = false
      } else {
        this.requiredEmail = false
      }

      return result
    },

    pushNoti() {
      this.showNotificationMessage('This is message')
    },

    async onSignIn() {
      if (!this.checkRequired()) {
        return
      }

      const data = {
        password: this.password,
      }

      if (this.email.includes('@')) {
        data.email = this.email.trim().toLowerCase()
      } else {
        data.phone_number = this.email.trim()
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
        if (this.result.user && this.result.user.email) {
          // eslint-disable-next-line no-undef
          // $crisp.push(['set', 'user:nickname', [this.result.user.username]])
          // eslint-disable-next-line no-undef
          // $crisp.push(['set', 'user:email', this.result.user.email])
        }
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
