<template>
  <div
    class="animsition layout-full"
    :class="$route.meta && $route.meta.class ? $route.meta.class : ''"
  >
    <div class="app container-fluid">
      <div class="row">
        <div class="img  disable-moblie hide-tablet">
          <div class="img_logo">
            <router-link :to="{ name: 'sign-in' }">
              <img class="img_logo-img" alt="" />
            </router-link>
          </div>
        </div>
        <div class="content ">
          <div class="content_help  hide-tablet disable-moblie">
            <img
              class="content_help-icon"
              src="~@/assets/img/Support.svg"
              alt=""
            />

            <a target="_blank" class="content_help-text">Cần trợ giúp ?</a>
          </div>
          <!-- logo tablet -->
          <div class="logo_tablet">
            <img
              src="~@/assets/img/logo_dark 2.svg"
              alt=""
              class="logo_tablet-img"
            />
          </div>
          <!-- end logo tablet -->

          <!-- logo mobile -->
          <div class="logo_mobile">
            <img
              src="~@/assets/img/logo_dark 1.svg"
              alt=""
              class="logo_mobile-img"
            />
          </div>
          <!-- end logo mobile -->

          <div class="form">
            <router-view :key="$route.fullPath" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FullPage',
  data() {
    return {
      urlSingup: 'https://help.lionnix.com/general/registration/ ',
      urlSingin: 'https://help.lionnix.com/general/sign-in/',
      urlPass: 'https://help.lionnix.com/general/password-recovery/',
    }
  },
  computed: {},
}
</script>
