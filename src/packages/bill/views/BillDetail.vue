<template>
  <div class="pages bill__detail ">
    <div class="page-header">
      <div class="page-header_back">
        <router-link :to="{ name: 'list-claim' }" class="text">
          <img
            src="@/assets/img/Arrow - Left Square 24px.png"
            class="page-header_back_icon"
          />

          Hóa đơn
        </router-link>
      </div>
      <div class="bill__detail-flex">
        <div class="bill__detail-info">
          <div class="bill__detail-title">Mã hóa đơn:</div>
          <div class="bill__detail-title">Ngày tạo:</div>
          <div class="bill__detail-title">Trạng thái:</div>
          <div class="bill__detail-code">LNN012345</div>
          <div class="bill__detail-date">26/05/2021 - 19:34:30</div>
          <div class="bill__detail-status">Chờ trả tiền</div>
        </div>
        <div class="bill__detail-action">
          <a href="#" class="btn btn-danger">
            <span>Hủy đơn</span>
          </a>
          <a href="#" class="btn btn-primary ml-10">
            <span>Lịch sử thanh toán</span>
          </a>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="row">
        <div class="col-6  item-gutters ">
          <div class="card-block  ">
            <div class="card-section">
              <div class="card-item">
                <div class="card-item-title">Phí giao:</div>
                <div class="card-item-price">$24.99</div>
              </div>
              <div class="card-item">
                <div class="card-item-title">Phí phát sinh:</div>
                <div class="card-item-price">$24.99</div>
              </div>
              <div class="card-item">
                <div class="card-item-title">Khuyến mãi:</div>
                <div class="card-item-price">$24.99</div>
              </div>
            </div>
            <div class="card-section">
              <div class="card-item">
                <div class="card-item-title">Tổng hóa đơn:</div>
                <div class="card-item-price">$24.99</div>
              </div>
              <div class="card-item">
                <div class="card-item-title">Đã trả:</div>
                <div class="card-item-price">$24.99</div>
              </div>
            </div>
            <div class="card-section">
              <div class="card-item">
                <div class="card-item-title">Đã trả:</div>
                <div class="card-item-price">$24.99</div>
              </div>
            </div>
          </div>
          <div class="card-block ">
            <div class="card-header">
              <div class="card-title">Chi tiết phí phát sinh</div>
            </div>
            <div class="card-content">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Ngày tạo</th>
                      <th>Loại thay đổi</th>
                      <th>Mã vận đơn</th>
                      <th>Phí phát sinh</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>30/5/2021</td>
                      <td>Cân nặng</td>
                      <td>MVD123456 <img src="@/assets/img/external.svg"/></td>
                      <td>$9.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6  item-gutters ">
          <div class="card-block ">
            <div class="card-header ">
              <div class="card-title">Danh sách đơn hàng</div>
            </div>
            <div class="card-content">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Mã vận đơn</th>
                      <th>Phí giao</th>
                      <th>Phí phát sinh</th>
                      <th>Khuyến mãi</th>
                      <th>Tổng cước</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>30/5/2021</td>
                      <td>Cân nặng</td>
                      <td>MVD123456 <img src="@/assets/img/external.svg"/></td>
                      <td>$9.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BillDetail',
}
</script>
