import * as fs from 'fs';

type Node = {
    left: Node | undefined
    right: Node | undefined
    label: string 
}

((inputFile: string) => {
    const input = fs.readFileSync(inputFile, "utf-8");
    const lines = input.split("\n");
    const instructions = lines[0].trim().split("");

    const nodes = parseNodes(lines);
    const aNodes = nodes.filter(x => endsWith(x.label, "A"))

    var aaaSteps = 0;
    var minGhostSteps = 1
    for (const node of aNodes) {
        var steps = 0;
        var currentNode = node;
        while (currentNode != undefined && !endsWith(currentNode.label, "Z")) {
            var currentInstruction = instructions[steps % instructions.length];
            if (currentInstruction == "L") {
                currentNode = currentNode.left!;
            } else {
                currentNode = currentNode.right!;
            }
            steps++;
        }

        if (node.label === "AAA") {
            aaaSteps = steps;
        }

        minGhostSteps = (steps * minGhostSteps) / gcd(steps, minGhostSteps)
    }
   
    console.log(`Answer 1: ${aaaSteps}`);
    console.log(`Answer 2: ${minGhostSteps}`);

})("input.txt")

function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
}

function endsWith(input: string | string[], target: string) : boolean {
    return input[input.length - 1] === target
}

function parseNodes(lines: string[]) : Node[] {
    const metadata = lines.slice(2).map(x => [x.split("=")[0].trim(), x.split("=")[1]]);
    const treeData = metadata.map(x => [x[0], x[1].replace(/[() ]/g, "").split(",")]);

    var nodes = []

    for (const [nodeLabel, children] of treeData) {
        const node: Node = { left: undefined, right: undefined, label: nodeLabel.toString().trim() };

        node.left = { left: undefined, right: undefined, label: children[0].trim() };
        node.right = { left: undefined, right: undefined, label: children[1].trim() };

        nodes.push(node);
    }

    for (const node of nodes) {
        const left = nodes.find(x => node.left?.label == x.label);
        const right = nodes.find(x => node.right?.label == x.label);

        node.left = left;
        node.right = right;
    }

    return nodes;
}
