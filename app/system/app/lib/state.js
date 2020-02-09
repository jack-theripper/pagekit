module.exports = function (Vue) {
    const State = function (key, value) {
        let current = (new RegExp(key + '=([^&]*)&?')).exec(location.search);

        if (!value && current) {
            this[key] = current[1];
        }

        if (value !== undefined) {
            history.replaceState({key: key, value: this[key]}, '', modifyQuery(location.search, key, value));
        }

        this.$watch(key, function (value) {
            history.pushState({key: key, value: value}, '', modifyQuery(location.search, key, value));
        });

        window.onpopstate = (event) => {
            if (event.state && event.state.key === key) {
                this[key] = event.state.value;
            }
        };
    };

    Object.defineProperty(Vue.prototype, '$state', {
        get() {
            return State.bind(this);
        }
    })
};

function modifyQuery(query, key, value) {
    query = query.substr(1);
    query = query.replace(new RegExp(key + '=[^&]*&?'), '');

    if (query.length && query[query.length - 1] !== '&') {
        query += '&';
    }

    return '?' + query + [key, value].join('=');
}