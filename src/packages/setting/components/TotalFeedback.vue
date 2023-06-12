<template>
  <div class="card-block block-star">
    <div class="card-header">
      <div class="card-title">Phản hồi khách hàng</div>
    </div>
    <div class="card-body">
      <div class="avg">
        4,1
        <span>(225 đánh giá)</span>
      </div>
      <div class="detail-rate">
        <div class="row-detail">
          <div class="label">5.</div>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 75%"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="per">
            75%
            <span class="count">198</span>
          </div>
        </div>
        <div class="row-detail">
          <div class="label">4.</div>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 75%"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="per">
            75%
            <span class="count">198</span>
          </div>
        </div>
        <div class="row-detail">
          <div class="label">3.</div>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 75%"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="per">
            75%
            <span class="count">198</span>
          </div>
        </div>
        <div class="row-detail">
          <div class="label">2.</div>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 75%"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="per">
            75%
            <span class="count">198</span>
          </div>
        </div>
        <div class="row-detail">
          <div class="label">1.</div>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 75%"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="per">
            75%
            <span class="count">198</span>
          </div>
        </div>
      </div>
    </div>
    <svg
      width="16"
      height="8"
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8L-6.99382e-07 1.39876e-06L6.68056 8.14731e-07L16 0L8 8Z"
        fill="white"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'TotalFeedback',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  computed: {},
  data() {
    return {}
  },
  methods: {},
  watch: {
    visible: {
      handler: function () {},
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style scoped lang="scss">
.block-star {
  width: 208px;
  border: 1px solid #edeeee;
  box-shadow: 0px 0px 2px rgba(17, 18, 18, 0.04),
    0px 4px 8px rgba(17, 18, 18, 0.08) !important;
  border-radius: 4px !important;
  padding: 16px !important;
  margin: unset;
  position: absolute;
  visibility: hidden;
  z-index: 9999;
  top: -160px;
  left: -40px;
  svg {
    position: absolute;
    content: '';
    opacity: 1;
    visibility: visible;
    pointer-events: none;
    bottom: -8px;
    left: 75%;
    transform: translateX(-75%);
  }
  .card-header {
    margin-bottom: 8px !important;
    .card-title {
      font-weight: 700 !important;
      font-size: 12px !important;
      line-height: 16px !important;
      color: #111212 !important;
      text-transform: unset !important;
      letter-spacing: unset !important;
    }
  }
  .avg {
    color: #111212;
    font-weight: 700;
    font-size: 24px;
    height: 28px;
    line-height: 28px;
    margin-bottom: 6px;
    span {
      font-weight: 400;
      font-size: 12px;
      font-weight: 400;
      color: #aaabab;
    }
  }
  .detail-rate {
    .progress {
      width: 100px;
      height: 8px;
      border-radius: 2px;
    }
    .progress-bar {
      background: #00b7b0;
      border-radius: 2px;
    }
    .row-detail {
      margin-bottom: 8px;
      position: relative;
      padding-left: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .label {
      position: absolute;
      left: -1px;
      top: -5px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #aaabab;
    }
    .per {
      position: absolute;
      left: 120px;
      top: -4px;
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      color: #313232;
      .count {
        font-weight: 400;
        color: #aaabab;
      }
    }
  }
}
</style>
