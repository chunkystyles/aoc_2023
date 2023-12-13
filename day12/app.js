import { getInput } from '../utils/utils.js'

let map;
let arrangements;
let start;
let springs;
let springsLength;
const dotRegex = /\.+/g;

const testInput = '???.### 1,1,3\n' +
    '.??..??...?##. 1,1,3\n' +
    '?#?#?#?#?#?#?#? 1,3,1,6\n' +
    '????.#...#... 4,1,1\n' +
    '????.######..#####. 1,6,5\n' +
    '?###???????? 3,2,1';

async function part1() {
    let total = 0;
    const conditions = parseInput(testInput);
    // const conditions = parseInput(await getInput(12));
    for (const condition of conditions) {
        arrangements = 0;
        const expand = false;
        map = new Map();
        if (expand) {
            springs = expandSprings(condition.springs, 5);
            springsLength = calculateSpringsLength(springs);
            total += isConditionSuitable(trimCondition(expandCondition(condition.condition, 5)));
            console.log(total);
        } else {
            springs = condition.springs;
            springsLength = calculateSpringsLength(condition.springs);
            total += isConditionSuitable(trimCondition(condition.condition));
        }
    }
    const end = new Date().getTime();
    console.log(`${end} - ${start} = ${end - start} ms`);
    return total;
}

function calculateSpringsLength(springs) {
    let total = springs.length - 1;
    springs.forEach(value => total += value);
    return total;
}

function expandSprings(springs, times) {
    const newArray = [];
    for (let i = 0; i < times; i++) {
        for (const value of springs) {
            newArray.push(value);
        }
    }
    return newArray;
}

function expandCondition(condition, times) {
    let newCondition = '';
    for (let i = 0; i < times; i++) {
        if (i > 0) {
            newCondition += '?';
        }
        newCondition += condition;
    }
    return newCondition;
}

function parseInput(input) {
    start = new Date().getTime();
    return input.split('\n').filter(line => line).map(line => {
       const split = line.split(' ');
       return {
           condition: split[0],
           springs: split[1].split(',').map(string => Number(string))
       }
    });
}

function isConditionSuitable(condition) {
    if (map.has(condition)) {
        return map.get(condition);
    }
    if (condition.length < springsLength) {
        map.set(condition, 0);
        return 0;
    }
    const index = condition.indexOf('?');
    if (index >= 0) {
        let myCount = 0;
        const first = condition.substring(0, index);
        const second = condition.substring(index + 1);
        const firstCondition = trimCondition(first + '.' + second);
        const secondCondition = trimCondition(first + '#' + second);
        if (map.has(firstCondition)) {
            myCount += map.get(firstCondition);
        } else {
            myCount += isConditionSuitable(firstCondition);
        }
        if (map.has(secondCondition)) {
            myCount += map.get(secondCondition);
        } else {
            myCount += isConditionSuitable(secondCondition);
        }
        map.set(condition, myCount);
        return myCount;
    } else {
        const counts = condition.split('.').filter(string => string).map(string => string.length);
        if (springs.length !== counts.length) {
            // map.set(myKey, 0);
            return 0;
        } else {
            for (let i = 0; i < springs.length; i++) {
                if (counts[i] !== springs[i]) {
                    // map.set(myKey, 0);
                    return 0;
                }
            }
        }
        // map.set(myKey, 1);
        return 1;
    }
}

function trimCondition(condition) {
    condition = condition.replace(dotRegex, '.');
    let start = 0;
    let end = condition.length - 1;
    while (condition.charAt(start) === '.') {
        start++;
    }
    while (condition.charAt(end) === '.') {
        end--;
    }
    if (start !== 0 || end !== 0) {
        return condition.substring(start, end + 1);
    } else {
        return condition;
    }
}

part1().then(result => console.log(result));