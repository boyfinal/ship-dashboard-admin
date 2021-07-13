<template>
  <div class="pages check-package">
    <div class="page-content">
      <div class="row">
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <div class="d-flex">
                <p-input></p-input>
                <button class="btn btn-info ml-3 text-nowrap">Duyệt</button>
              </div>
            </div>
          </div>
          <div class="card mt-5">
            <div class="card-header">
              <div class="card-title">Kiểm tra số đo</div>
            </div>
            <div class="card-body">
              <div class="mt-4">
                <label class="form-label">Lý do trả hàng:</label>
                <p-input type="textarea"></p-input>
              </div>
            </div>
            <div class="card-footer">
              <p>Kết quả: <span class="">Phù hợp</span></p>
              <div class="text-right mt-4">
                <button class="btn btn-outline-danger">Phát sinh</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Kiểm tra loại hàng</div>
            </div>
            <div class="card-body"> </div>
            <div class="card-footer d-block">
              <div class="mt-4">
                <label class="form-label">Lý do trả hàng:</label>
                <p-input type="textarea"></p-input>
              </div>
              <div class="text-right mt-4">
                <button class="btn btn-danger">Trả hàng</button>
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
  name: 'CheckPackage',
}
</script>
