<template lang="pug">
.v-datetime-field
        .d-flex
            .v-datetime-field__date(v-if="!onlyTime")
                v-menu(
                    v-model="date.menu"
                    v-bind="MENU_CONF"
                )
                    template(v-slot:activator="{ on }")
                        v-text-field(
                            v-model="date.textField"
                            :label="labelDate"             
                            append-icon="mdi-calendar"
                            v-bind="$attrs"
                            v-on="on"
                            type="text"
                            v-mask="'##/##/####'"
                            placeholder="__/__/____"
                            persistent-placeholder
                            :error-messages="date.validate.success ? [] : ['Data/Hora Inválida']"
                            @click:append="openDate"
                            @click:clear="date.textField = null"

                            @keyup.enter="timeFocus"
                            @keydown.tab="timeFocus"
                            @focus="openDate"
                            @input="openDate"
                        )
                    v-date-picker(
                        v-model="date.picker"
                        no-title
                        scrollable
                        locale="pt-br"
                        :min="minDate"
                        :max="maxDate"
                        @input="date.menu = false"
                        @click:date="timeFocus"
                    )
                v-spacer
                v-btn(text color="primary" @click="date.menu = false") Aplicar

            .v-datetime-field__time(v-if="!onlyDate")
                v-menu(
                    v-model="time.menu"
                    v-bind="MENU_CONF"
                )
                    template(v-slot:activator="{ on }")
                        v-text-field(
                            ref="timePickerInput"
                            v-model="time.textField"
                            v-bind="$attrs"
                            v-on="on"
                            :label="labelTime"
                            append-icon="mdi-clock"
                            type="text"
                            v-mask="'##:##'"
                            placeholder="__:__"
                            persistent-placeholder
                            :class="{ 'ml-2': !onlyTime }"
                            :error-messages="time.validate.success ? [] : ['Data selecionada inválida']"
                            @click:append="openTime"
                            @click:clear="time.textField = null"
                            @keyup.enter="time.menu = false"
                            @focus="openTime"

                            @input="openTime"
                        )
                    v-time-picker(
                        :value="time.picker.value"
                        format="24hr"
                        @change="setTimePickerValue"
                        @click:hour="setTimePickerValue"
                    )
                        v-spacer
                        v-btn(text color="primary" @click="time.menu = false") Aplicar
                    .v-datetime-field__error-messages(v-if="$attrs['error-messages']")
                    p.caption.error--text.ml-2 {{ $attrs['error-messages'].join() }}
</template>
  
<script>
import { parseISO, format, parse } from 'date-fns';
import { mask } from 'vue-the-mask';

const DEFAULT_FORMAT_DATE = 'dd/MM/yyyy';

