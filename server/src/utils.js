module.exports = {
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
    }
}