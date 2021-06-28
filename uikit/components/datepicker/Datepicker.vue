<template>
  <date-range-picker
    ref="picker"
    :opens="opens"
    :locale-data="localeData"
    :minDate="minDate"
    :maxDate="maxDate"
    :maxSpan="maxSpan"
    :singleDatePicker="singleDatePicker"
    :timePicker="timePicker"
    :timePicker24Hour="timePicker24Hour"
    :showWeekNumbers="showWeekNumbers"
    :showDropdowns="showDropdowns"
    :autoApply="autoApply"
    v-model="dateRange"
    @update="updateValues"
    @toggle="checkOpen"
    :linkedCalendars="linkedCalendars"
    :dateFormat="dateFormat"
    :close-on-esc="true"
  >
    <div slot="input" slot-scope="picker" style="width: 100%;">
      <img
        src="@assets/img/calendar.svg"
        style="float: right; margin-left: 2px; margin-top: 6px;"
      />
      <span
        class="label-date-picker"
        v-if="
          dateRange.startDate === dateRange.endDate &&
            dateRange.startDate === ''
        "
      >
        {{ label }}
      </span>
      <span
        v-else-if="
          picker.startDate &&
            picker.endDate &&
            picker.startDate != picker.endDate &&
            !singleDatePicker
        "
      >
        {{ picker.startDate | date('dd/MM/yyyy') }} ~
        {{ picker.endDate | date('dd/MM/yyyy') }}
      </span>
      <span
        v-else-if="
          dateRange.startDate &&
            dateRange.endDate &&
            picker.startDate != picker.endDate &&
            !singleDatePicker
        "
      >
        {{ dateRange.startDate | date('dd/MM/yyyy') }} ~
        {{ dateRange.endDate | date('dd/MM/yyyy') }}
      </span>
      <span
        v-else-if="
          singleDatePicker && dateRange.startDate && label != 'dd/mm/yyyy'
        "
      >
        {{ dateRange.startDate | date('dd/MM/yyyy') }}
      </span>
      <span class="label-date-picker" v-else>{{ label }}</span>
    </div>
  </date-range-picker>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker'
export { date } from '@core/utils/datetime'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
  name: 'PDatepicker',
  components: { DateRangePicker },
  props: {
    value: {},
    label: {
      type: String,
      default: 'Date',
    },
    singleDatePicker: {
      type: Boolean,
      default: false,
    },
    timePicker: {
      type: Boolean,
      default: false,
    },
    opens: {
      type: String,
      default: 'left',
    },
    minDate: {
      type: [String, Date],
      default: '',
    },
    maxDate: {
      type: [String, Date],
      default: '',
    },
    maxSpan: {
      type: String,
      default: '',
    },
    timePicker24Hour: {
      type: Boolean,
      default: true,
    },
    showWeekNumbers: {
      type: Boolean,
      default: false,
    },
    showDropdowns: {
      type: Boolean,
      default: false,
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
    linkedCalendars: {
      type: Boolean,
      default: true,
    },
    dateFormat: {
      type: Function,
      default: null,
    },
    localeData: {
      type: [Object, Array],
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      dateRange: {},
    }
  },
  computed: {
    textValue() {
      let text = ''
      if (!this.picker) {
        return ''
      }

      if (this.picker.startDate) {
        text = this.picker.startDate
      }

      if (this.picker.endDate) {
        text = `to ${this.picker.endDate}`
      }
      return text
    },
  },
  methods: {
    updateValues(e) {
      this.$emit('input', e)
      this.$emit('update', e)
    },
    checkOpen(e) {
      this.$emit('check-open', e)
    },
  },
  watch: {
    value: function(value) {
      this.dateRange = value
    },
  },
}
</script>
