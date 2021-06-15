const { LineReader } = require('line-reader');

module.exports = {
    zeros: function zeros(rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
    toSquare: function toSquare(file, rank) {
        // Converts rank and file integers to a square like 'a8'
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return files[file] + rank;
    },
    toFileRank: function toFileRank(square) {
        // Inverse of toSquare
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return { file: files.indexOf(square[0]), rank: parseInt(square[1]) - 1 };
    },
    readSplit: function* readSplit(file, delim) {
        const lines = LineReader(file);

        let buffer = '';
        for (const line of lines) {
            const segments = line.split(delim);
            for (const [i, seg] of segments.entries()) {
                if (i === 0) {
                    buffer += seg;
                }
                if (i > 0) {
                    yield buffer;
                    buffer = delim + seg;
                }
            }
            buffer += '\n';
        }
        yield buffer;
    },
    hrtimeToSeconds: function hrtimeToSeconds(hrtime) {
        return (hrtime[0] + (hrtime[1] / 1e9));
    },
};
