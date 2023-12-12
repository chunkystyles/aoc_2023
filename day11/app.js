import { getInput } from '../utils/utils.js'

async function part1() {
    const map = parseInput(await getInput(11));
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

function parseInput(input) {
    return expandMap(input.split('\n').filter(line => line).map(line => line.split('')));
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

part1().then(result => console.log(result));