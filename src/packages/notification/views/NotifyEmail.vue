<template>
  <div class="list-notify-emails pages">
    <div class="page-content">
      <div class="d-flex jc-sb mb-12">
        <p-input
          :placeholder="`Tìm theo tiêu đề/người gửi`"
          prefixIcon="search"
          type="search"
          :value="filter.search"
          @keyup.enter="handleSearch"
          class="mr-8"
        >
        </p-input>
        <p-button
          type="info"
          class="btn-create-noti"
          @click="showCreateNotifyModal"
        >
          <svgicon name="plus" class="text-white" />
          Tạo thông báo
        </p-button>
      </div>
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isFetching"></VclTable>
          <template v-else-if="notifies.length">
            <div class="table-responsive" style="overflow: unset">
              <table class="table table-hover table-notify-emails">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>người gửi</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(notify, i) in notifies" :key="i">
                    <td>
                      <b>{{ notify.title }}</b>
                    </td>
                    <td>{{ notify.title }}</td>
                    <td>{{ notify.created_at | date('dd/MM/yyyy') }}</td>
                    <td>{{ notify.title }}</td>
                    <td class="text-right">
                      <p-button type="info" class="btn-send">
                        Gửi
                      </p-button>
                      <p-button type="default" class="btn-detail">
                        Chi tiết
                      </p-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="d-flex justify-content-between align-items-center mb-16"
            >
              <p-pagination
                :total="count"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                :filter-limit="true"
                size="sm"
              ></p-pagination>
            </div>
          </template>
          <empty-search-result v-else></empty-search-result>
        </div>
      </div>
    </div>
    <modal-create-notify-email
      @save="handleSaveNotifyEmail"
      :visible.sync="visibleCreateNotiModal"
    >
    </modal-create-notify-email>
  </div>
</template>
<script>
import EmptySearchResult from '@components/shared/EmptySearchResult'
import ModalCreateNotifyEmail from '@/packages/notification/components/ModalCreateNotifyEmail'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { FETCH_LIST_NOTIFY_EMAIL, CREATE_NOTIFY_EMAIL } from '../store'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'NotifyEmail',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalCreateNotifyEmail,
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 5,
        search: '',
      },
      isFetching: false,
      isSubmitting: false,
      visibleCreateNotiModal: false,
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('notification', {
      notifies: (state) => state.notifyEmails,
      count: (state) => state.countNotifyEmails,
    }),
  },
  methods: {
    ...mapActions('notification', [
      FETCH_LIST_NOTIFY_EMAIL,
      CREATE_NOTIFY_EMAIL,
    ]),
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      const result = await this[FETCH_LIST_NOTIFY_EMAIL](this.filter)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      this.isFetching = false
    },
    async handleSaveNotifyEmail(payload) {
      this.isSubmitting = true
      const result = await this[CREATE_NOTIFY_EMAIL](payload)
      this.isSubmitting = false
      this.visibleCreateNotiModal = false
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
        })
        return
      }
      let msg = 'Lưu thông báo thành công'
      if (payload.is_send) {
        msg = 'Gửi thông báo thành công'
      }
      this.$toast.open({
        type: 'success',
        message: msg,
      })
      this.init()
    },
    showCreateNotifyModal() {
      this.visibleCreateNotiModal = true
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
