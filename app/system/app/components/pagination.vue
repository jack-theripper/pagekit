<template>
    <ul class="uk-pagination"></ul>
</template>

<script>
    export default {
        name: 'pagination',
        props: {
            page: {
                default: 0
            },
            pages: {
                default: 1
            },
            replaceState: {
                type: Boolean,
                default: true
            }
        },
        created() {
            this.key = this.$parent.$options.name + '.pagination';

            if (this.page === null && this.$session.get(this.key)) {
                this.page = this.$session.get(this.key);
                this.$emit('update:page', this.page);
            }

            if (this.replaceState) {
                this.$state('page', this.page);
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.pagination = UIkit.pagination(this.$el, {pages: this.pages, currentPage: this.page || 0});
                this.pagination.on('select.uk.pagination', (e, page) => {
                    this.page = page;
                    this.$emit('update:page', page);
                });
            })
        },
        watch: {
            page (page) {
                this.pagination.selectPage(page || 0);
                this.$session.set(this.key, page || 0);
            },
            pages (pages) {
                this.pagination.render(pages);
            }
        }
    }
</script>