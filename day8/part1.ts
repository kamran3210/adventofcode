import * as fs from 'fs';

const input: string = fs.readFileSync('./day8/input.txt', 'utf-8').trim();

class Node {
    public left: Node | undefined;
    public right: Node | undefined;
    constructor(public name: string) {}
}

let nodes = new Map<string, Node>();
let directions: string = '';
parseInput(input);
let current = nodes.get('AAA')!;
let i = 0;
let steps = 0;
while (current.name !== 'ZZZ') {
    const direction = directions.charAt(i);
    current = direction === 'L'
        ? current.left!
        : current.right!;
    i = (i + 1) % directions.length;
    steps++;
}
console.log(steps);

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
    }
}