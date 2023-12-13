import { getInput } from '../utils/utils.js'

let map;
let arrangements;

async function part1() {
    let total = 0;
    const conditions = parseInput(await getInput(12));
    map = new Map();
    for (const condition of conditions) {
        arrangements = 0;
        isConditionSuitable(condition.condition, condition.springs);
        console.log(arrangements);
        total += arrangements;
    }
    return total;
}

function parseInput(input) {
    return input.split('\n').filter(line => line).map(line => {
       const split = line.split(' ');
       return {
           condition: trimCondition(split[0]),
           springs: split[1].split(',').map(string => Number(string))
       }
    });
}

function isConditionSuitable(condition, springs) {
    condition = trimCondition(condition);
    const index = condition.indexOf('?');
    if (index >= 0) {
        const first = condition.substring(0, index);
        const second = condition.substring(index + 1);
        isConditionSuitable(first + '.' + second, springs);
        isConditionSuitable(first + '#' + second, springs);
    } else {
        const key = createKey(condition, springs);
        let isSuitable;
        if (map.has(key)) {
            isSuitable = map.get(key);
        } else {
            isSuitable = true;
            const counts = condition.split('.').filter(string => string).map(string => string.length);
            if (springs.length !== counts.length) {
                isSuitable = false;
            } else {
                for (let i = 0; i < springs.length; i++) {
                    if (counts[i] !== springs[i]) {
                        isSuitable = false;
                        break;
                    }
                }
            }
            map.set(key, isSuitable);
        }
        if (isSuitable) {
            arrangements++;
        }
    }
}

function trimCondition(condition) {
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

function createKey(condition, springs) {
    return `${condition}-${springs.join('-')}`;
}

part1().then(result => console.log(result));