import * as fs from 'fs';


type Tree = {
    nodes: Node[]
}

type Node = {
    left: Node | undefined
    right: Node | undefined
    label: string | string[]
}

((inputFile: string) => {
    const input = fs.readFileSync(inputFile, "utf-8");
    const lines = input.split("\n");
    const instructions = lines[0].trim().split("");

    const tree : Tree = { nodes: [] };

    const metadata = lines.slice(2).map(x => [x.split("=")[0].trim(), x.split("=")[1]]);
    const treeData = metadata.map(x => [x[0], x[1].replace(/[() ]/g, "").split(",")]);
    for (const [nodeLabel, children] of treeData) {
        const node : Node = { left: undefined, right: undefined, label: nodeLabel.toString().trim() };

        node.left = { left: undefined, right: undefined, label: children[0].trim() }
        node.right = { left: undefined, right: undefined, label: children[1].trim() }

        tree.nodes.push(node);      
    }

    for (const node of tree.nodes) {
        const left = tree.nodes.find(x => node.left?.label == x.label);
        const right = tree.nodes.find(x => node.right?.label == x.label);

        node.left = left;
        node.right = right;        
    }

    var currentNode : Node | undefined  = tree.nodes[0];
    var steps = 0;

    const aNodes = tree.nodes.filter(x => endsWith(x.label, "A"))

    var minSteps : number[] = [];

    for (const node of aNodes) {
        var steps = 0;
        currentNode = node;
        while (currentNode != undefined && !endsWith(currentNode.label, "Z")) {
            var currentInstruction = instructions[steps % instructions.length];
            if (currentInstruction == "L") {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
            steps++;
        }

        minSteps.push(steps)
    }
   
    var stepCount = minSteps.reduce((a, b) => (a * b) / gcd(a, b))

    console.log(stepCount)

})("input.txt")

function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
}

function endsWith(input: string | string[], target: string) : boolean {
    return input[input.length - 1] === target
}