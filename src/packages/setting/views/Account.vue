<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="row mb-12 search-input">
        <div class="col-9 pl-0">
          <p-input
            placeholder="Tìm kiếm ..."
            suffixIcon="search"
            type="search"
            :clearable="true"
            :value.sync="filter.search"
            @keyup.enter="handleSearch"
          >
          </p-input>
        </div>
        <div class="col-3">
          <p-select placeholder="Please select" v-model="filter.role">
            <option :value="key" v-for="(value, key) in filterRole" :key="key">
              {{ value }}
            </option>
          </p-select>
        </div>
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
                    <th>Tên</th>
                    <th>Email/SĐT</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in users" :key="i">
                    <td>
                      {{ item.full_name }}
                    </td>
                    <td>{{ item.email || item.phone_number }}</td>
                    <td>
                      <span
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
                      a
                    </td>
                    <td>a</td>
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
  </div>
</template>
<script>
import StatusTab from '../components/StatusTab.vue'
import { mapState, mapActions } from 'vuex'

import {
  USER_STATUS_TAB,
  USER_STATUS_DEACTIVE,
  USER_STATUS_ACTIVE,
} from '../constants'
import {
  LIST_USER,
  CREATE_USER,
  UPDATE_STATUS_USER,
  UPDATE_ROLE_USER,
} from '../store/index'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'

export default {
  name: 'Account',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    StatusTab,
  },
  data() {
    return {
      filter: {
        limit: 30,
        status: '',
        search: '',
      },
      isFetching: false,
      filterRole: {
        admin: 'Admin',
        accountant: 'Kế toán',
        warehouse: 'Kho',
        support: 'Support',
      },
      statusDeactive: USER_STATUS_DEACTIVE,
      statusActive: USER_STATUS_ACTIVE,
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
    statusUser() {
      return USER_STATUS_TAB
    },
  },
  methods: {
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
