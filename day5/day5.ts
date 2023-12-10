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

type SourceValue = {
    start: number;
    end: number;
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

    const minp1 = getMinLocation(maps, calculateSourceValues([...sourceValues], false));
    console.log(minp1);   

    const minp2 = getMinLocation(maps, calculateSourceValues([...sourceValues], true));
    console.log(minp2);
})("./input.txt")


function calculateSourceValues(originalValues: number[], isRange: boolean) : SourceValue[] {
    const sourceValues : SourceValue[] = [];

    for (let i = 0; i < originalValues.length; isRange ? i += 2 : i++) {
        const seedStart = originalValues[i];
        const seedEnd = isRange ? seedStart + (originalValues[i + 1] - 1) : seedStart;

        const value: SourceValue = {            
            start: seedStart,
            end: seedEnd,
        };

        sourceValues.push(value);
    }

    return sourceValues;
}


function getMinLocation(maps: Map[], sourceValues: SourceValue[]) : number {
    var minLocation = Infinity;
    for (const sourceVal of sourceValues) {
        for (let i = sourceVal.start; i <= sourceVal.end; i++) {
            let destinationValue = i;
            for (const map of maps) {            
                const mapping = map.mappings.find(x => (x.source + x.length - 1) >= destinationValue && x.source <= destinationValue);
                if (mapping !== undefined) {
                    destinationValue = (destinationValue - mapping.source) + mapping.destination;                
                }  
            }
            minLocation = Math.min(destinationValue, minLocation)
        }
    }
    return minLocation;
}

