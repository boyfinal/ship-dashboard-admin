<template>
  <div class="pages promotion setting-account">
    <div class="search-input">
      <search-promotion
        id="search"
        class="user-resource is-fullwidth mb-2"
        :filter="filter"
        :label="`Tìm kiếm promotion`"
        v-model="filter.search"
        @input="init"
      />
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <vcl-table class="md-20" v-if="isFetching"></vcl-table>
          <template v-else-if="listPromotions.length > 0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="list__product-title">
                    <th>PROMOTION</th>
                    <th>NGÀY TẠO</th>
                    <th>TRẠNG THÁI</th>
                    <th class="text-right">THAO TÁC</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, i) in listPromotions" :key="i">
                    <td>{{ item.name }}</td>
                    <td>
                      {{ item.created_at | date('dd/MM/yyyy') }}
                    </td>
                    <td :class="format(item.status)">{{
                      format(item.status)
                    }}</td>
                    <td class="text-right">
                      <p-button
                        class="btn btn-info"
                        :disabled="!item.description"
                        @click="showModalDescriptionHandle(item)"
                        >Nội dung</p-button
                      >
                      <p-button
                        :type="typeBtn(item.status)"
                        class="btn-detail ml-8"
                        @click="visibleModal(item)"
                      >
                        {{ textBtn(item.status) }}
                      </p-button>
                      <a
                        href="#"
                        class="btn edit ml-8"
                        :class="{ deactive: item.status != 1 }"
                        @click="loadDetailPromotion(item)"
                      >
                        Sửa
                      </a></td
                    >
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <EmptySearchResult v-else></EmptySearchResult>
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center mb-80 paginate"
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
    <modal-confirm
      :visible.sync="visibleConfirm"
      :actionConfirm="`Xác nhận`"
      :cancel="`Bỏ qua`"
      :description="description"
      :title="title"
      :type="type"
      @action="updateStatusPromotion(item)"
    ></modal-confirm>
    <modal-append-promotion
      :visible.sync="visibleModalAppend"
      :data="item"
      :tester="tester"
      @save="handleAppendPromotion"
    >
    </modal-append-promotion>
    <modal-description
      :visible.sync="isVisibleModalDescription"
      :current="item"
    ></modal-description>
  </div>
</template>
<script>
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { mapActions, mapState } from 'vuex'
import {
  FETCH_PROMOTIONS,
  UPDATE_PROMOTION,
  APPEND_USER_TO_PROMOTION,
} from '../store/index'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import ModalAppendPromotion from '../components/ModalAppendPromotion.vue'
import SearchPromotion from '../components/SearchPromotion.vue'
import ModalDescription from '../components/ModalDescription.vue'

export default {
  name: 'ListPromotion',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalConfirm,
    ModalAppendPromotion,
    SearchPromotion,
    ModalDescription,
  },
  data() {
    return {
      filter: {
        limit: 30,
        search: '',
        status: 1,
      },
      isFetching: false,
      product: {},
      visibleConfirm: false,
      visibleModalAppend: false,
      isVisibleModalDescription: false,
      description: '',
      title: '',
      type: '',
      item: {},
      tester: this.$route.query.tester ? parseInt(this.$route.query.tester) : 0,
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState('promotion', {
      count: (state) => state.count,
      listPromotions: (state) => state.promotions,
    }),
  },
  methods: {
    ...mapActions('promotion', [
      FETCH_PROMOTIONS,
      UPDATE_PROMOTION,
      APPEND_USER_TO_PROMOTION,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this.fetchPromotions(this.filter)
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.isFetching = false
    },
    visibleModal(item) {
      this.item = item
      if (item.status == 1) {
        this.description = 'Xác nhận disable promotion?'
        this.type = 'danger'
        this.title = 'Disable promotion'
        this.visibleConfirm = true
        return
      }
      this.description = 'Xác nhận active promotion?'
      this.type = 'info'
      this.title = 'Active promotion'
      this.visibleConfirm = true
    },
    async updateStatusPromotion(item) {
      let payload = {
        id: item.id,
        status: item.status == 1 ? 2 : 1,
      }
      let result = await this.updatePromotion(payload)
      this.visibleConfirm = false

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
    async handleAppendPromotion(payload) {
      let result = await this.appendUserToPromotion(payload)
      this.visibleModalAppend = false

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
    loadDetailPromotion(item) {
      this.item = item
      this.visibleModalAppend = true
    },
    format(status) {
      return status == 1 ? 'Active' : 'Disable'
    },
    textBtn(status) {
      return status == 1 ? 'Disable' : 'Active'
    },
    typeBtn(status) {
      return status == 1 ? 'danger' : 'info'
    },
    showModalDescriptionHandle(item) {
      this.item = item
      this.isVisibleModalDescription = true
    },
  },
  watch: {
    filter: {
      handler: function () {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss">
.promotion {
  .Active {
    color: #48be78;
  }
  .Disable {
    color: #da1e28;
  }
}
</style>
