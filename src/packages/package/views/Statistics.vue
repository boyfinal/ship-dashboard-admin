<template>
  <div class="pages">
    <iframe
      style="overflow: hidden; width: 100%; height: 100vh"
      width="600"
      height="1500"
      seamless
      frameBorder="0"
      scrolling="yes"
      :src="`https://superset.lionnix.com/login?username=view&redirect=/superset/dashboard/13`"
    >
    </iframe>
  </div>
</template>
<script>
import AuthService from '@core/services/auth'

export default {
  name: 'Statistics',
  computed: {
    getToken() {
      return AuthService.getAccessToken()
    },
  },
}
</script>
