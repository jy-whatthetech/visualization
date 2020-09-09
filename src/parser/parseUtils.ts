// directed pairs
// [[2,1],[3,1],[1,4]]
export function parsePairs(input: string, directed = true): any {
  // trim whitespace
  // TODO: ERROR HANDLING
  input = input.trim();
  input = input.slice(1, input.length - 1);

  const links = [];
  const nodeSet = new Set<string>();

  let startInd = 0;
  let nextOpenBracket = input.indexOf("[", startInd);
  while (nextOpenBracket !== -1) {
    const nextCloseBracket = input.indexOf("]", nextOpenBracket);
    const pair = getDirectedPair(
      input.slice(nextOpenBracket + 1, nextCloseBracket),
      nodeSet
    );
    links.push(pair);

    startInd = nextCloseBracket;
    nextOpenBracket = input.indexOf("[", startInd);
  }

  return { nodeSet: nodeSet, links: links };
}

function getDirectedPair(s: string, nodeSet: Set<string>) {
  s = s.trim();
  const sp = s.split(",");
  const src = sp[0].trim();
  const trg = sp[1].trim();

  nodeSet.add(src);
  nodeSet.add(trg);

  return { source: src, target: trg };
}

// adjacency array
// array where arr[i] is an array of adjacent nodes
