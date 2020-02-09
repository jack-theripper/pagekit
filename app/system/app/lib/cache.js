const storage = require('JSONStorage');

module.exports = function (bucket, adapter) {
    const db = storage.select(bucket, adapter || 'local');

    return {
        set(key, value, minutes) {
            return minutes ? db.setex(key, minutes * 60, value) : db.set(key, value);
        },
        get() {
            return db.get.apply(db, arguments);
        },
        remove(key) {
            return db.del.apply(db, arguments);
        },
        flush() {
            return db.flushdb.apply(db, arguments);
        }
    }
};