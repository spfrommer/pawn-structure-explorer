export default {
    zeros: function zeros(rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
    random: function random(rows, columns) {
        return Array(rows).fill().map(() => Array.from({ length: columns }, () => Math.random()));
    },
    sumArrays: function sumArrays(arr1, arr2) {
        console.assert(arr1.length === arr2.length);
        const newArr = [];
        for (let i = 0; i < arr1.length; i++) {
            const row1 = arr1[i];
            const row2 = arr2[i];

            console.assert(row1.length === row2.length);
            newArr[i] = [];
            for (let j = 0; j < row1.length; j++) {
                newArr[i].push(row1[j] + row2[j]);
            }
        }
        return newArr;
    },
};
