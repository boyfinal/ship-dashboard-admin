<template>
  <div class="modal__add-claim">
    <p-modal :active="visible" @close="handleClose" :title="`Khiếu nại`">
      <template>
        <div class="row mb-20">
          <div class="col-6">
            <label class="modal__add-claim-label"
              >Mã vận đơn: <span>*</span></label
            >
            <input
              type="text"
              class="form-control"
              placeholder="Nhập mã vận đơn"
              v-validate="'required'"
              name="code"
              v-model="code"
              data-vv-as="Mã vận đơn"
              :class="{ 'error-color': errors.has('code') }"
            />
            <span class="err-span" v-if="errors.has('code')">{{
              errors.first('code')
            }}</span>
          </div>
          <div class="col-6">
            <label class="modal__add-claim-label">Lý do:<span>*</span></label>
            <multiselect
              class="multiselect-custom dropdown-reason"
              v-model="reason"
              :options="reasons"
              placeholder="Chọn một lý do"
              @select="handleSelect"
              :custom-label="customLabel"
              v-validate="'required'"
              :class="{ required: requiredReason }"
              name="reason"
              data-vv-as="Lý do "
            ></multiselect>
            <div v-if="requiredReason" class="err-span">
              Hãy chọn một lý do
            </div>
            <span class="err-span" v-if="errors.has('reason')">{{
              errors.first('reason')
            }}</span>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-12">
            <label class="modal__add-claim-label"
              >Tiêu đề: <span>*</span></label
            >
            <input
              type="text"
              class="form-control"
              placeholder="Nhập tiêu đề"
              v-validate="'required|max:200'"
              name="title"
              maxlength="201"
              v-model="title"
              data-vv-as="Tiêu đề"
              :class="{ 'error-color': errors.has('title') }"
            />
            <span class="err-span" v-if="errors.has('title')">{{
              errors.first('title')
            }}</span>
          </div>
        </div>
        <div class="row mb-20">
          <div class="col-12 text__aria">
            <div
              class="text__aria-title d-flex justify-content-between align-items-center"
            >
              <label class="modal__add-claim-label">Nội dung:</label>
              <span class="countText" :class="[countText(content)]"
                >{{ this.TicketNote }}/1000</span
              >
            </div>
            <textarea
              placeholder="Nhập nội dung "
              class="text__aria-content"
              v-model="content"
              v-validate="'max:1000'"
              name="content"
              maxlength="1000"
              data-vv-as="Nội dung"
              :class="{
                'error-color': errors.has('content'),
                require: lengthContent,
              }"
              @keyup="countText(content)"
            ></textarea>
            <span class="err-span" v-if="errors.has('content')">{{
              errors.first('content')
            }}</span>
          </div>
        </div>
        <div class="row mb-20">
          <div class="modal__add-claim-upload col-12">
            <upload
              class="file-uploader"
              :action="uploadFileEndpoint"
              drag
              list-type="picture"
              :headers="uploadHeaders"
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
          </div>
        </div>
        <div class="row mb-20">
          <div v-if="errMessage.length > 0" class="ticket__error">
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
                v-for="(item, i) in errMessage"
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
                {{ this.name }} dung lượng đang lớn hơn 5Mb.Vui lòng chọn tệp
                nhỏ hơn.</li
              >
            </ul>
          </div>

          <div class="col-12" v-if="files != null">
            <div
              class="el-before-upload__filename d-flex  justify-content-between"
              v-for="(item, i) in files"
              :key="i"
            >
              <div style="margin-top: 5px" class="filename">{{
                item.name
              }}</div>
              <div :class="{ isUpload: isUploading }" class="remove-file">
                <img
                  src="~@/assets/img/x-sm.svg"
                  alt="remove"
                  class="icon-remove"
                  @click.prevent="actionDeletefile(item.url)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-20">
          <div class="rule col-md-12">
            Định dạng file hợp lệ : XLSX, PNG, JPG, JPEG.Và có dung lượng dưới
            5Mb
          </div>
        </div>
      </template>
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
            <p-button
              type="primary"
              @click="handleSave"
              :disabled="isDisable"
              :loading="isUploading"
            >
              Tạo khiếu nại
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
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
  </div>
</template>
<script>
import mixinUpload from '../../../core/mixins/upload'
import { Upload } from '@kit/index'
import { mapActions } from 'vuex'
import { UPLOAD_FILE_CLAIM, CREATE_CLAIM } from '../store'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
const MAXIMUM_SIZE = 5
import evenBus from '../../../core/utils/evenBus'

