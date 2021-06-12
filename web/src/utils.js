export default {
    truncate: function(string, maxLength) {
        if (string.length > maxLength) {
            return string.substring(0, maxLength) + '...';
        }
        return string;
    },
};
