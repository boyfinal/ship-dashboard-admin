<template>
  <div class="claim-detail-page pages">
    <div class="container">
      <div class="content-page">
        <div class="page-header">
          <div class="page-header_back">
            <router-link :to="{ name: 'list-claim' }" class="text">
              <img
                src="@/assets/img/Arrow - Left Square 24px.png"
                class="page-header_back_icon"
              />

              Đơn hàng khiếu nại
            </router-link>
          </div>
          <div class="page-header-group">
            <div class="page-header_title header-2">
              <span style="font-weight: bold" v-if="claim.title">{{
                truncate(claim.title, 50)
              }}</span>
              <!-- <span
                v-if="claim.status == 1"
                class="edit-ticket"
                @click="showTicketModal"
              >
                <img src="~@/assets/img/edit-2.svg" alt="edit" />
              </span> -->
            </div>
            <div
              class="page-header-group-actions__right"
              v-if="claim.status != 2"
            >
              <a href="#" class="btn btn-primary" @click="showModalReply">
                <span>Trả lời</span>
              </a>
              <a
                href="#"
                class="btn btn-danger ml-10"
                @click="actionCancelTicket()"
              >
                <span>Đóng</span>
              </a>
            </div>
          </div>
        </div>
        <div class="page-content">
          <div class="page-content_note">
            <div class="card" :style="styleInfoObject" ref="claimInfo">
              <div class="note-content">
                <ul class="list-note">
                  <li class="item-note">
                    <span class="item-title">Trạng thái:</span>
                    <span
                      style="margin-left: 10px"
                      v-status:status="formatStatus(claim.status)"
                    ></span>
                  </li>
                  <li class="item-note">
                    <span class="item-title">Lý do: </span>
                    {{ formatReason(claim.category) }}
                  </li>
                  <li class="item-note">
                    <span class="item-title">Mã vận đơn: </span>
                    <router-link
                      v-if="claim.package"
                      :to="{
                        name: 'package-detail',
                        params: { id: claim.package.id },
                      }"
                    >
                      {{ claim.package.code }}
                    </router-link>
                  </li>
                  <li class="item-note">
                    <span class="item-title">Ngày tạo: </span>
                    {{ claim.created_at | datetime('dd/MM/yyyy HH:mm:ss') }}
                  </li>
                  <li class="item-note">
                    <span class="item-title">Ngày cập nhật gần nhất: </span>
                    {{ claim.updated_at | datetime('dd/MM/yyyy HH:mm:ss') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="menu_content">
            <div class="page-content_drag claim-messages" ref="messages">
              <div
                class="user-content card main-claim"
                :style="styleObject"
                ref="mainClaim"
              >
                <div
                  class="user-title d-flex justify-content-between align-items-center"
                >
                  <div class="info-user">
                    <img
                      src="~@/assets/img/avatar.png"
                      alt="avatar"
                      class="avatar-user"
                    />
                    <span v-if="claim.user" class="user-name">{{
                      claim.user.full_name || claim.user.email
                    }}</span>
                  </div>
                  <div class="user-time">
                    {{ claim.created_at | datetime('dd/MM/yyyy HH:mm:ss') }}
                  </div>
                </div>
                <div class="user-text">
                  {{ claim.content }}
                </div>
                <div class="gallery ticket-attach-files" v-if="hasFiles">
                  <div class="list-item">
                    <div
                      class="item"
                      v-for="(file, i) in claim.attachment"
                      :key="i"
                    >
                      <div
                        class="gallery-item"
                        :class="{ 'ticket-file': isImage(file) }"
                      >
                        <file :src="file" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Message v-for="(mes, i) in messages" :key="i" :current="mes" />
              <div
                class="d-flex justify-content-between align-items-center mb-16"
                v-if="count > 0"
              >
                <p-pagination
                  :total="count"
                  :perPage.sync="filter.limit"
                  :current.sync="filter.page"
                  size="sm"
                ></p-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <modal-edit-ticket
      @success="toggleShowTicket"
      :visible.sync="isTicketOpen"
      v-if="isTicketOpen"
    >
    </modal-edit-ticket> -->
    <modal-reply
      :claim="claim"
      :visible.sync="isVisibleModalReply"
      v-if="isVisibleModalReply"
      @success="replySuccess"
    ></modal-reply>

    <modal-confirm
      :visible.sync="isVisibleCancelClaim"
      v-if="isVisibleCancelClaim"
      :actionConfirm="actions.cancel.button"
      :description="actions.cancel.Description"
      :title="actions.cancel.title"
      :type="actions.cancel.type"
      @action="handleCancelTicket()"
    >
    </modal-confirm>
  </div>
</template>

<script>
import mixinUpload from '@core/mixins/upload'
import mixinRoute from '@core/mixins/route'
import File from '../components/File'
import Browser from '@core/helpers/browser'
import ModalReply from '../components/ModalReply'
import { mapActions, mapState, mapMutations } from 'vuex'
import Message from '../components/Message'
import {
  UPDATE_TICKET,
  UPDATE_FILE_TICKET,
  CANCEL_TICKET,
  FETCH_MESSAGE,
  GET_FILE_TICKET,
} from '../store'
import { FETCH_TICKET } from '@/packages/claim/store'
import { CLAIM_STATUS } from '../constants'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import { truncate } from '@core/utils/string'

export default {
  name: 'ClaimDetail',
  mixins: [mixinUpload, mixinRoute],
  components: {
    File,
    ModalReply,
    Message,
    ModalConfirm,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    actionConfirm: {
      type: String,
    },
    type: {
      type: String,
      default: 'primary',
    },
  },
  data() {
    return {
      isVisibleCancelClaim: false,
      content: '',
      reply: '',
      reason: null,
      files: [],
      isUploading: false,
      title: '',
      urls: [],
      requiredReason: false,
      selectReason: false,
      solution: null,
      isVisibleConfirmDelete: false,
      deleteFile: null,
      validTitle: false,
      isTicketOpen: false,
      attach_files: [],
      isVisibleModalReply: false,
      messages: [],
      isMessageLoading: false,
      filter: {
        limit: 20,
      },
      styleObject: {},
      styleInfoObject: {},
      claimStatus: CLAIM_STATUS,
      actions: {
        cancel: {
          title: 'Đóng khiếu nại',
          button: 'Xác nhận',
          Description: `Bạn có chắc chắn đóng khiếu nại này ?`,
          type: 'danger',
        },
      },
    }
  },
  computed: {
    ...mapState('claim', {
      claim: (state) => state.ticket,
      count: (state) => state.countMess,
    }),
  },
  created() {
    ;(this.filter = this.getRouteQuery()), this.init()
  },
  mounted() {
    this.scrollHandle()
  },
  methods: {
    ...mapActions('claim', [
      FETCH_TICKET,
      UPDATE_FILE_TICKET,
      UPDATE_TICKET,
      CANCEL_TICKET,
      FETCH_MESSAGE,
      GET_FILE_TICKET,
    ]),
    ...mapMutations(['updateTicketMessage']),
    truncate,
    async init() {
      this.handleUpdateRouteQuery()
      window.scrollTo(0, 0)
      const { id } = this.$route.params
      await this[FETCH_TICKET](id)
      await this.handlerFetchTicketMessages(id)
      this.reason = this.claim.category
      this.orderId = this.claim.object_id
      this.title = this.claim.subject
      this.content = this.claim.content
      this.solution = this.claim.solution
      this.reply = this.claim.reply
      if (this.claim.attach_files != null) {
        this.claim.attach_files.forEach((x) =>
          this.files.push({ name: x, url: x })
        )
      }
    },

    scrollHandle() {
      let eMain = null
      let eMessage = null
      let eInfo = null
      window.onscroll = () => {
        if (!eMain) {
          eMain = this.$refs.mainClaim
        }

        if (!eInfo) {
          eInfo = this.$refs.claimInfo
        }

        if (!eMessage) {
          eMessage = this.$refs.messages
        }

        if (!eMain || !eMessage) return
        const { height } = eMain.getBoundingClientRect()
        const { top, left, width } = eMessage.getBoundingClientRect()
        const rectInfo = eInfo.getBoundingClientRect()

        if (top - 56 < 0) {
          if (this.classMainClaim === 'fixed') return

          this.styleObject = {
            top: '56px',
            left,
            width: width + 'px',
            position: 'fixed',
            'z-index': 999,
          }

          this.styleInfoObject = {
            top: '56px',
            left: rectInfo.left,
            width: rectInfo.width + 'px',
            position: 'fixed',
            'z-index': 999,
          }

          let hh = height + 12
          eMessage.style.paddingTop = hh + 'px'
        } else {
          if (this.classMainClaim === '') return

          this.styleObject = {}
          this.styleInfoObject = {}
          eMessage.style.paddingTop = 0
        }
      }
    },

    adjustIconsInTextarea() {
      this.requiredContent = false
    },

    showTicketModal() {
      this.isTicketOpen = !this.isTicketOpen
    },
    toggleShowTicket() {
      this.isTicketOpen = !this.isTicketOpen
      this.init()
    },
    hasFiles() {
      return this.claim.attachment && this.claims.attachment.length
    },
    extenionFileUrl(val) {
      const rex = /(?:\.([^.]+))?$/
      const ext = rex.exec(val)[1]
      if (ext === undefined) {
        return ''
      }

      return ext
    },
    isImage(url) {
      const ext = this.extenionFileUrl(url)
      if (['png', 'jpg', 'jpeg'].indexOf(ext) !== -1) {
        return true
      }
      return false
    },

    async getTicketFile(url, isFile) {
      let result = ''

      this.isFetching = true
      try {
        const payload = {
          url: url,
          type: 'tickets',
        }
        result = await this.getFileTicket(payload)

        if (!result.success) {
          this.$toast.open({ type: 'error', message: `Download failed ! ` })
          return false
        }
      } catch (e) {
        this.$toast.open({ type: 'error', message: `Download failed !` })
      }
      this.isFetching = false

      if (isFile) {
        Browser.downloadBlob(result.blob, url.split('/').pop())
      } else {
        return window.URL.createObjectURL(result.blob)
      }
    },

    getTicketFiles() {
      if (!this.attach_files.length) return false

      this.attach_files.forEach(async (el, i) => {
        if (this.isImage(el)) {
          let result = this.getTicketFile(el, false)
          result.then((response) => {
            this.$set(this.attach_files, i, {
              url: el,
              blob: response,
            })
          })
        }
      })
    },
    async handlerFetchTicketMessages(id) {
      this.isMessageLoading = true
      let payload = this.filter
      payload.ticket_id = id
      const res = await this[FETCH_MESSAGE](payload)
      this.isMessageLoading = false

      if (!res || res.error) {
        this.$toast.open({ type: 'error', message: res.message })
        return
      }

      this.messages = res.messages
    },

    formatReason(reason) {
      switch (reason) {
        case 1:
          return 'Sửa đơn'
        case 2:
          return 'Phí hóa đơn'
        case 3:
          return 'Không cập nhật trạng thái'
        case 4:
          return 'Khác'
      }
    },

    formatStatus(status) {
      for (const [key, value] of Object.entries(this.claimStatus)) {
        if (status == value) {
          return key
        }
      }
    },

    showModalReply() {
      this.isVisibleModalReply = true
    },
    replySuccess(reply) {
      const { id } = this.$route.params
      this[FETCH_TICKET](id)
      this.messages.unshift(reply)
      this.init()
    },

    actionCancelTicket() {
      this.isVisibleCancelClaim = true
    },

    async handleCancelTicket() {
      this.isVisibleCancelClaim = false
      let payload = {
        id: this.claim.id,
      }
      const result = await this[CANCEL_TICKET](payload)
      if (result.error) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }
      this.$toast.open({
        type: 'success',
        message: ' Thành công',
      })
      this.files = []
      this.init()
    },
  },
  watch: {
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
