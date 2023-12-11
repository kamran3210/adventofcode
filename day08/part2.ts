import * as fs from 'fs';

const input: string = fs.readFileSync('./day8/input.txt', 'utf-8').trim();

class Node {
    public left: Node | undefined;
    public right: Node | undefined;
    constructor(public name: string) {}
}

let nodes = new Map<string, Node>();
let directions: string = '';
const starts: Node[] = [];
parseInput(input);

let i = 0;
let steps = 0;
const currents = Array.from(starts);
const stepsToZ = Array<number>(currents.length).fill(0);
while (!stepsToZ.every(Boolean)) {
    const direction = directions.charAt(i);
    for (let j = 0; j < currents.length; j++) {
        currents[j] = direction === 'L'
            ? currents[j].left!
            : currents[j].right!;
        if (currents[j].name.endsWith('Z')) {
            stepsToZ[j] = steps + 1;
        }
    }
    i = (i + 1) % directions.length;
    steps++;
}
console.log(stepsToZ.reduce((acc, x) => lcm(acc, x)));

function parseInput(input: string) {
    let nodesString: string;
    [directions, nodesString] = input.split(/\r?\n\r?\n/);
    for (const line of nodesString.split(/\r?\n/)) {
        const name = line.slice(0, 3);
        const leftName = line.slice(7, 10);
        const rightName = line.slice(12, 15);
        
        const node = nodes.get(name) ?? new Node(name);
        nodes.set(name, node);

        let left = nodes.get(leftName) ?? new Node(leftName);
        node.left = left;
        nodes.set(leftName, left);

        let right = nodes.get(rightName) ?? new Node(rightName);
        node.right = right;
        nodes.set(rightName, right);

        if (name.endsWith('A')) {
            starts.push(node);
        }
    }
}

function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);   
}