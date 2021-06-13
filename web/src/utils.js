export default {
    zeros: function(rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
    random: function(rows, columns) {
        return Array(rows).fill().map(() => Array.from({length: columns}, () => Math.random()));
    },
};