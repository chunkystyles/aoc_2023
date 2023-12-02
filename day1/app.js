import { getInput } from '../utils/utils.js'

const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

async function part1() {
    const input = await getInput(1);
    const split = input.split('\n');
    let total = 0;
    for (const line of split) {
        let firstFound = false;
        let secondFound = false;
        let firstDigit = '';
        let secondDigit = '';
        for (let i = 0; i < line.length; i++) {
            const digit = line[i];
            if (digit >= '0' && digit <= '9') {
                if (!firstFound) {
                    firstDigit = digit;
                    firstFound = true;
                } else {
                    secondDigit = digit;
                    secondFound = true;
                }
            }
        }
        let number;
        if (!firstFound) {
            number = 0;
        } else if (!secondFound) {
            number = Number(firstDigit + firstDigit);
        } else {
            number = Number(firstDigit + secondDigit);
        }
        total += number;
    }
    return total;
}

async function part2() {
    const input = await getInput(1);
    const split = input.split('\n');
    let total = 0;
    split.forEach(line => {
        let firstFound = false;
        let secondFound = false;
        let isAlpha = false;
        let firstDigit = '';
        let secondDigit = '';
        let word = '';
        let filteredWords;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            let digit;
            let digitFound = false;
            if (char >= '0' && char <= '9') {
                if (isAlpha) {
                    isAlpha = false;
                    word = '';
                }
                digit = char;
                digitFound = true;
            } else {
                if (isAlpha) {
                    word += char;
                    filteredWords = filteredWords.filter(s => s.startsWith(word));
                    if (filteredWords.length === 0) {
                        filteredWords = numberWords.filter(s => s.startsWith(char));
                        i -= (word.length - 1);
                        isAlpha = false;
                        word = '';
                    } else if (filteredWords.length === 1 && word === filteredWords[0]) {
                        i -= (word.length - 1);
                        digit = (numberWords.indexOf(word) + 1).toString();
                        digitFound = true;
                        isAlpha = false;
                        word = '';
                    }
                } else {
                    filteredWords = numberWords.filter(s => s.startsWith(char));
                    if (filteredWords.length > 0) {
                        isAlpha = true;
                        word = char;
                    }
                }
            }
            if (digitFound) {
                if (!firstFound) {
                    firstDigit = digit;
                    firstFound = true;
                } else {
                    secondDigit = digit;
                    secondFound = true;
                }
            }
        }
        if (!firstFound) {
            console.log(`ERROR on line ${line}`);
        } else if (!secondFound) {
            total += Number(firstDigit + firstDigit);
        } else {
            total += Number(firstDigit + secondDigit);
        }
    });
    return total;
}

part2().then(result => console.log(result));