<template>
    <div class="uk-grid uk-grid-small" data-uk-grid-margin>
        <div class="uk-width-large-1-2">
            <div class="uk-form-icon uk-display-block">
                <i class="pk-icon-calendar pk-icon-muted"></i>
                <input class="uk-width-1-1" type="text" ref="datepicker" v-model.lazy="date">
            </div>
        </div>
        <div class="uk-width-large-1-2">
            <div class="uk-form-icon uk-display-block" ref="timepicker">
                <i class="pk-icon-time pk-icon-muted"></i>
                <input class="uk-width-1-1" type="text" v-model.lazy="time">
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = { // @todo need a require validation
        props: ['datetime', 'required'],
        mounted() {
            this.$nextTick(function () {
                UIkit.datepicker(this.$refs.datepicker, {format: this.dateFormat, pos: 'bottom'}).on('change', this.hateVue('date'));
                UIkit.timepicker(this.$refs.timepicker, {format: this.clockFormat}).on('change', this.hateVue('time'));
            })
        },
        methods: {
            hateVue(type) {
                return (event) => this[type] = event.currentTarget.value;
            }
        },
        computed: {
            dateFormat() {
                return window.$locale.DATETIME_FORMATS.shortDate
                    .replace(/\bd\b/i, 'DD')
                    .replace(/\bm\b/i, 'MM')
                    .replace(/\by\b/i, 'YYYY')
                    .toUpperCase();
            },
            timeFormat() {
                return window.$locale.DATETIME_FORMATS.shortTime.replace(/\bh\b/i, 'hh');
            },
            clockFormat() {
                return this.timeFormat.match(/a/) ? '12h' : '24h';
            },
            date: {
                get() {
                    return UIkit.Utils.moment(this.datetime).format(this.dateFormat);
                },
                set(date) {
                    let prev = new Date(this.datetime);

                    date = UIkit.Utils.moment(date, this.dateFormat);
                    date.hours(prev.getHours());
                    date.minutes(prev.getMinutes());

                    this.datetime = date.utc().format();
                    this.$emit('update:datetime', this.datetime);
                }
            },
            time: {
                get() {
                    return UIkit.Utils.moment(this.datetime).format(this.timeFormat);
                },
                set(time) {
                    let date = new Date(this.datetime);

                    time = UIkit.Utils.moment(time, this.timeFormat);
                    date.setHours(time.hours(), time.minutes());

                    this.datetime = date.toISOString();
                    this.$emit('update:datetime', this.datetime);
                }
            },
            isRequired() {
                return this.required !== undefined;
            }
        }
    };

    Vue.component('input-date', function (resolve, reject) {
        Vue.asset({
            js: [
                'app/assets/uikit/js/components/autocomplete.min.js',
                'app/assets/uikit/js/components/datepicker.min.js',
                'app/assets/uikit/js/components/timepicker.min.js'
            ]
        }).then(function () {
            resolve(module.exports);
        })
    });
</script>
