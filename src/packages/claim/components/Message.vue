<template>
  <div class="cs-reply">
    <div class="user-content card">
      <div class="user-title d-flex justify-content-between align-items-center">
        <div class="info-user">
          <img
            src="~@/assets/img/avatar-dark.svg"
            alt="avatar"
            class="avatar-user"
          />
          <span class="user-name">{{ displayName }}</span>
          <span class="role-user" v-show="roleName">{{ roleName }}</span>
        </div>
        <div class="user-time">
          {{ current.created_at | datetime('dd/MM/yyyy HH:mm:ss') }}
        </div>
      </div>
      <div class="user-text">
        {{ current.content }}
      </div>
      <div class="gallery ticket-attach-files" v-if="hasFiles">
        <div class="list-item">
          <div class="item" v-for="(file, i) in files" :key="i">
            <div :class="classImage(file)">
              <File :src="file" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import File from './File'
import AuthService from '@core/services/auth'

export default {
  name: 'TicketMessage',
  components: { File },
  props: {
    current: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    files() {
      return this.current.attachment || []
    },
    hasFiles() {
      return this.files.length
    },
    displayName() {
      if (this.current.user_id == this.authId) {
        return this.current.full_name || 'Me'
      }

      if (this.user_role == 'support') {
        return this.current.user_name || 'Support'
      }

      return this.current.user_name || 'Undefined'
    },
    roleName() {
      if (this.current.user_role == 'support') {
        return 'CSKH'
      }

      return ''
    },
    authId() {
      return AuthService.getId()
    },
  },
  methods: {
    classImage(url) {
      const re = /(?:.jpg|.png|.jpeg)$/i
      if (re.test(url)) {
        return 'gallery-item ticket-file'
      }

      return 'gallery-item'
    },
  },
}
</script>
