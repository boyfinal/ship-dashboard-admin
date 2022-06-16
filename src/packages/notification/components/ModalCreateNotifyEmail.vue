<template>
  <p-modal :active="visible" :title="`Tạo thông báo`" @close="handleClose">
    <div class="row mb-16">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <label for=""><b>Tiêu đề</b></label>
          <i class="err-txt" v-if="titleErr">{{ titleErr }}</i>
        </div>
        <p-input
          :class="{ error: titleErr }"
          type="text"
          class="tilte_noti"
          @input="validateTilteNotify"
          placeholder="Nhập tiêu đề thông báo"
          v-model="title"
        ></p-input>
        <span class="count-title"
          >{{ title.length }}/{{ maxStrLengthTitle }}</span
        >
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <label for=""><b>Người nhận:</b></label>
        <div class="select-user-receiver justify-content-between">
          <div class="user-select-box">
            <p-input
              placeholder="Tìm kiếm"
              prefixIcon="search"
              type="search"
              @input="updateSearch"
              v-model="search"
            >
            </p-input>
            <div class="list-user-select">
              <VclTable class="mt-20" v-if="isLoading"></VclTable>
              <ul v-else>
                <li
                  :title="item.email"
                  :class="{ tick: checkedLeft.includes(item.id) }"
                  @click="setCheckedLeft(item)"
                  v-for="(item, i) in users"
                  :key="i"
                  >{{ item.email }}</li
                >
              </ul>
            </div>
          </div>
          <div class="action">
            <div class="icon-container">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="addSelectedUser"
              >
                <rect width="32" height="32" rx="4" fill="#EDEEEE" />
                <path
                  d="M18.4299 9.92999L24.4999 16L18.4299 22.07"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.5 16H24.33"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="removeSelectedUser"
              >
                <rect width="32" height="32" rx="4" fill="#EDEEEE" />
                <path
                  d="M13.57 9.92999L7.5 16L13.57 22.07"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24.4999 16H7.66992"
                  stroke="#AAABAB"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div class="user-select-box">
            <p-input
              placeholder="Tìm kiếm"
              prefixIcon="search"
              type="search"
              v-model="searchSelected"
              @input="searchSelectUser"
            >
            </p-input>
            <div class="list-user-select">
              <ul>
                <template v-if="searchSelected">
                  <li
                    :title="item.email"
                    :class="{ tick: checkedRight.includes(item.id) }"
                    @click="setCheckedRight(item)"
                    v-for="(item, i) in searchSelectedResult"
                    :key="i"
                    >{{ item.email }}</li
                  >
                </template>
                <template v-else>
                  <li
                    :title="item.email"
                    :class="{ tick: checkedRight.includes(item.id) }"
                    @click="setCheckedRight(item)"
                    v-for="(item, i) in selected"
                    :key="i"
                    >{{ item.email }}</li
                  >
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-16">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <label for=""><b>Nội dung:</b></label>
          <i class="err-txt" v-if="bodyErr">{{ bodyErr }}</i>
        </div>
        <quill-editor v-model="body" :options="editorOption" />
      </div>
    </div>
    <template slot="footer">
      <div></div>
      <div class="group-button modal-confirm">
        <p-button
          type="default"
          @click="handleSaveNoti"
          :disabled="disableAction"
          :loading="isLoading"
        >
          Lưu
        </p-button>
        <p-button
          type="info"
          :loading="isLoading"
          @click="handleSendNoti"
          :disabled="disableAction"
        >
          Gửi
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import PInput from '../../../../uikit/components/input/Input'
import api from '@/packages/shared/api'

