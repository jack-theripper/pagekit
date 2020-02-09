var Version = require('../../../../../installer/app/lib/version');

import panel from '../components/widget-panel.vue';
import feed from '../components/widget-feed.vue';
import location from '../components/widget-location.vue';

window.Dashboard = {
    el: '#dashboard',
    data: function () {
        return _.extend({editing: {}, update: {}, widgets: []}, window.$data);
    },
    created() {
        this.Widgets = this.$resource('admin/dashboard{/id}');
        this.widgets = this.widgets.filter((widget, idx) => {
            if (this.getType(widget.type)) {
                widget.idx = widget.idx === undefined ? idx : widget.idx;
                widget.column = widget.column === undefined ? 0 : widget.column;

                return true;
            }

            return false;
        });

        this.checkVersion();
    },
    mounted() {

        let sortables = $(this.$el) // widget re-ordering
            .find('.uk-sortable[data-column]')
            .each(function () {
                UIkit.sortable(this, {group: 'widgets', dragCustomClass: 'pk-sortable-dragged-panel', handleClass: 'pk-icon-handle'})
            })
            .on('change.uk.sortable', (e, sortable, item, mode) => {
                if (mode !== 'added' && mode !== 'moved') { // only `added` and `moved` modes
                    return;
                }

                sortable = sortable.element ? sortable : sortable.data('sortable');

                let widgets = this.widgets, column = parseInt(sortable.element.data('column'), 10), data = {}, widget;

                sortable.element.children('[data-idx]').each(function (idx) {
                    widget = _.find(widgets, 'id', this.getAttribute('data-id'));
                    widget.column = column;
                    widget.idx = idx;
                });

                widgets.forEach(function (widget) {
                    data[widget.id] = widget;
                });

                this.$http.post('admin/dashboard/savewidgets', {widgets: data}).then(function () {
                    sortables.children().each(function () { // cleanup empty items - maybe fixed with future vue.js version
                        if (!this.children.length) $(this).remove();
                    });
                });
            });

    },
    filters: {
        column: function (widgets, column) {
            column = parseInt(column || 0, 10);

            return _.sortBy(widgets.filter(function (widget) {
                return widget.column == column;
            }), 'idx');
        }
    },
    computed: {
        columns: function () {
            var i = 0;
            return _.groupBy(this.widgets, function () {
                return i++ % 3;
            });
        },
        hasUpdate: function () {
            return this.update && Version.compare(this.update.version, this.version, '>');
        }
    },
    methods: {
        add: function (type) {
            var column = 0, sortables = $('#dashboard').find('.uk-sortable[data-column]');

            sortables.each(function (idx) {
                column = (this.children.length < sortables.eq(column)[0].children.length) ? idx : column;
            });

            this.Widgets.save({widget: _.merge({type: type.id, column: column, idx: 100}, type.defaults)}).then(function (res) {
                var data = res.data;
                this.widgets.push(data);
                this.editing[data.id] = true;
            });
        },
        save: function (widget) {
            const data = {widget: widget};

            this.$broadcast('save', data);
            this.Widgets.save({id: widget.id}, data);
        },
        remove: function (widget) {
            this.Widgets.delete({id: widget.id}).then(function () {
                this.widgets.splice(_.findIndex(this.widgets, {id: widget.id}), 1);
            });
        },
        getType: function (id) {
            return _.find(this.getTypes(), 'id', id);
        },
        getTypes: function () {
            let types = [];

            _.forIn(this.$options.components, function (component, name) {
                var options = component || {}, type = options.type;

                if (type) {
                    type.component = name;
                    types.push(type);
                }
            });

            return types;
        },

        checkVersion: function () {
            this.$http.get(this.api + '/api/update', {}, {cache: 60}).then(function (res) {
                var update = res.data[this.channel == 'nightly' ? 'nightly' : 'latest'];

                if (update) {
                    this.update = update;
                }
            });

        },
        columnWidgets(i) {
            return this.$options.filters.column(this.widgets, i);
        }
    },
    components: {
        panel,
        feed,
        location
    }

};

Vue.ready(window.Dashboard);
