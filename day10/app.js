import {getInput, writeJsonFile} from '../utils/utils.js'
import {Queue} from '@datastructures-js/queue';

let map;
let output;
const visits = [];

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

async function part2() {
    map = parseInput(await getInput(10));
    traverseLoop();
    output = [];
    for (let mapY = 0; mapY < map.length; mapY++) {
        const outputY = mapY * 2;
        output[outputY] = [];
        if (mapY > 0) {
            output[outputY - 1] = [];
        }
        for (let mapX = 0; mapX < map[mapY].length; mapX++) {
            const outputX = mapX * 2;
            const char = map[mapY][mapX];
            if (char === '.') {
                output[outputY].push('.');
                output[outputY].push('+');
                if (mapY > 0) {
                    output[outputY - 1].push('.');
                    output[outputY - 1].push('.');
                }
            } else {
                let firstX = false;
                let otherChar;
                otherChar = map[mapY][mapX - 1];
                if (connectsWest(char) && connectsEast(otherChar)) {
                    output[outputY].push('X');
                    firstX = true;
                } else {
                    output[outputY].push('.');
                }
                output[outputY].push(char);
                if (mapY > 0) {
                    otherChar = map[mapY - 1][mapX];
                    if (connectsNorth(char) && connectsSouth(otherChar)) {
                        if (!firstX) {
                            output[outputY - 1].push('.');
                        } else {
                            let newX = outputX - 1;
                            let newY = outputY - 2;
                            if (newX > 0 && newY > 0) {
                                if (output[newY][newX] === '.') {
                                    output[outputY - 1].push('.');
                                } else {
                                    newX = outputX - 2;
                                    newY = outputY - 1;
                                    if (output[newY][newX] === '.') {
                                        output[outputY - 1].push('.');
                                    } else {
                                        output[outputY - 1].push('X');
                                    }
                                }
                            } else {
                                output[outputY - 1].push('.');
                            }
                        }
                        output[outputY - 1].push('X');
                    } else {
                        output[outputY - 1].push('.');
                        output[outputY - 1].push('.');
                    }
                }
            }
        }
    }
    for (let y = 0; y < output.length; y++) {
        for (let x = 0; x < output[y].length; x++) {
            if (isOpenChar(output[y][x])) {
                if (canReachEdge(x, y)) {
                    floodFill(x, y, '0', false);
                } else {
                    floodFill(x, y, 'I', true);
                }
            }
        }
    }
    let plusCount = 0;
    for (const row of output) {
        for (const char of row) {
            if (char === '+') {
                plusCount++;
            }
        }
    }
    return plusCount;
}

function traverseLoop() {
    const points = new Queue();
    const start = findStart();
    points.enqueue(start);
    const loop = [];
    for (const row of map) {
        loop.push(Array(row.length).fill(false, 0, row.length));
    }
    while (points.size() > 0) {
        const point = points.dequeue();
        loop[point.y][point.x] = true;
        const connectedPoints = getConnectedPoints(point);
        connectedPoints.forEach(connectedPoint => {
            if (isInBounds(connectedPoint) && !loop[connectedPoint.y][connectedPoint.x]) {
                points.enqueue(connectedPoint);
            }
        });
    }
    for (let y = 0; y < loop.length; y++) {
        for (let x = 0; x < loop[y].length; x++) {
            if (!loop[y][x]) {
                map[y][x] = '.';
            }
        }
    }
}

function canReachEdge(x, y) {
    flushVisits();
    const points = new Queue();
    points.enqueue({x: x, y: y});
    while (points.size() > 0) {
        const point = points.dequeue();
        if (isEdge(point.x, point.y)) {
            return true;
        }
        let newY = point.y - 1;
        let newX = point.x;
        if (newY >= 0 && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
        newY = point.y + 1;
        if (newY < output.length && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
        newY = point.y;
        newX = point.x - 1;
        if (newX >= 0 && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
        newX = point.x + 1;
        if (newX < output[y].length && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
    }
    return false;
}

function isOpenChar(char) {
    return char === '.' || char === '+';
}

function isEdge(x, y) {
    return x === 0 || y === 0 || x === output[y].length - 1 || y === output.length - 1;
}

function floodFill(x, y, char, canReachEdge) {
    flushVisits();
    const points = new Queue();
    points.enqueue({x: x, y: y});
    while (points.size() > 0) {
        const point = points.dequeue();
        if (canReachEdge && output[point.y][point.x] === '+') {
            // output[point.y][point.x] = '+';
        } else {
            output[point.y][point.x] = char;
        }
        let newY = point.y - 1;
        let newX = point.x;
        if (newY >= 0 && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
        newY = point.y + 1;
        if (newY < output.length && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
        newY = point.y;
        newX = point.x - 1;
        if (newX >= 0 && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
        newX = point.x + 1;
        if (newX < output[y].length && !visits[newY][newX] && isOpenChar(output[newY][newX])) {
            visits[newY][newX] = true;
            points.enqueue({x: newX, y: newY});
        }
    }
}

function mapToString(map) {
    return map.map(line => line.join('')).join('\n');
}

function parseInput(input) {
    return input.split('\n').filter(line => line).map(line => line.split(''));
}

function findStart() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'S') {
                return {x: x, y: y};
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
            if (y + 1 < map.length && map[y + 1][x] !== '.') {
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

function connectsNorth(char) {
    return char === '|' || char === 'J' || char === 'L' || char === 'S';
}

function connectsSouth(char) {
    return char === '|' || char === '7' || char === 'F' || char === 'S';
}

function connectsEast(char) {
    return char === '-' || char === 'F' || char === 'L' || char === 'S';
}

function connectsWest(char) {
    return char === '-' || char === '7' || char === 'J' || char === 'S';
}

function flushVisits() {
    if (visits.length === 0) {
        for (let i = 0; i < output.length; i++) {
            visits.push(Array(output[0].length).fill('.', 0, output[0].length));
        }
    }
    for (let i = 0; i < visits.length; i++) {
        for (let j = 0; j < visits[i].length; j++) {
            visits[i][j] = false;
        }
    }
}

part2().then(result => console.log(result));