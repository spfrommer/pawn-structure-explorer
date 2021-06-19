/* eslint-disable no-multi-str */
export default {
    zeros: function (rows, columns) {
        return Array(rows).fill().map(() => Array(columns).fill(0));
    },
    random: function (rows, columns) {
        return Array(rows).fill().map(() => Array.from({ length: columns }, () => Math.random()));
    },
    truncate: function (string, maxLength) {
        if (string.length > maxLength) {
            return string.substring(0, maxLength) + '...';
        }
        return string;
    },
    sumArrays: function (arr1, arr2) {
        console.assert(arr1.length === arr2.length);
        const newArr = [];
        for (let i = 0; i < arr1.length; i++) {
            const row1 = arr1[i];
            const row2 = arr2[i];

            console.assert(row1.length === row2.length);
            newArr.push([]);
            for (let j = 0; j < row1.length; j++) {
                newArr[i].push(row1[j] + row2[j]);
            }
        }
        return newArr;
    },
    scalarMultiplyArray: function (scalar, arr) {
        const newArr = [];
        for (let i = 0; i < arr.length; i++) {
            newArr.push([]);
            for (let j = 0; j < arr[i].length; j++) {
                newArr[i].push(scalar * arr[i][j]);
            }
        }
        return newArr;
    },
    maxArray: function (arr) {
        const maxRow = arr.map(row => Math.max(...row));
        return Math.max.apply(null, maxRow);
    },
};
