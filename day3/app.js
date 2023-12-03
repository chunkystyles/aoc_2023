import { getInput } from '../utils/utils.js'

async function part1() {
    const input = await getInput(3);
    const schematic = parseInput(input);
    let total = 0;
    for (let i = 0; i < schematic.length; i++) {
        let isNumber = false;
        let isAdjacent = false;
        let numberString = '';
        for (let j = 0; j < schematic[i].length; j++) {
            const char = schematic[i][j];
            if (isNumber) {
                if (isDigit(char)) {
                    numberString += char;
                    if (!isAdjacent) {
                        isAdjacent = checkAdjacency(schematic, i, j);
                    }
                } else {
                    if (isAdjacent) {
                        total += Number(numberString);
                    }
                    isNumber = false;
                    isAdjacent = false;
                    numberString = '';
                }
            } else {
                if (isDigit(char)) {
                    isNumber = true;
                    numberString = char;
                    isAdjacent = checkAdjacency(schematic, i, j);
                }
            }
        }
        if (isNumber && isAdjacent) { // When you get to the end of a column, need to check for an adjacent number
            total += Number(numberString);
        }
    }
    return total;
}

async function part2() {
    const input = await getInput(3);
    const schematic = parseInput(input);
    let total = 0;
    for (let i = 0; i < schematic.length; i++) {
        for (let j = 0; j < schematic[i].length; j++) {
            if (isGearSymbol(schematic[i][j])) {
                const numbers = getNumbers(schematic, i, j);
                if (numbers.length === 2) {
                    total += numbers[0].value * numbers[1].value;
                }
            }
        }
    }
    return total;
}

function getNumbers(schematic, rowIndex, columnIndex) {
    let numbers = [];
    for (let i = -1; i <= 1; i++) {
        const newRow = rowIndex + i;
        if (newRow >= 0 && newRow < schematic.length) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) { // No need to check the character itself
                    const newColumn = columnIndex + j;
                    if (numbers.length > 0 && numbers[numbers.length - 1].row === newRow && numbers[numbers.length - 1].right >= newColumn) {
                        continue;
                    }
                    if (newColumn >= 0 && newColumn < schematic[newRow].length) {
                        if (isDigit(schematic[newRow][newColumn])) {
                            if (numbers.length === 2) {
                                return [];
                            }
                            numbers.push(getNumberFromStartPoint(schematic, newRow, newColumn));
                        }
                    }
                }
            }
        }
    }
    return numbers;
}

function getNumberFromStartPoint(schematic, row, column) {
    let left = column;
    let right = column;
    while (left - 1 >= 0 && isDigit(schematic[row][left - 1])) {
        left--;
    }
    while (right + 1 < schematic[row].length && isDigit(schematic[row][right + 1])) {
        right++;
    }
    return {
        right: right,
        row: row,
        value: Number(schematic[row].slice(left, right + 1).join(''))
    }
}

function checkAdjacency(schematic, rowIndex, columnIndex) {
    for (let i = -1; i <= 1; i++) {
        const newRow = rowIndex + i;
        if (newRow >= 0 && newRow < schematic.length) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) { // No need to check the character itself
                    const newColumn = columnIndex + j;
                    if (newColumn >= 0 && newColumn < schematic[newRow].length) {
                        if (isSymbol(schematic[newRow][newColumn])) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function parseInput(input) {
    return input.split('\n').map(line => line.split(''));
}

function isDigit(char) {
    return char >= '0' && char <= '9';
}

function isSymbol(char) {
    return char !== '.' && !isDigit(char);
}

function isGearSymbol(char) {
    return char ===  '*';
}

part2().then(result => console.log(result));