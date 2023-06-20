<template>
  <div class="modal-invite-customer">
    <p-modal :active="visible" @close="handleClose" :title="`Referrals`">
      <div class="row mb-16">
        <div class="col-12">
          <h2>Mời khách hàng sử dụng LionBay</h2>
          <div class="md-desc">
            Nhập email khách hàng của bạn và gửi cho họ lời mời tham gia
            LionBay. Sử dụng dấu “,” để phân cách nhiều người.
          </div>
        </div>
      </div>
      <div class="row mb-24">
        <div class="col-12 d-flex mail-form">
          <p-input
            type="text"
            class="mb-8"
            v-model="email"
            placeholder="Nhập email khách hàng"
          ></p-input>
          <p-button type="info" class="btn btn-special">Gửi</p-button>
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-12">
          <h2>Chia sẻ liên kết giới thiệu</h2>
          <div class="md-desc">
            Bạn cũng có thể chia sẻ liên kết giới thiệu của mình bằng cách sao
            chép và gửi nó hoặc chia sẻ trên phương tiện truyền thông xã hội của
            bạn.
          </div>
        </div>
      </div>
      <div class="row mb-16">
        <div class="col-12">
          <div class="link-coppy">
            https://www.lionbay.express/referral/yourname
            <span role="btn"> Copy link </span>
          </div>
        </div>
      </div>
    </p-modal>
  </div>
</template>
<script>
import mixinRoute from '@core/mixins/route'
export default {
  name: 'ModalInviteCustomer',
  mixins: [mixinRoute],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
  },
}
</script>
<style>
.mail-form .input-group {
  height: 56px;
  margin-bottom: 0;
}
.mail-form .form-control {
  height: 56px !important;
  padding: 18px 16px;
}
.mail-form input::-webkit-input-placeholder {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #313232;
}
.mail-form input:-moz-placeholder {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #313232;
}
.mail-form button {
  width: 77px;
  height: 56px;
  border-radius: 8px;
  margin-left: 8px;
  margin-bottom: 0;
}
.modal-header .modal-title {
  font-family: 'Be VietNam Pro', serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
  color: #111212;
}

.modal-invite-customer h2 {
  font-family: 'Be VietNam Pro', serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #111212;
  margin-bottom: 4px;
}

.modal-invite-customer .md-desc {
  font-family: 'Be VietNam Pro', serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #aaabab;
}
.link-coppy {
  padding: 18px 16px;
  background: #f6f7f7;
  border-radius: 8px;
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #313232;
}
span[role='btn'] {
  position: absolute;
  font-family: 'Be Vietnam Pro';
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #007672;
  right: 30px;
  cursor: pointer;
}
</style>
