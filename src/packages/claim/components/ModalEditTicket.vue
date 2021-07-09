<template>
  <p-modal :active="visible" title="Edit Claim" @close="handleClose">
    <template>
      <div class="modal-edit-ticket">
        <div class="content-page">
          <div class="page-content">
            <div class="menu_content ">
              <div class="page-content_drag card2">
                <div style="margin-top: 1px; margin-bottom: 24px">
                  <div class="order_id">
                    <label>Order ID <span>*</span></label>
                    <p-input
                      type="OrderId"
                      v-model="orderID"
                      placeholder="Enter OrderID"
                      :input="orderID"
                      :required="requiredOrder"
                    />
                  </div>
                </div>
                <div>
                  <label class="drag-design_name">Reason <span>*</span></label>
                  <multiselect
                    class="multiselect-custom dropdown-reason"
                    v-model="reason"
                    :options="reasons"
                    placeholder="Choose one of the following reasons:"
                    @select="handleSelect"
                    :class="{ required: requiredReason }"
                    :custom-label="customLabel"
                  ></multiselect>
                  <div v-if="requiredReason" class="err-content">
                    This field is required
                  </div>
                </div>

                <div style="margin-top: 24px;">
                  <label>Title <span>*</span></label>
                  <p-input
                    type="text"
                    v-model="title"
                    placeholder="Enter Title"
                    :input="title"
                    :required="requiredTitle"
                  />
                  <div v-if="validTitle" class="err-content">
                    Only 100 characters are allowed. Please fill in again
                  </div>
                </div>
                <div style="margin-top: 24px">
                  <label>Content <span>*</span></label>
                  <textarea
                    placeholder="Enter content "
                    class="content"
                    v-model="content"
                    :class="{
                      required: requiredContent,
                      require: lengthContent,
                    }"
                    @input="adjustIconsInTextarea"
                    @keyup="countText(content)"
                  ></textarea>
                  <div v-if="requiredContent" class="err-content">
                    This field is required
                  </div>
                  <span class="countText" :class="[countText(content)]"
                    >{{ this.TicketNote }}/1000</span
                  >
                </div>
                <div class="upload_file">
                  <upload
                    class="file-uploader"
                    :action="uploadFileEndpoint"
                    drag
                    list-type="picture"
                    :headers="uploadHeaders"
                    :on-change="handleChangeFile"
                    multiple
                    :auto-upload="false"
                    :max-file-size="100000000"
                  >
                    <div class="el-upload__text">
                      Drop files to upload, or <em>browser</em>
                    </div>
                  </upload>

                  <div v-if="errMessage.length > 0" class="design-error-lg">
                    <div class="design-error-title">
                      <img
                        src="~@/assets/img/alert.svg"
                        alt=""
                        class="design-error-icon"
                      />
                      <span>This media couldn’t be added:</span>
                    </div>
                    <ul
                      v-for="(item, i) in errMessage"
                      :key="i"
                      class="design-error-list"
                    >
                      <li class="design-error-item"> {{ item }}</li>
                    </ul>
                  </div>
                  <div v-if="files != null">
                    <div
                      class="el-before-upload__filename d-flex  justify-content-between"
                      v-for="(item, i) in files"
                      :key="i"
                    >
                      <div style="margin-top: 5px" class="filename">{{
                        item.name
                      }}</div>
                      <div
                        :class="{ isUpload: isUploading }"
                        class="remove-file"
                      >
                        <img
                          src="~@/assets/img/x-sm.svg"
                          alt=""
                          class="icon-remove"
                          @click.prevent="actionDeletefile(item.url)"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="rule">
                    Định dạng file hợp lệ : XLSX, PNG, JPG, JPEG.Và có dung
                    lượng dưới 5Mb.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="page-footer footer">
        <div v-if="claim.status == 1" class="group-button">
          <button @click="handleClose" class="close_claim">
            Cancel
          </button>
          <p-button
            @click="handleUpdate"
            class="save_claim"
            :loading="isUploading"
          >
            Save
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
    <modal-confirm
      :visible.sync="isVisibleCancelClaim"
      v-if="isVisibleCancelClaim"
      :actionConfirm="actions.cancel.button"
      :description="actions.cancel.Description"
      :title="actions.cancel.title"
      :type="actions.cancel.type"
      @action="handleCancelClaim"
    >
    </modal-confirm>
  </p-modal>
