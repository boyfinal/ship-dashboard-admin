<template>
  <div
    class="animsition layout-full"
    :class="$route.meta && $route.meta.class ? $route.meta.class : ''"
  >
    <div class="app container-fluid">
      <div class="row">
        <div class="content ">
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
