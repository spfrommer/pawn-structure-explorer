export default {
    zeros: function zeros(rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
    random: function random(rows, columns) {
        return Array(rows).fill().map(() => Array.from({ length: columns }, () => Math.random()));
    },
};