import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'
import { NOTIFY_EMAIL_SENT } from '../constant'
export default {
  name: 'ModalCreateNotifyEmail',
  components: { PInput, quillEditor },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    showDetail: {
      type: Boolean,
      default: false,
    },
    notify: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    selectIDs() {
      return this.selected.map((i) => i.id)
    },
    disableAction() {
      return this.showDetail && this.notify.status === NOTIFY_EMAIL_SENT
    },
  },
  data() {
    return {
      maxStrLengthTitle: 50,
      titleErr: '',
      bodyErr: '',
      title: '',
      body: '',
      search: '',
      searchSelected: '',
      searchSelectedResult: [],
      isLoading: false,
      users: [],
      selected: [],
      checkedLeft: [],
      checkedRight: [],
      editorOption: {
        debug: 'false',
        placeholder: 'Nhập nội dung',
        theme: 'snow',
      },
    }
  },
  methods: {
    initialData() {
      return {
        maxStrLengthTitle: 50,
        titleErr: '',
        bodyErr: '',
        title: '',
        body: '',
        search: '',
        searchSelected: '',
        searchSelectedResult: [],
        isLoading: false,
        users: [],
        selected: [],
        checkedLeft: [],
        checkedRight: [],
        editorOption: {
          debug: 'false',
          placeholder: 'Nhập nội dung',
          theme: 'snow',
        },
      }
    },
    async init() {
      this.isLoading = true
      let payload = {
        search: this.search,
        not_limit: true,
        status: 1,
        role: 'customer',
      }
      let response = await api.fetchUsersByRole(payload)
      this.isLoading = false
      if (response && response.errorMessage) {
        this.users = []
        return
      }
      if (this.showDetail) {
        const selectedIDs = this.notify.receiver_ids
        this.selected = response.users.filter((i) => {
          return selectedIDs.indexOf(i.id) > -1
        })
        this.users = response.users.filter((i) => {
          return selectedIDs.indexOf(i.id) < 0
        })
        return
      }
      this.users = response.users
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    validateTilteNotify(e) {
      if (e.length > this.maxStrLengthTitle) {
        this.titleErr = `Tiêu đề không vượt quá ${this.maxStrLengthTitle} ký tự`
        this.title = e.slice(0, -1)
      }
    },
    validateContent() {
      if (this.title == '') {
        this.titleErr = 'Tiêu đề không được để trống'
      } else {
        this.titleErr = ''
      }
      if (this.body == '') {
        this.bodyErr = 'Nội dung không được để trống'
        document.getElementsByClassName('ql-toolbar')[0].classList.add('error')
        document
          .getElementsByClassName('ql-container')[0]
          .classList.add('error')
      } else {
        this.bodyErr = ''
        document
          .getElementsByClassName('ql-toolbar')[0]
          .classList.remove('error')
        document
          .getElementsByClassName('ql-container')[0]
          .classList.remove('error')
      }
      return this.bodyErr === '' && this.titleErr === ''
    },
    handleSaveNoti() {
      if (!this.validateContent()) {
        return
      }
      let payload = {
        id: this.notify ? this.notify.id : 0,
        ids: this.selectIDs,
        title: this.title,
        body: this.body,
        is_send: false,
      }
      this.$emit('save', payload)
    },
    handleSendNoti() {
      if (!this.validateContent()) {
        return
      }
      let payload = {
        id: this.notify ? this.notify.id : 0,
        ids: this.selectIDs,
        title: this.title,
        body: this.body,
        is_send: true,
      }
      this.$emit('save', payload)
    },
    setCheckedLeft(item) {
      const index = this.checkedLeft.indexOf(item.id)
      if (index > -1) {
        this.checkedLeft.splice(index, 1)
      } else {
        this.checkedLeft.push(item.id)
      }
    },
    setCheckedRight(item) {
      const index = this.checkedRight.indexOf(item.id)
      if (index > -1) {
        this.checkedRight.splice(index, 1)
      } else {
        this.checkedRight.push(item.id)
      }
    },
    async updateSearch(search) {
      this.isLoading = true
      const result = await api.fetchUsersByRole({
        search: search.trim(),
        status: 1,
        role: 'customer',
      })
      this.isLoading = false

      if (result && result.errorMessage) {
        this.users = []
        return
      }
      this.users = result.users.filter((i) => {
        return !this.selectIDs.includes(i.id)
      })
    },
    addSelectedUser() {
      let checked = []
      this.users = this.users.filter((i) => {
        if (this.checkedLeft.includes(i.id) && this.selected.indexOf(i) < 0) {
          checked.push(i)
          return false
        }
        return true
      })
      this.selected = [...this.selected, ...checked]
    },
    removeSelectedUser() {
      let checked = []
      this.selected = this.selected.filter((i) => {
        if (this.checkedRight.includes(i.id) && this.users.indexOf(i) < 0) {
          checked.push(i)
          return false
        }
        return true
      })
      this.users = [...this.users, ...checked]
    },
    searchSelectUser(search) {
      let reg = new RegExp(search, 'i')
      this.searchSelectedResult = this.selected.filter((item) =>
        reg.test(item.email)
      )
    },
  },
  watch: {
    visible: {
      handler: function(v) {
        if (v) {
          Object.assign(this.$data, this.initialData())
          if (this.showDetail) {
            this.title = this.notify.title
            this.body = this.notify.body
          }
          this.init()
        }
      },
    },
  },
}
</script>
<style>
.p-modal-content label {
  margin-bottom: 0.4rem;
}
.action {
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action svg {
  cursor: pointer;
  display: block;
  margin: 8px 0px;
}
.user-select-box {
  border: 1px solid #cfd0d0;
  border-radius: 8px;
  padding: 0 8px 8px 8px;
}
.user-select-box .input-group {
  margin-bottom: 2px;
}
.user-select-box .p-input-group .p-input-search {
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
  border-radius: unset !important;
}
.user-select-box .form-icons .form-control-icon {
  left: 10px;
}
.user-select-box .form-icons .form-control-icon-left + .form-control {
  padding-left: 32px;
}
.body-input {
  font-weight: 400;
  font-size: 14px !important;
  line-height: 20px;
  padding: 10px 16px !important;
}
.list-user-select {
  width: 241px;
  height: 164px;
  overflow-y: auto;
}
.list-user-select li {
  padding: 0 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  color: #313232;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.list-user-select li:hover,
.list-user-select li.tick {
  background-color: #edeeee;
}
.select-user-receiver {
  display: flex;
}

.list-user-select::-webkit-scrollbar-track {
  width: 4px;
  background: #fff;
}
.list-user-select::-webkit-scrollbar,
.list-user-select::-webkit-scrollbar-thumb {
  width: 4px;
  height: 80px;
  background: #e1e2e2;
  border-radius: 8px;
  cursor: pointer;
}
</style>
