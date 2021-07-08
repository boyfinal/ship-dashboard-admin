<template>
  <p-modal
    class="modal-reply-ticket"
    :active="visible"
    title="Trả lời"
    @close="handleClose"
  >
    <div class="content-page">
      <div class="page-content">
        <div class="menu_content ">
          <div class="page-content_drag card2">
            <div class="form-group">
              <div
                class="text__aria-title d-flex justify-content-between align-items-center"
              >
                <label class="text-bold"
                  >Nội dung<span class="text-danger">*</span></label
                >
                <span class="countText" :class="[countText(message)]"
                  >{{ this.TicketNote }}/1000</span
                >
              </div>
              <textarea
                class="form-control"
                v-model="message"
                v-validate="'required'"
                data-vv-as="Nội dung"
                name="message"
                key="message"
                :class="{
                  'error-color': errors.has('message'),
                  require: lengthContent,
                }"
                maxlength="1000"
              ></textarea>
              <span class="err-span" v-if="errors.has('message')">{{
                errors.first('message')
              }}</span>
            </div>
            <div class="upload_file">
              <upload
                class="file-uploader"
                :action="uploadFileEndpoint"
                drag
                list-type="picture"
                :headers="uploadHeaders"
                @e-change="listenChange"
                :on-change="handleChangeFile"
                multiple
                :auto-upload="false"
                :on-max-size="errorMaximum"
                :max-file-size="maximumSize"
              >
                <div class="el-upload__text">
                  Thả tệp hoặc hình ảnh để tải lên
                </div>
              </upload>

              <div class="row mb-20">
                <div v-if="fileErrors.length > 0" class="ticket__error">
                  <div class="ticket__error-title">
                    <img
                      src="~@/assets/img/alert.svg"
                      alt=""
                      class="ticket__error-icon"
                    />
                    <span>Tệp tin chưa được thêm vào:</span>
                  </div>
                  <ul class="ticket__error-list">
                    <li
                      v-for="(item, i) in fileErrors"
                      :key="i"
                      class="ticket__error-item"
                    >
                      {{ item }}</li
                    >
                  </ul>
                </div>

                <div v-if="this.validateSize" class="ticket__error">
                  <div class="ticket__error-title">
                    <img
                      src="~@/assets/img/alert.svg"
                      alt=""
                      class="ticket__error-icon"
                    />
                    <span>Tệp tin chưa được thêm vào:</span>
                  </div>
                  <ul class="ticket__error-list">
                    <li class="ticket__error-item">
                      {{ this.name }} đang lớn hơn 5Mb.Vui lòng chọn tệp nhỏ
                      hơn.</li
                    >
                  </ul>
                </div>

                <div v-if="files != null" class="mt-3 ticket__reply-files">
                  <div
                    class="el-before-upload__filename d-flex justify-content-between"
                    v-for="(item, i) in files"
                    :key="i"
                  >
                    <div class="filename mr-3">{{ item.name }}</div>
                    <div :class="{ isUpload: isUploading }" class="remove-file">
                      <img
                        src="~@/assets/img/x-sm.svg"
                        alt=""
                        class="icon-remove"
                        @click.prevent="actionDeletefile(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="rule">
                Định dạng file hợp lệ : XLSX, PNG, JPG, JPEG.Và có dung lượng
                dưới 5Mb
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div>
        <img
          style="margin-bottom: 2px"
          src="~@/assets/img/InfoCircle.svg"
          alt=""
        />
        <b>Lưu ý:</b> (<span style="color: red">*</span>)
        <i>Là các trường bắt buộc nhập.</i>
      </div>
      <div class="d-flex">
        <div>
          <p-button @click="handleClose" type="default">
            Bỏ qua
          </p-button>
        </div>
        <div class="ml-7">
          <p-button type="primary" @click="handleUpdate" :loading="isUploading">
            Gửi trả lời
          </p-button>
        </div>
      </div>
    </template>
    <modal-confirm
      :visible.sync="isVisibleConfirmDelete"
      v-if="isVisibleConfirmDelete"
      :actionConfirm="actions.delete.button"
      :description="actions.delete.Description"
      :title="actions.delete.title"
      :type="actions.delete.type"
      @action="handleDeletefile(deleteFile)"
    >
    </modal-confirm>
  </p-modal>
</template>

