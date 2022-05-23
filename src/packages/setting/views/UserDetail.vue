<template>
  <div class="setting user-detail pages">
    <div class="page-content">
      <div class="user-info mb-24 row">
        <div class="col-4">
          <div class="card">
            <div class="d-flex">
              <div class="left">
                <p>Mã khách hàng:</p>
                <p>Họ và tên:</p>
                <p>Email:</p>
                <p>Số điện thoại:</p>
                <p>Loại tài khoản:</p>
                <p>MST:</p>
              </div>
              <div class="right">
                <p>U{{ user.id }}</p>
                <p>{{ user.full_name }}</p>
                <p>{{ user.email }}</p>
                <p>{{ user.phone_number }}</p>
                <p>{{ types[user.class] }}</p>
                <p>MST</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="d-flex">
              <div class="left">
                <p>Số dư:</p>
                <p>Tiền chờ xử lý:</p>
                <p>Kiểu thanh toán:</p>
                <p>Công nợ:</p>
                <p>Công nợ cho phép:</p>
                <p>Thời gian cho phép:</p>
              </div>
              <div class="right">
                <p>{{ (user.balance > 0 ? user.balance : 0) | formatPrice }}</p>
                <p>U0001</p>
                <p>{{
                  user.user_info && user.user_info.debt_max_amount > 0
                    ? 'Trả sau'
                    : 'Trả trước'
                }}</p>
                <p>{{
                  (user.balance > 0 ? 0 : Math.abs(user.balance)) | formatPrice
                }}</p>
                <p>{{
                  (user.user_info ? user.user_info.debt_max_amount : 0)
                    | formatPrice
                }}</p>
                <p>{{
                  user.user_info && user.user_info.debt_max_day > 0
                    ? `${user.user_info.debt_max_day} ngày`
                    : '-'
                }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="d-flex">
              <div class="left">
                <p>Kích thước hàng:</p>
                <p>Loại hàng:</p>
                <p>Email:</p>
                <p>Quy mô:</p>
                <p>Địa chỉ kho:</p>
              </div>
              <div class="right">
                <p>U0001</p>
                <p>U0001</p>
                <p>U0001</p>
                <p>U0001</p>
                <p>U0001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body"> </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { truncate } from '@core/utils/string'
// import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import {
  CUSTOMER_STATUS_TAB,
  OPTIONS_PACKAGES,
  MAP_USER_CLASS_TEXT,
} from '../constants'
import api from '@/packages/shared/api'
import { GET_USER } from '../../../packages/shared/store'

export default {
  name: 'UserDetail',
  mixins: [mixinRoute, mixinTable],
  components: {
    // EmptySearchResult,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 2,
      },
      isFetching: false,
      statusUser: CUSTOMER_STATUS_TAB,
      userID: 0,
      user: {},
    }
  },
  created() {
    this.userID = parseInt(this.$route.params.id, 10)
    this.init()
  },
  computed: {
    ...mapState('shared', {
      user: (state) => state.user,
    }),
    mapPackage() {
      return OPTIONS_PACKAGES
    },
    types() {
      return MAP_USER_CLASS_TEXT
    },
  },
  methods: {
    truncate,
    ...mapActions('shared', [GET_USER]),

    async init() {
      this.isFetching = true

      let response = await api.fetchUsersByRole(
        Object.assign({}, { user_id: this.userID, role: 'customer' })
      )
      if (response && response.errorMessage) {
        this.$toast.error(response.errorMessage)
        this.users = []
        return
      }

      this.user = response.users[0]
      this.isFetching = false
    },
  },
  watch: {
    'filter.page': {
      handler: function () {
        this.init()
      },
      deep: true,
    },
    'filter.status': {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
