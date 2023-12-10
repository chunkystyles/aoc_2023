import { getInput, writeJsonFile } from '../utils/utils.js'
import { Queue } from '@datastructures-js/queue';

let map;
let output;

async function part1() {
    map = parseInput(await getInput(10));
    const points = new Queue();
    const start = findStart();
    points.enqueue(start);
    output = [];
    for (const row of map) {
        output.push(Array(row.length).fill('.', 0, row.length));
    }
    output[start.y][start.x] = 0;
    let max = 0;
    while (points.size() > 0) {
        const point = points.dequeue();
        const value = output[point.y][point.x];
        if (value > max) {
            max = value;
        }
        const connectedPoints = getConnectedPoints(point);
        connectedPoints.forEach(connectedPoint => {
            if (isInBounds(connectedPoint) && output[connectedPoint.y][connectedPoint.x] === '.') {
                points.enqueue(connectedPoint);
                output[connectedPoint.y][connectedPoint.x] = value + 1;
            }
        });
    }
    return max;
}

function parseInput(input) {
    return input.split('\n').filter(line => line).map(line => line.split(''));
}

function findStart() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'S') {
                return { x: x, y: y };
            }
        }
    }
}

function getConnectedPoints(point) {
    const x = point.x;
    const y = point.y;
    const char = map[y][x];
    const connectedPoints = [];
    switch (char) {
        case '|':
            if (y - 1 >= 0 && map[y - 1][x] !== '.') {
                connectedPoints.push({x: x, y: y - 1});
            }
            if (y + 1 < map.length && map[y + 1][x] !== '.') {
                connectedPoints.push({x: x, y: y + 1});
            }
            break;
        case '-':
            if (x - 1 >= 0 && map[y][x - 1] !== '.') {
                connectedPoints.push({x: x - 1, y: y});
            }
            if (x + 1 < map[y].length && map[y][x + 1] !== '.') {
                connectedPoints.push({x: x + 1, y: y});
            }
            break;
        case 'L':
            if (y - 1 >= 0 && map[y - 1][x] !== '.') {
                connectedPoints.push({x: x, y: y - 1});
            }
            if (x + 1 < map[y].length && map[y][x + 1] !== '.') {
                connectedPoints.push({x: x + 1, y: y});
            }
            break;
        case 'J':
            if (y - 1 >= 0 && map[y - 1][x] !== '.') {
                connectedPoints.push({x: x, y: y - 1});
            }
            if (x - 1 >= 0 && map[y][x - 1] !== '.') {
                connectedPoints.push({x: x - 1, y: y});
            }
            break;
        case '7':
            if (x - 1 >= 0 && map[y][x - 1] !== '.') {
                connectedPoints.push({x: x - 1, y: y});
            }
            if (y + 1 < map.length && map[y + 1][x] !== '.') {
                connectedPoints.push({x: x, y: y + 1});
            }
            break;
        case 'F':
            if (x + 1 < map[y].length && map[y][x + 1] !== '.') {
                connectedPoints.push({x: x + 1, y: y});
            }
            if (y + 1 < map.length  && map[y + 1][x] !== '.') {
                connectedPoints.push({x: x, y: y + 1});
            }
            break;
        case 'S':
            if (y - 1 >= 0) {
                const connectedChar = map[y - 1][x];
                if (connectedChar === '|' || connectedChar === '7' || connectedChar === 'F') {
                    connectedPoints.push({x: x, y: y - 1});
                }
            }
            if (y + 1 < map.length) {
                const connectedChar = map[y + 1][x];
                if (connectedChar === '|' || connectedChar === 'L' || connectedChar === 'J') {
                    connectedPoints.push({x: x, y: y + 1});
                }
            }
            if (x - 1 >= 0) {
                const connectedChar = map[y][x - 1];
                if (connectedChar === '-' || connectedChar === 'L' || connectedChar === 'F') {
                    connectedPoints.push({x: x - 1, y: y});
                }
            }
            if (x + 1 < map[y].length) {
                const connectedChar = map[y][x + 1];
                if (connectedChar === '-' || connectedChar === 'J' || connectedChar === '7') {
                    connectedPoints.push({x: x + 1, y: y});
                }
            }
            break;
        default:
            break;
    }
    return connectedPoints;
}

function isInBounds(point) {
    return point.y >= 0 && point.y < map.length && point.x >= 0 && point.x < map[point.y].length;
}

part1().then(result => console.log(result));