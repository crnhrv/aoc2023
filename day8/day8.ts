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
        console.log(node.left?.label.length, node.right?.label.length)
        const left = tree.nodes.find(x => node.left?.label == x.label);
        const right = tree.nodes.find(x => node.right?.label == x.label);

        console.log(left, right)

        node.left = left;
        node.right = right;        
    }


    var currentNode : Node | undefined  = tree.nodes[0];
    var steps = 0;

    while (currentNode != undefined && currentNode.label !== "ZZZ") {
        var currentInstruction = instructions[steps % instructions.length];
        if (currentInstruction == "L") {
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }


        steps++;
    }

    console.log(steps);



})("test-input2.txt")