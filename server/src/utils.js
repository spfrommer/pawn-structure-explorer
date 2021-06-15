module.exports = {
    zeros: function(rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
    toSquare: function(file, rank) {
        // Converts rank and file integers to a square like 'a8'
        let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return files[file] + rank;
    },
    toFileRank: function(square) {
        // Inverse of toSquare
        let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return { file: files.indexOf(square[0]), rank: parseInt(square[1]) - 1 };
    },
    readSplit: function*(file, delim) {
        const { LineReader } = require('line-reader');
        const lines = LineReader(file)

        let buffer = '';
        for (const line of lines) {
            let segments = line.split(delim);
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
    hrtimeToSeconds: function(hrtime) {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9));
        return seconds;
    }
}