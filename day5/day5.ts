import * as fs from 'fs';

type Map = {
    mappings: Mapping[]
    type: string
}

type Mapping = {
    destination: number;
    source: number;
    length: number;
}

((inputFile: string) => {
    const input = fs.readFileSync(inputFile, "utf-8").split("\n").filter(x => x.length > 1);
    var sourceValues = input[0].split(":")[1].trim().split(" ").map(Number);
    const mapData = input.slice(1).map(x => x.trim());

    const maps : Map[] = [];

    for (let i = 0; i < mapData.length; i++) {
        const potentialMap = mapData[i];
        if (potentialMap[potentialMap.length - 1] === ":") {
            let j = i + 1;
            const newMap: Map = {
                mappings: [],
                type: mapData[i]
            }
            while (j < mapData.length && mapData[j][mapData[j].length - 1] !== ":") {
                const [dest, src, len] = mapData[j].split(" ").map(x => Number(x.trim()));
                const newMapping : Mapping = {
                    destination: dest,
                    source: src,
                    length: len
                }

                newMap.mappings.push(newMapping);

                j++;
            }

            if (newMap.mappings.length > 0) {
                maps.push(newMap);
            }
            i = j - 1;
        }
        
    }

    for (const map of maps) {
        const newSourceVals : number[] = []
        for (const sourceVal of sourceValues) {
            var destVal = sourceVal;
            const mapping = map.mappings.find(x => (x.source + x.length - 1) >= sourceVal && x.source <= sourceVal);
            if (mapping !== undefined) {
                destVal = (sourceVal - mapping.source) + mapping.destination
            }

            newSourceVals.push(destVal)            
        }
        sourceValues = newSourceVals;
    }

    console.log(Math.min(...sourceValues))
    
})("./test-input.txt")

