<template>
  <div>
    <v-menu v-model="isDatePickerOpen" :close-on-content-click="true" :offset-x="offsetX" :offset-y="offsetY"
      min-width="290px" transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-text-field v-model="formattedDate" :variant="variant" :label="label" ref="dateField"
          append-inner-icon="mdi-calendar" @click="isDatePickerOpen = true" v-mask="'##/##/####'" placeholder="dd/mm/yyyy"
          @input="updateSelectedDate($event.target.value)" />
      </template>
      <template v-slot:default="{ on }">
        <div class="date-picker-container" :style="{ top: (offsetY + 150) + 'px', left: offsetX + 'px' }">
          <v-date-picker v-model="selectedDate" no-title scrollable @input="isDatePickerOpen = false"
            @change="handleDateSelected"></v-date-picker>
        </div>
      </template>
    </v-menu>
  </div>
</template>

<script>
import 'v-calendar/dist/style.css';
import { VueMaskDirective } from 'v-mask';

export default {
  name: 'DatePickerTextField',
  directives: {
    mask: VueMaskDirective,
  },
  props: {
    label: {
      type: String,
      default: 'Date',
    },
    variant: {
      type: String,
      default: 'outlined',
    },
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedDate: {
      get() {
        if (this.selectedDate) {
          const dateObj = new Date(this.selectedDate);
          const day = dateObj.getDate().toString().padStart(2, '0');
          const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          const year = dateObj.getFullYear().toString();
          return `${day}/${month}/${year}`;
        }
        return null;
      },
      set(value) {
        this.updateSelectedDate(value);
      },
    },
  },
  data() {
    return {
      selectedDate: this.value,
      isDatePickerOpen: false,
      offsetX: 0,
      offsetY: 0,
    };
  },
  watch: {
    value(newVal) {
      this.selectedDate = newVal;
    },
    selectedDate(newVal) {
      this.$emit('input', newVal);
    },
    isDatePickerOpen(newVal) {
      if (newVal) {
        const rect = this.$refs.dateField.$el.getBoundingClientRect();
        this.offsetY = rect.height + 10;
        this.offsetX = rect.left;
      }
    },
  },
  methods: {
    handleDateSelected() {
      this.$emit('date-selected', this.selectedDate);
    },
    updateSelectedDate(value) {
      const dateParts = value.split('/');
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const year = parseInt(dateParts[2]);
      this.selectedDate = new Date(year, month, day).toISOString().substr(0, 10);
    },
  },
};
</script>

<style scoped>
.date-picker-container {
  position: absolute;
  z-index: 9999;
  padding: 16px;
  border-radius: 4px;
}
</style>
