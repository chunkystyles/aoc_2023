import { getInput } from '../utils/utils.js'

async function part1() {
    const maps = parseInput(await getInput(13));
    let total = 0;
    for (const map of maps) {
        const vertical = traverseVertical(map);
        if (vertical > 0) {
            total += vertical;
            continue;
        }
        const horizontal = traversHorizontal(map);
        if (horizontal > 0) {
            total += (100 * horizontal);
            continue;
        }
        console.log("NO MIRROR LINE FOUND");
    }
    return total;
}

function traversHorizontal(map) {
    for (let y = 0; y < map.length - 1; y++) {
        let top = y;
        let bottom = y + 1;
        let found = true;
        while (top >= 0 && bottom < map.length) {
            if (!compareRows(map, top, bottom)) {
                found = false;
                break;
            }
            top--;
            bottom++;
        }
        if (found) {
            return y + 1;
        }
    }
    return -1;
}

function traverseVertical(map) {
    for (let x = 0; x < map[0].length - 1; x++) {
        let left = x;
        let right = x + 1;
        let found = true;
        while (left >= 0 && right < map[0].length) {
            if (!compareColumns(map, left, right)) {
                found = false;
                break;
            }
            left--;
            right++;
        }
        if (found) {
            return x + 1;
        }
    }
    return -1;
}

function compareRows(map, top, bottom) {
    for (let x = 0; x < map[0].length; x++) {
        if (map[top][x] !== map[bottom][x]) {
            return false;
        }
    }
    return true;
}

function compareColumns(map, left, right) {
    for (let y = 0; y < map.length; y++) {
        if (map[y][left] !== map[y][right]) {
            return false;
        }
    }
    return true;
}

function parseInput(input) {
    const arrays = [];
    let i = 0;
    input.split('\n').forEach(line => {
        if (line) {
            if (arrays.length <= i) {
                arrays.push([]);
            }
            arrays[i].push(line.split(''));
        } else {
            i++;
        }
    });
    return arrays;
}

part1().then(result => console.log(result));