const fs = require('fs');
const nodeUtil = require('util');

module.exports = {
    promiseBind: function (object, functionName) {
        return nodeUtil.promisify(object[functionName]).bind(object);
    },
    zeros: function (rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
    toSquare: function (file, rank) {
        // Converts rank and file integers to a square like 'a8'
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return files[file] + rank;
    },
    toFileRank: function (square) {
        // Inverse of toSquare
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return { file: files.indexOf(square[0]), rank: parseInt(square[1]) - 1 };
    },
    readSplit: function* (file, delim) {
        // TODO: actually make line by line
        const splits = fs.readFileSync(file, 'utf-8')
            .split(delim)
            .filter(Boolean);
        for (const split of splits) {
            yield delim + split;
        }
    },
    takeList: function (iterable, length) {
        const list = [];
        const iterator = iterable[Symbol.iterator]();
        for (let l = length; l > 0; l--) {
            const next = iterator.next().value;
            if (next != null) list.push(next);
        }
        return list;
    },
    hrtimeToSeconds: function (hrtime) {
        return (hrtime[0] + (hrtime[1] / 1e9));
    },
};
