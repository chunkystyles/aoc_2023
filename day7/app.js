import { getInput, writeJsonFile } from '../utils/utils.js'

async function part1() {
    const hands = parseInput(await getInput(7)).sort(compareHands);
    let total = 0;
    for (let i = 0; i < hands.length; i++) {
        total += (i + 1) * hands[i].bid;
    }
    return total;
}

async function part2() {
    const hands = parseInput(await getInput(7)).sort(compareHands);
    let total = 0;
    for (let i = 0; i < hands.length; i++) {
        total += (i + 1) * hands[i].bid;
    }
    return total;
}

function parseInput(input) {
    const hands = [];
    input.split('\n').forEach(line => {
        const parts = line.split(' ');
        const cards = parts[0].split('').map(card => mapCardToNumber(card));
        if (cards.length > 0) {
            const bid = Number(parts[1]);
            const counts = new Map();
            cards.forEach(card => {
                if (counts.has(card)) {
                    counts.set(card, counts.get(card) + 1);
                } else {
                    counts.set(card, 1);
                }
            });
            const countsArray = Array.from(counts, ([key, value]) => ({card:key, count:value})).sort(compareCardCount).reverse();
            const converted = convertJokers(countsArray, cards);
            hands.push({
                cards: cards,
                bid: bid,
                tier: getHandTier(converted)
            });
        }
    });
    return hands
}

function convertJokers(countsArray, cards) {
    let jokers = cards.filter(card => card === 1).length;
    if (jokers > 0) {
        let index;
        for (let i = 0; i < countsArray.length; i++) {
            if (countsArray[i].card === 1) {
                index = i;
                break;
            }
        }
        if (countsArray.length > 1) {
            countsArray.splice(index, 1);
            countsArray[0].count += jokers;
        }
    }
    return countsArray;
}

function mapCardToNumber(card) {
    if (card <= '9' && card >= '2') {
        return Number(card);
    } else if (card === 'T') {
        return 10;
    } else if (card === 'J') {
        return 1;
    } else if (card === 'Q') {
        return 12;
    } else if (card === 'K') {
        return 13;
    } else if (card === 'A') {
        return 14;
    }
}

function getHandTier(counts) {
    if (counts[0].count === 5) {
        return 6;
    } else if (counts[0].count === 4) {
        return 5;
    } else if (counts[0].count === 3) {
        if (counts[1].count ===  2) {
            return 4;
        } else {
            return 3;
        }
    } else if (counts[0].count === 2) {
        if (counts[1].count === 2) {
            return 2;
        } else {
            return 1;
        }
    } else {
        return 0;
    }
}

function compareHands(a, b) {
    const tierCompare = compareNumbers(a.tier, b.tier);
    if (tierCompare !== 0) {
        return tierCompare;
    } else {
        for (let i = 0; i < a.cards.length; i++) {
            const cardCompare = compareNumbers(a.cards[i], b.cards[i]);
            if (cardCompare !== 0) {
                return cardCompare;
            }
        }
        return 0;
    }
}

function compareNumbers(a, b) {
    if (a > b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        return -1;
    }
}

function compareCardCount(a, b) {
    return compareNumbers(a.count, b.count);
}

part2().then(result => console.log(result));