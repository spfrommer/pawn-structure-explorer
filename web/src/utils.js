export default {
    zeros: function(rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
};