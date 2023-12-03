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

part1().then(result => console.log(result));