</template>

<script>
import mixinUpload from '@core/mixins/upload'
import { Upload } from '@kit/index'
// import Thumbnail from '@components/shared/Thumbnail'
import ModalConfirm from '@components/shared/modal/ModalConfirm'

/*eslint-disable*/
import { mapActions, mapState } from 'vuex'

import {
  UPDATE_TICKET,
  UPDATE_FILE_TICKET,
  CANCEL_TICKET,
} from '@/packages/claim/store'
import { FETCH_TICKET } from '@/packages/claim/store'
import evenBus from '../../../core/utils/evenBus'

export default {
  name: 'ModalEditTicket',
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
      actions: {
        delete: {
          title: 'Remove files',
          button: 'Delete',
          Description: `Are you sure you want to remove this attach file?`,
          type: 'danger',
          link:
            '<a href="https://lionnix.com/FAQ" target="_blank">Learn more</a>',
        },
        confirm: {
          title: 'Confirm Payment',
          button: 'Confirm',
          Description: `Are you sure confirm payment?`,
          type: 'danger',
        },
        cancel: {
          title: 'Cancel Claim',
          button: 'Confirm',
          Description: `Are you sure cancel Claim?`,
          type: 'danger',
        },
      },
      reasons: [
        {
          key: 1,
          name: 'Order Modification',
        },
        {
          key: 2,
          name: 'Order Cancel',
        },
        {
          key: 3,
          name: 'Production time & tracking issues',
        },
        {
          key: 4,
          name: ' Labelling',
        },
        {
          key: 5,
          name: 'Post-delivery problem (wrong product, quality issues,...)',
        },
        {
          key: 6,
          name: 'Others',
        },
      ],
      prefered: [
        {
          key: 1,
          name: 'Resent',
        },
        {
          key: 2,
          name: 'Refund',
        },
      ],

      content: '',
      reply: '',
      reason: null,
      allowedTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      allowedExtensions: /(\.jpg|\.jpeg|\.png|\.xlsx|\.xls)$/i,
      errMessage: [],
      files: [],
      isUploading: false,
      requiredTitle: false,
      requiredContent: false,
      title: '',
      urls: [],
      requiredReason: false,
      selectReason: false,
      solution: null,
      isVisibleConfirmDelete: false,
      deleteFile: null,
      orderID: null,
      validTitle: false,
      requiredOrder: false,
      TicketNote: 0,
      lengthContent: false,
      number: 0,
    }
  },
  destroyed() {
    evenBus.$on('my', this.handleF)
  },
  computed: {
    ...mapState('claim', {
      claim: (state) => state.ticket,
      count: (state) => state.count,
    }),
  },
  created() {
    evenBus.$on('my', this.handleF)
    this.init()
  },
  mounted() {
    this.orderID = this.claim.object_id
  },
  methods: {
    ...mapActions('claim', [
      FETCH_TICKET,
      UPDATE_FILE_TICKET,
      UPDATE_TICKET,
      CANCEL_TICKET,
    ]),
    handleF(e) {
      this.number += e
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleAction() {
      this.$emit('action')
    },
    customLabel(reasons) {
      return reasons.name || this.formatReason(this.reason)
    },
    customLabelSolution(prefered) {
      return prefered.name || this.formatSolution(this.solution)
    },
    handleSelect(value) {
      this.reason = value
      this.requiredReason = false
      this.selectReason = true
    },
    handleSelectPrefered(value) {
      this.solution = value
      this.requiredSolution = false
    },

    handleChangeFile(file) {
      let filename = file.name
      const index = this.files.findIndex(({ uid }) => uid === file.uid)
      if (index != -1) {
        this.$set(this.files, index, file)
      }

      if (!this.validateSizeFile(file)) {
        this.number = this.number - 1
        this.errMessage.push(
          ` "${filename}" dung lượng đang lớn hơn 5Mb.Vui lòng chọn tệp nhỏ hơn`
        )
        this.errMessage = [...new Set(this.errMessage)]
        return
      }

      this.handleUploadfile(file)
      this.isUploading = true
    },

    checkRequired() {
      let result = true
      if (this.title == '') {
        this.requiredTitle = true
        this.validTitle = false
        result = false
      } else if (this.title.length > 100) {
        this.validTitle = true
        this.requiredTitle = false
        result = false
      } else {
        this.requiredTitle = false
      }

      if (this.content == '') {
        this.requiredContent = true
        result = false
      } else {
        this.requiredContent = false
      }
      if (this.lengthContent) {
        result = false
      }
      if (!this.reason) {
        this.requiredReason = true
        result = false
        return result
      } else {
        this.requiredReason = false
      }
      if (this.reason == null) {
        this.requiredReason = true
        result = false
      } else {
        this.requiredReason = false
      }
      if (this.orderNumber == '') {
        this.requiredOrder = true
        result = false
      } else {
        this.requiredOrder = false
      }

      return result
    },
    validateTypeFile(file) {
      if (this.allowedExtensions.exec(file.name)) {
        return true
      }

      if (this.allowedTypes.includes(file.raw.type)) {
        return true
      } else {
        return false
      }
    },
    validateSizeFile(file) {
      if (file.size > 5000000) {
        return false
      } else {
        return true
      }
    },
    handleDeletefile(file) {
      this.number = this.number - 1
      this.isVisibleConfirmDelete = false
      this.files = this.files.filter((x) => x.url !== file)
    },
    actionDeletefile(file) {
      this.isVisibleConfirmDelete = true
      this.deleteFile = file
    },
    async init() {
      const { id } = this.$route.params
      await this[FETCH_TICKET](id)
      this.reason = this.claim.category
      this.orderNumber = this.claim.order_number
      this.title = this.claim.subject
      this.content = this.claim.content
      this.solution = this.claim.solution
      this.reply = this.claim.reply
      // this.files = this.claim.attach_files
      if (this.claim.attach_files != null) {
        this.claim.attach_files.forEach((x) =>
          this.files.push({ name: x.split('/')[1], url: x })
        )
      }
    },

    async handleUpdate() {
      this.urls = this.files.map((item) => item.url)
      if (!this.checkRequired()) {
        return
      }
      let params = {
        reason: this.selectReason ? this.reason.key : this.claim.category,
        title: this.title,
        content: this.content,
        files: this.urls,
        id: parseInt(this.orderID),
        solution: this.solution ? this.solution.key : 0,
      }
      let payload = {
        id: this.claim.id,
        tickets: params,
      }
      const result = await this[UPDATE_TICKET](payload)
      if (result.error) {
        this.$toast.open({ type: 'error', message: result.message || '' })
        return
      }
      // this.content = ''
      // this.reason = null
      // this.title = ''
      // this.files = []
      // ;(this.solution = null), (this.object_id = '')

      this.$toast.open({
        type: 'success',
        message: `Update Claim Successfull`,
      })
      this.$emit('success', true)
      this.errMessage = []
    },
    adjustIconsInTextarea() {
      this.requiredContent = false
    },

    async handleUploadfile(file) {
      let params = {
        file: file.raw,
      }

      const result = await this[UPDATE_FILE_TICKET](params)
      if (result.error) {
        this.isUploading = false
        this.errMessage.push(result.message)
        return
      }
      this.files.push({
        url: result.urls,
        uid: file.uid,
        name: file.name,
      })
      if (this.files.length == this.number) {
        this.isUploading = false
      }
    },
    async handleCancelClaim() {
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
        message: ' Successfully',
      })
      this.files = []
      this.init()
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
    formatReason(reason) {
      switch (reason) {
        case 1:
          return 'Order Modification'
        case 2:
          return 'Order Cancel'
        case 3:
          return 'Production time & tracking issues'
        case 4:
          return 'Labelling'
        case 5:
          return 'Post-delivery problem (wrong product, quality issues,...)'

        case 6:
          return 'Others'
      }
    },
    formatStatus(status) {
      switch (status) {
        case 1:
          return 'pending'
        case 2:
          return 'in-review'
        case 3:
          return 'resent'
        case 4:
          return 'refunded'
        case 5:
          return 'rejected'
        case 6:
          return 'canceled'
      }
    },
    formatSolution(solution) {
      switch (solution) {
        case 1:
          return 'Resent'
        case 2:
          return 'Refunded'
      }
    },
  },
  watch: {},
}
</script>
<style lang="scss">
.content {
  &.require {
    border: 1px solid red !important;
  }
}
.countText {
  &.note_danger {
    color: red;
  }
}
</style>
