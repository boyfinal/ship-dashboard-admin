<template>
  <div class="page vertical-align">
    <div class="vertical-align-middle">
      <div class="text-center mb-40">
        <h2 class="header-2 mb-24">Forgot your password?</h2>
        <div class="text">
          <p
            >Don't worry! Enter the email address you used when you joined and
            we’ll send you instructions to reset your password.</p
          >
        </div>
      </div>
      <form @submit.prevent="onForgot">
        <label class=" font-weight-bold mb-4  ">Email</label>
        <p-input
          type="email"
          class="mb-20"
          name="email"
          placeholder="you@example.com"
          v-model="email"
          :input="email"
          validate="on"
          :required="requiredEmail"
        />
        <div class="captcha mb-40 mt-40">
          <vue-recaptcha
            ref="recapcha"
            @verify="onVerify"
            @expired="onCaptchaExpired"
            :sitekey="`${recapchaKey}`"
            :loadRecaptchaScript="true"
          >
          </vue-recaptcha>
          <span class="invalid-error" v-if="check == false">
            Please check the captcha
          </span>
        </div>
        <button class="btn btn-special btn-primary mb-20 "
          >Reset Password</button
        >
        <p class="text-center">
          <router-link class="backSignin" :to="{ name: 'sign-in' }">
            Back to Sign in
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'forgot',
  components: { VueRecaptcha },
  data() {
    return {
      email: null,
      form: {
        checkCaptcha: false,
      },
      requiredEmail: false,
      check: true,
    }
  },
  methods: {
    ...mapActions('auth', ['forgotPassword']),
    checkRequired() {
      let result = true
      if (!this.email) {
        this.requiredEmail = true
        result = false
      } else {
        this.requiredEmail = false
      }
      return result
    },

    async onForgot() {
      if (!this.checkRequired()) {
        return
      }
      if (!this.form.checkCaptcha) {
        this.check = false
        return
      }
      const params = {
        email: this.email.toLowerCase(),
      }
      const response = await this.forgotPassword(params)
      if (response.success) {
        this.$refs.recapcha.reset()
        this.form.checkCaptcha = false
        this.$toast.open({
          type: 'success',
          message: response.message,
        })
      } else {
        this.$refs.recapcha.reset()
        this.form.checkCaptcha = false
        this.$toast.open({
          type: 'error',
          message: response.error,
        })
      }
    },
    onVerify: function(response) {
      if (response) this.form.checkCaptcha = true
      this.check = true
    },
    onCaptchaExpired: function() {
      this.form.checkCaptcha = false
    },
  },
  computed: {
    recapchaKey() {
      return `${process.env.VUE_APP_RECAPCHA_KEY}`
    },
  },
}
</script>
