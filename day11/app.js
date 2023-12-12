import { getInput } from '../utils/utils.js'

async function part1() {
    const map = expandMap(parseInput(await getInput(11)));
    const pairs = getAllPairs(map);
    let total = 0;
    for (const pair of pairs) {
        const left = pair[0];
        const right = pair[1];
        const distance = Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
        total += distance;
    }
    return total;
}

async function part2() {
    const expansion = 1000000 - 1;
    // this - 1 tripped me up, it makes sense because my distance calculation is already acounting for the original
    // row or column, and I need to subtract 1 from the expansion.
    const map = parseInput(await getInput(11));
    const pairs = getAllPairs(map);
    const columns = getEmptyColumns(map);
    const rows = getEmptyRows(map);
    let total = 0;
    for (const pair of pairs) {
        const left = pair[0];
        const right = pair[1];
        const expansionx = getEmptyColumnsBetweenPoints(left, right, columns) * expansion;
        const expansiony = getEmptyRowsBetweenPoints(left, right, rows) * expansion;
        const distance = Math.abs(left.x - right.x) + Math.abs(left.y - right.y) + expansionx + expansiony;
        total += distance;
    }
    return total;
}

function parseInput(input) {
    return input.split('\n').filter(line => line).map(line => line.split(''));
}

function getEmptyRows(map) {
    const rows = [];
    for (let y = 0; y < map.length; y++) {
        let empty = true;
        for (const char of map[y]) {
            if (char !== '.') {
                empty = false;
                break;
            }
        }
        if (empty) {
            rows.push(y);
        }
    }
    return rows;
}

function getEmptyColumns(map) {
    const columns = [];
    for (let x = 0; x < map[0].length; x++) {
        let empty = true;
        for (let y = 0; y < map.length; y++) {
            if (map[y][x] !== '.') {
                empty = false;
                break;
            }
        }
        if (empty) {
            columns.push(x);
        }
    }
    return columns;
}

function getEmptyColumnsBetweenPoints(left, right, emptyColumns) {
    const maxColumn = Math.max(left.x, right.x);
    const minColumn = Math.min(left.x, right.x);
    let count = 0;
    for (let column of emptyColumns) {
        if (column > minColumn) {
            if (column < maxColumn) {
                count++;
            } else {
                break;
            }
        }
    }
    return count;
}

function getEmptyRowsBetweenPoints(left, right, emptyRows) {
    const maxRow = Math.max(left.y, right.y);
    const minRow = Math.min(left.y, right.y);
    let count = 0;
    for (let row of emptyRows) {
        if (row > minRow) {
            if (row < maxRow) {
                count++;
            } else {
                break;
            }
        }
    }
    return count;
}

function expandMap(map) {
    for (let y = 0; y < map.length; y++) {
        let empty = true;
        for (const char of map[y]) {
            if (char !== '.') {
                empty = false;
                break;
            }
        }
        if (empty) {
            map.splice(y + 1, 0, Array(map[y].length).fill('.'));
            y++;
        }
    }
    for (let x = 0; x < map[0].length; x++) {
        let empty = true;
        for (let y = 0; y < map.length; y++) {
            if (map[y][x] !== '.') {
                empty = false;
                break;
            }
        }
        if (empty) {
            for (let y = 0; y < map.length; y++) {
                map[y].splice(x + 1, 0, '.');
            }
            x++;
        }
    }
    return map;
}

function getAllPairs(map) {
    const points = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '#') {
                points.push({x: x, y: y});
            }
        }
    }
    const pairs = [];
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            pairs.push([points[i], points[j]]);
        }
    }
    return pairs;
}

part2().then(result => console.log(result));