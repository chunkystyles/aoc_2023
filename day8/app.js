import { getInput, writeJsonFile } from '../utils/utils.js'
import lcm from 'compute-lcm'

async function part1() {
    const input = parseInput1(await getInput(8));
    let currentNode = 'AAA';
    const endNode = 'ZZZ';
    const instructions = input.instructions;
    const instructionsLength = instructions.length;
    const nodes = input.nodes;
    let step = 0;
    while(true) {
        const instruction = instructions[step++ % instructionsLength];
        const node = nodes.get(currentNode);
        const nextNode = node[instruction];
        if (nextNode === endNode) {
            break;
        } else {
            currentNode = nextNode;
        }
    }
    return step;
}

function parseInput1(input) {
    const lines = input.split('\n');
    const instructions = lines[0].split('');
    const nodes = new Map();
    for (let i = 2; i < lines.length; i++) {
        let line = lines[i];
        if (line) {
            line = line.replaceAll(' ', '').replaceAll(')', '').replaceAll('(', '');
            const part1 = line.split('=');
            const part2 = part1[1].split(',');
            nodes.set(part1[0], { L: part2[0], R: part2[1] });
        }
    }
    return {
        instructions: instructions,
        nodes: nodes
    }
}

async function part2() {
    const input = parseInput2(await getInput(8));
    const instructions = input.instructions;
    const instructionsLength = instructions.length;
    const startNodes = input.startNodes;
    const nodes = input.nodes;
    const counts = [];
    for (let i = 0; i < startNodes.length; i++) {
        let currentNode = startNodes[i];
        let step = 0;
        while(true) {
            const instruction = instructions[step++ % instructionsLength];
            const node = nodes.get(currentNode);
            const nextNode = node[instruction];
            if (isEndNode(nextNode)) {
                break;
            } else {
                currentNode = nextNode;
            }
        }
        counts.push(step);
    }
    return lcm(counts);
}

function parseInput2(input) {
    const lines = input.split('\n');
    const instructions = lines[0].split('');
    const startNodes = [];
    const nodes = new Map();
    for (let i = 2; i < lines.length; i++) {
        let line = lines[i];
        if (line) {
            line = line.replaceAll(' ', '').replaceAll(')', '').replaceAll('(', '');
            const part1 = line.split('=');
            const part2 = part1[1].split(',');
            const nodeId = part1[0];
            if (isStartNode(nodeId)) {
                startNodes.push(nodeId);
            }            
            nodes.set(nodeId, { L: part2[0], R: part2[1] });
        }
    }
    return {
        instructions: instructions,
        startNodes: startNodes,
        nodes: nodes
    }
}

function isStartNode(node) {
    return node.charAt(2) === 'A';
}

function isEndNode(node) {
    return node.charAt(2) === 'Z';
}

part2().then(result => console.log(result));