<script>
import mixinUpload from '@core/mixins/upload'
import { Upload } from '@kit'
import { mapActions } from 'vuex'
import { UPDATE_FILE_TICKET, PUSH_MESSAGE } from '@/packages/claim/store'
import { MAXIMUM_SIZE } from '../constants'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import evenBus from '../../../core/utils/evenBus'

export default {
  name: 'ModalReply',
  mixins: [mixinUpload],
  components: { Upload, ModalConfirm },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    claim: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isVisibleConfirmDelete: false,
      maximumSize: MAXIMUM_SIZE * 2 ** 20,
      allowedTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      allowedExtensions: /(\.jpg|\.jpeg|\.png|\.xlsx|\.xls)$/i,
      files: [],
      fileErrors: [],
      message: '',
      validErrors: {},
      isUploading: false,
      TicketNote: 0,
      lengthContent: false,
      validateSize: false,
      actions: {
        delete: {
          title: 'Xóa files',
          button: 'Xóa',
          Description: `Bạn có thực sự muốn xóa file này ?`,
          type: 'danger',
        },
      },
      number: 0,
    }
  },
  destroyed() {
    evenBus.$on('my', this.handleF)
  },
  created() {
    evenBus.$on('my', this.handleF)
  },
  methods: {
    ...mapActions('claim', {
      ticketUpload: UPDATE_FILE_TICKET,
      reply: PUSH_MESSAGE,
    }),
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleF(e) {
      this.number += e
    },
    handleAction() {
      this.$emit('action')
    },
    listenChange() {
      this.fileErrors = []
    },
    handleChangeFile(file) {
      // if (!this.validateSizeFile(file)) {
      //   this.fileErrors.push(`"${file.name}" is less than 5Mb.`)
      //   this.fileErrors = [...new Set(this.fileErrors)]
      //   return
      // }

      this.validateSize = false
      const index = this.files.findIndex(({ uid }) => uid === file.uid)
      if (index != -1) {
        this.$set(this.files, index, file)
      }

      if (!this.validateTypeFile(file)) {
        this.number = this.number - 1
        this.fileErrors.push(
          `"${file.name}" định dạng không đúng.Tệp phải có định dạng:  *XLSX, *PNG, *JPG, *JPEG.`
        )
        this.fileErrors = [...new Set(this.fileErrors)]
        return
      }

      this.handleUploadfile(file)
    },
    async handleUploadfile(file) {
      let body = { file: file.raw }

      this.isUploading = true
      const res = await this.ticketUpload(body)

      if (res.error) {
        this.isUploading = false
        this.fileErrors.push(res.message)
        return
      }

      this.files.push({
        url: res.urls,
        uid: file.uid,
        name: file.name,
      })
      if (this.files.length == this.number) {
        this.isUploading = false
      }
    },
    validateTypeFile(file) {
      if (this.allowedExtensions.exec(file.name)) {
        return true
      }

      if (this.allowedTypes.includes(file.raw.type)) {
        return true
      }

      return false
    },
    validateSizeFile(file) {
      if (file.size > 5000000) {
        return false
      }

      return true
    },
    actionDeletefile(file) {
      this.isVisibleConfirmDelete = true
      this.deleteFile = file
    },
    handleDeletefile(file) {
      this.number = this.number - 1
      this.isVisibleConfirmDelete = false
      this.files = this.files.filter(({ uid }) => uid != file.uid)
    },
    async handleUpdate() {
      if (this.isUploading) return
      const validate = await this.$validator.validateAll()
      if (!validate) {
        return
      }
      if (this.lengthContent) return

      const urls = this.files.map(({ url }) => url)
      const form = {
        ticket_id: this.claim.id,
        content: this.message,
        urls: urls || [],
      }

      this.isUploading = true
      const res = await this.reply(form)
      this.isUploading = false

      if (!res.success) {
        this.$toast.open({ type: 'error', message: res.message })
        return
      }

      this.$toast.open({ type: 'success', message: 'Trả lời thành công' })
      this.files = []
      this.message = ''
      this.fileErrors = []
      this.$emit('success', res.reply)
      this.handleClose()
    },

    countText(val) {
      var len = val.length
      if (len > 1000) {
        this.TicketNote = len
        this.lengthContent = true
        return 'note_danger'
      } else {
        this.TicketNote = len
        this.lengthContent = false
        return 'note_success'
      }
    },

    errorMaximum({ name }) {
      this.number = this.number - 1
      this.validateSize = true
      this.name = name
    },
  },
}
</script>