export default {
    name: 'DatePicker',
    directives: {
        mask,
    },
    props: {
        value: { type: String, default: null },

        labelDate: { type: String, default: 'Date' },
        labelTime: { type: String, default: 'Time' },
        minDate: { type: String, default: '2000-01-01' },
        maxDate: { type: String, default: '2100-12-31' },

        onlyDate: { type: Boolean, default: false },
        onlyTime: { type: Boolean, default: false },
    },
    data() {
        return {
            MENU_CONF: {
                'nudge-top': 20,

                'min-width': 5000,
                'offset-y': true,
                'close-on-content-click': false,
                transition: 'scale-transition',
            },

            date: {
                menu: false,
                textField: null,
                picker: null,
                validate: {
                    rule: (v) =>
                        /(0[1-9]|[12]\d|3[01]).(0[1-9]|1[0-2]).([12][0-9]{3})/.test(v),
                    success: true,
                },
            },

            time: {
                menu: false,
                textField: null,
                picker: {
                    value: null,
                    fullfilled: false,
                },
                validate: {
                    rule: (v) => /([0-1]\d|2[0-3]):[0-5][0-9]/.test(v),
                    success: true,
                },
            },
        };
    },
    computed: {
        genericAttrs() {
            return { ...this.$attrs, 'error-messages': [] };
        },
    },
    watch: {
        'value': {
            handler(val) {

                if (val == null) {
                    this.date.textField = null
                }

                const datetime = val && val.split(' ').map((i) => ({ value: i, isTime: i.includes(':') }));
                if (datetime) {
                    if (datetime.length === 2) {
                        const [date, time] = datetime;
                        this.date.picker = date.value;
                        this.time.picker = {
                            value: time.value,
                            fullfilled: true,
                        };
                    } else if (datetime.length === 1) {
                        const [firstVal] = datetime;
                        if (firstVal.isTime) {
                            this.time.picker = {
                                value: firstVal.value,
                                fullfilled: true,
                            };
                        } else this.date.picker = firstVal.value;
                    } else {
                        this.date.picker = null;
                        this.time.picker = {
                            value: null,
                            fullfilled: false,
                        };
                    }
                }
            },
            immediate: true,
        },
        'date.picker': {
            handler(val) {
                let date = null;
                if (val) {
                    date = parseISO(val);
                    date = format(date, DEFAULT_FORMAT_DATE);
                }

                this.date.textField = date;
                this.emitValue();
            },
            immediate: true,
        },
        'date.textField': function (val) {


            if ((val && val.length === 10) || !val) {
                this.date.validate.success = !val ? true : this.date.validate.rule(val);

                if (this.date.validate.success) {
                    this.date.picker = val && this.setDate(val);
                } else {
                    this.date.menu = false;
                }
            }
        },
        'time.picker.value': {
            handler(val) {
                if (this.time.picker.fullfilled) {
                    this.time.textField = val;
                }
                this.emitValue();
            },
            immediate: true,
        },
        'time.textField': function (val) {
            let valFormatted = null;
            if (val && val.length === 2) {
                valFormatted = `${val}:00`;
            }
            if (val && val.length === 5) {
                valFormatted = val;
            }

            if (valFormatted) {
                this.time.validate.success = this.time.validate.rule(valFormatted);

                if (this.time.validate.success) {
                    this.time.picker = {
                        value: valFormatted,
                        fullfilled: val.length === 5,
                    };
                } else {
                    this.time.menu = false;
                }
            }
            if (!val) {
                this.time.picker = {
                    value: null,
                    fullfilled: true,
                };
            }
        },
    },
    methods: {
        setDate(val) {
            return format(parse(val, DEFAULT_FORMAT_DATE, new Date()), 'yyyy-MM-dd');
        },
        setTimePickerValue(val) {
            if (typeof val == 'number') {
                this.setHours(val);
            } else {
                this.time.picker = {
                    value: val,
                    fullfilled: true,
                };
                this.time.menu = false;
            }
        },
        setHours(val) {
            const hours = val > 9 ? val : `0${val}`;

            if (this.time.textField) {
                const [, minutes] = this.time.textField.split(':');
                this.time.textField = `${hours}:${minutes}`;
            } else {
                this.time.textField = `${hours}:00`;
            }
        },
        emitValue() {
            let val = `${this.date.picker} ${this.time.picker.value}`;
            if (!this.date.picker) {
                val = this.time.picker.value;
            }

            if (!this.time.picker.value) {
                val = this.date.picker;
            }

            this.$emit('blur', val);
            this.$emit('input', val);
        },
        openDate() {
            if (this.date.validate.success) {
                this.date.menu = true;
                this.time.menu = false;
            }
        },
        openTime() {
            if (this.time.validate.success) {
                this.time.menu = true;
                this.date.menu = false;
            }
        },
        timeFocus() {
            const { timePickerInput } = this.$refs;
            this.date.menu = false;

            if (timePickerInput) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        timePickerInput.focus();
                    });
                });
            }
        },
    },
};
</script>
  
<style lang="scss" scoped>
.v-datetime-field {
    &__date {
        flex: 1;
    }

    &__time {
        ::v-deep .v-text-field input {
            max-width: 100px;
        }
    }
}
</style>