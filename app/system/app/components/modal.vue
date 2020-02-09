<template>
    <div class="uk-modal">
        <div class="uk-modal-dialog" :class="classes">
            <div v-if="opened">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modal',
        data() {
            return {
                opened: false
            }
        },
        props: {
            large: Boolean,
            lightbox: Boolean,
            closed: Function,
            modifier: {type: String, default: ''},
            options: {
                type: Object, default: function () {
                    return {};
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                document.querySelector('body').appendChild(this.$el);
                this.modal = UIkit.modal(this.$el, _.extend({modal: false}, this.options));
                this.modal.on('hide.uk.modal', () => {
                    this.opened = false;

                    if (this.closed) {
                        this.closed();
                    }
                })
            })
        },
        computed: {
            classes() {
                let classes = this.modifier.split(' ');

                if (this.large) {
                    classes.push('uk-modal-dialog-large');
                }

                if (this.lightbox) {
                    classes.push('uk-modal-dialog-lightbox');
                }

                return classes;
            }
        },
        methods: {
            open() {
                this.opened = true;
                this.modal.show();
            },
            close() {
                this.modal.hide();
            }
        }
    }
</script>