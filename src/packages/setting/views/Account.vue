<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="d-flex mb-16">
        <div class="search-input d-flex">
          <p-input
            placeholder="Tìm theo tên"
            prefixIcon="search"
            type="search"
            :clearable="true"
            :value.sync="filter.search"
            @keyup.enter="handleSearch"
          >
          </p-input>

          <select-role
            class="search-type ml-8"
            @selected="handleSearchRole"
            @unselected="handleRemoveSearch"
            :optionSearch="filterRole"
            :item="filter"
            :placeHolder="'Quyền'"
          />
        </div>
        <a href="#" class="btn btn-info ml-8" @click="visibleModalAddUser">
          <span><i class="fa fa-plus"></i>Thêm quản lý</span>
        </a>
      </div>
      <div class="card">
        <div class="card-body">
          <status-tab v-model="filter.status" :status="statusUser" />
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="users.length">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th width="200">Tên</th>
                    <th width="150">Email/SĐT</th>
                    <th width="200">Trạng thái</th>
                    <th width="100">Ngày tạo</th>
                    <th width="150">Thao tác</th>
                    <th width="100"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in users" :key="i">
                    <td>
                      <p-tooltip
                        :label="item.full_name"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.full_name.length > 25"
                      >
                        {{ truncate(item.full_name, 25) }}
                      </p-tooltip>
                    </td>
                    <td>
                      <p-tooltip
                        :label="item.email"
                        size="large"
                        position="top"
                        type="dark"
                        :active="item.email.length > 25"
                      >
                        {{ truncate(item.email, 25) || item.phone_number }}
                      </p-tooltip>
                    </td>
                    <td>
                      <span class="d-flex"
                        ><i
                          class="fa fa-circle"
                          :class="
                            checkActive(item.status) ? 'active' : 'deactive'
                          "
                        ></i
                        >{{
                          checkActive(item.status)
                            ? 'Kích hoạt'
                            : 'Không kích hoạt'
                        }}</span
                      >
                    </td>
                    <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                    <td>
                      <select-role
                        class="search-type"
                        @selected="actionUpdateRole"
                        :optionSearch="filterRole"
                        :item="item"
                        :placeHolder="'Phân quyền'"
                      />
                    </td>
                    <td style="text-align: center">
                      <a
                        href="#"
                        class="btn"
                        :class="checkActive(item.status) ? 'lock' : 'unlock'"
                        @click="actionUpdateStatus(item)"
                        >{{ checkActive(item.status) ? 'Khóa' : 'Mở' }}</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-confirm
      :visible.sync="isVisibleConfirmStatus"
      v-if="isVisibleConfirmStatus"
      :actionConfirm="actions.status.button"
      :description="actions.status.Description"
      :title="actions.status.title"
      :type="actions.status.type"
      @action="handleUpdateStatus(item)"
    >
    </modal-confirm>
    <modal-confirm
      :visible.sync="isVisibleConfirmRole"
      v-if="isVisibleConfirmRole"
      :actionConfirm="actions.role.button"
      :description="actions.role.Description"
      :title="actions.role.title"
      :type="actions.role.type"
      @action="handleUpdateRole(role, id)"
      @close="init"
    >
    </modal-confirm>
    <modal-add-user
      :visible.sync="isVisibleAddUser"
      v-if="isVisibleAddUser"
      @init="init"
    >
    </modal-add-user>
  </div>
</template>
<script>
import StatusTab from '../components/StatusTab.vue'
import SelectRole from '../components/SelectRole.vue'
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'

import {
  USER_STATUS_TAB,
  USER_STATUS_DEACTIVE,
  USER_STATUS_ACTIVE,
  ROLE,
} from '../constants'
import {
  LIST_USER,
  CREATE_USER,
  UPDATE_STATUS_USER,
  UPDATE_ROLE_USER,
} from '../store/index'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import ModalAddUser from '../components/ModalAddUser'

import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'Account',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    StatusTab,
    SelectRole,
    ModalConfirm,
    ModalAddUser,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
        role: '',
      },
      actions: {
        status: {
          title: 'Cập nhật trạng thái',
        },
        role: {
          title: 'Phân quyền',
        },
      },
      isVisibleConfirmStatus: false,
      isVisibleConfirmRole: false,
      isVisibleAddUser: false,
      isFetching: false,
      statusDeactive: USER_STATUS_DEACTIVE,
      statusActive: USER_STATUS_ACTIVE,
      filterRole: ROLE,
      statusUser: USER_STATUS_TAB,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState('setting', {
      users: (state) => state.users,
      count: (state) => state.count_user,
    }),
  },
  methods: {
    truncate,
    ...mapActions('setting', [
      LIST_USER,
      CREATE_USER,
      UPDATE_STATUS_USER,
      UPDATE_ROLE_USER,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this.listUser(this.filter)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      this.isFetching = false
    },

    checkActive(status) {
      return status == this.statusActive ? true : false
    },

    handleSearchRole(value) {
      this.filter.role = value
    },

    handleRemoveSearch() {
      this.filter.role = ''
    },
    actionUpdateStatus(item) {
      if (item.status == this.statusActive) {
        this.actions.status.button = 'Khóa'
        this.actions.status.Description =
          'Bạn có chắc chắn muốn khóa người dùng này?'
        this.actions.status.type = 'danger'
      } else {
        this.actions.status.button = 'Mở'
        this.actions.status.Description =
          'Bạn có chắc chắn muốn mở khóa người dùng này?'
        this.actions.status.type = 'success'
      }

      this.isVisibleConfirmStatus = true
      this.item = item
    },
    async handleUpdateStatus(item) {
      let payload = {
        id: item.id,
        status: item.status == this.statusActive ? 0 : 1,
      }

      const result = await this.updateStatusUser(payload)
      this.isVisibleConfirmStatus = false

      if (!result || result.error) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      await this.init()
      this.$toast.open({
        type: 'success',
        message: 'Cập nhật thành công',
        duration: 3000,
      })
    },

    actionUpdateRole(role, item) {
      this.roleName = this.filterRole.find((item) => item.key == role)
      this.actions.role.button = 'Phân quyền'
      this.actions.role.Description = `Bạn có chắc chắn muốn phân quyền <b>${this.roleName.name}</b> cho người dùng này?`

      this.isVisibleConfirmRole = true
      this.role = role
      this.id = item.id
    },

    async handleUpdateRole(role, id) {
      let payload = {
        id: id,
        role: role,
      }

      const result = await this.updateRoleUser(payload)
      this.isVisibleConfirmRole = false

      if (!result || result.error) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      await this.init()
      this.$toast.open({
        type: 'success',
        message: 'Cập nhật thành công',
        duration: 3000,
      })
    },

    visibleModalAddUser() {
      this.isVisibleAddUser = true
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
