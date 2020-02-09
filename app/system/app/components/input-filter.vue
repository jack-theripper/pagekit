<template>
    <div class="uk-form-select pk-filter" :class="{'uk-active': localValue }">
        <span>{{ label }}</span>
        <select v-if="isNumber" v-model.number="localValue">
            <template v-for="option in list">
                <optgroup :label="option.label" v-if="option.label">
                    <option v-for="opt in option.options" :value="opt.value">{{ opt.text }}</option>
                </optgroup>
                <option :value="option.value" v-else>{{ option.text }}</option>
            </template>
        </select>
        <select v-else v-model="localValue">
            <template v-for="option in list">
                <optgroup :label="option.label" v-if="option.label">
                    <option v-for="opt in option.options" :value="opt.value">{{ opt.text }}</option>
                </optgroup>
                <option :value="option.value" v-else>{{ option.text }}</option>
            </template>
        </select>
    </div>
</template>

<script>
    export default {
        props: ['title', 'value', 'options', 'number'],
        data() {
            return {
                localValue: this.value
            }
        },
        created () {
            if (this.localValue === undefined) {
                this.localValue = '';
            }
        },
        computed: {
            isNumber () {
                return this.number !== undefined;
            },
            list () {
                return [{value: '', text: this.title}].concat(this.options);
            },
            label () {
                var list = this.list.concat(_.flatten(_.pluck(this.list, 'options')));
                var value = _.find(list, 'value', this.localValue);

                return value ? value.text : this.title;
            }
        },
        watch: {
            localValue(value) {
                this.$emit('update:value', value);
            }
        }
    }
</script>