export default {
  name: 'ModalAddClaim',
  mixins: [mixinUpload],
  components: { Upload, ModalConfirm },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      maximumSize: MAXIMUM_SIZE * 2 ** 20,
      content: '',
      isVisibleConfirmDelete: false,
      reason: null,
      isUploading: false,
      lengthContent: false,
      actions: {
        delete: {
          title: 'Xóa tệp tin',
          button: 'Xóa',
          Description: `Bạn có chắc chắn muốn xóa tệp tin này`,
          type: 'danger',
        },
      },
      reasons: [
        {
          key: 1,
          name: 'Sửa đơn',
        },
        {
          key: 2,
          name: 'Phí hóa đơn',
        },
        {
          key: 3,
          name: ' Không cập nhật trạng thái ',
        },
        {
          key: 4,
          name: 'Khác',
        },
      ],
      requiredReason: false,
      selectReason: false,
      requiredContent: false,
      title: '',
      TicketNote: 0,
      code: '',
      files: [],
      allowedTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      allowedExtensions: /(\.jpg|\.jpeg|\.png|\.xlsx|\.xls)$/i,
      errMessage: [],
      url: [],
      validateSize: false,
      name: '',
      isDisable: false,
      number: 0,
    }
  },
  created() {
    evenBus.$on('my', this.handleF)
  },
  destroyed() {
    evenBus.$on('my', this.handleF)
  },
  methods: {
    ...mapActions('claim', [UPLOAD_FILE_CLAIM, CREATE_CLAIM]),
    handleF(e) {
      this.number += e
    },
    handleClose() {
      this.number = 0
      this.code = ''
      this.title = ''
      this.content = ''
      this.files = []
      this.reason = null
      this.isUploading = false
      ;(this.validateSize = false), (this.errMessage = [])
      this.$validator.pause()
      this.$nextTick(() => {
        this.$validator.errors.clear()
        this.$validator.fields.items.forEach((field) => field.reset())
        this.$validator.fields.items.forEach((field) =>
          this.errors.remove(field)
        )
        this.$validator.resume()
      })
      this.$emit('update:visible', false)
    },
    customLabel(reasons) {
      return reasons.name || this.formatReason(this.reason)
    },
    handleSelect(value) {
      this.reason = value
      this.requiredReason = false
      this.selectReason = true
    },
    actionDeletefile(file) {
      this.isVisibleConfirmDelete = true
      this.deleteFile = file
    },
    handleDeletefile(file) {
      this.isVisibleConfirmDelete = false
      this.files = this.files.filter((x) => x.url !== file)
      this.number = this.number - 1
    },
    handleChangeFile(file) {
      let filename = file.name
      this.validateSize = false
      const index = this.files.findIndex(({ uid }) => uid === file.uid)
      if (index != -1) {
        this.$set(this.files, index, file)
      }
      if (!this.validateTypeFile(file)) {
        this.number = this.number - 1
        this.errMessage.push(
          ` "${filename}" định dạng không đúng.Tệp phải có định dạng:  *XLSX, *PNG, *JPG, *JPEG.`
        )
        this.errMessage = [...new Set(this.errMessage)]
        return
      }
      this.handleUploadfile(file)
      this.isUploading = true
    },

    async handleUploadfile(file) {
      let params = {
        file: file.raw,
      }
      await this[UPLOAD_FILE_CLAIM](params).then((data) => {
        if (data.error) {
          this.isUploading = false
          this.errMessage.push(data.message)
          return
        }
        this.files.push({
          url: data.urls,
          uid: file.uid,
          name: file.name,
        })
        if (this.files.length == this.number) {
          this.isUploading = false
        }
      })
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
    errorMaximum({ name }) {
      this.number = this.number - 1
      this.validateSize = true
      this.name = name
    },
    async handleSave() {
      const validate2 = this.$validator.validate('reason', this.reason)
      const validate = await this.$validator.validateAll()
      if (!validate || !validate2) {
        return
      }
      this.isDisable = true
      this.urls = this.files.map((item) => item.url)
      let params = {
        reason: this.selectReason ? this.reason.key : 5,
        title: this.title.trim(),
        content: this.content,
        files: this.urls,
        code: this.code.trim(),
      }
      let result = await this[CREATE_CLAIM](params)
      if (result.error) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        this.isDisable = false
        return
      }
      this.$toast.open({
        type: 'success',
        message: 'Tạo thành công',
        duration: 3000,
      })
      this.isDisable = false
      this.handleClose()
      this.$emit('create', true)
    },
    countText(val) {
      var len = val.length
      if (len > 1000) {
        this.TicketNote = len
        return 'note_danger'
      } else {
        this.TicketNote = len
        return 'note_success'
      }
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
  },
}
</script>
