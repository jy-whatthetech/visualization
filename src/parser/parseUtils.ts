// directed pairs
// [[2,1],[3,1],[1,4]]
export function parsePairs(input: string, directed = true): any {
  // trim whitespace
  input = input.trim();
  if (input.length < 2) throw new Error("Input too short");
  input = input.slice(1, input.length - 1);

  const links = [];
  const nodeSet = new Set<string>();

  let startInd = 0;
  let nextOpenBracket = input.indexOf("[", startInd);
  while (nextOpenBracket !== -1) {
    const nextCloseBracket = input.indexOf("]", nextOpenBracket);
    if (nextCloseBracket === -1) throw new Error("No matching close bracket");

    try {
      const pair = getDirectedPair(
        input.slice(nextOpenBracket + 1, nextCloseBracket),
        nodeSet
      );
      links.push(pair);
    } catch (ex) {
      throw ex;
    }

    startInd = nextCloseBracket;
    nextOpenBracket = input.indexOf("[", startInd);
  }

  if (links.length === 0) throw new Error("No pairs found.");

  return { nodeSet: nodeSet, links: links };
}

function getDirectedPair(s: string, nodeSet: Set<string>) {
  s = s.trim();
  if (s.length === 0 || s.indexOf(",") === -1)
    throw new Error("pair needs two arguments");
  const sp = s.split(",");
  const src = sp[0].trim();
  const trg = sp[1].trim();

  if (src.length === 0 || trg.length === 0)
    throw new Error("src and trg need to be non-empty");

  nodeSet.add(src);
  nodeSet.add(trg);

  return { source: src, target: trg };
}

// adjacency array
// array where arr[i] is an array of adjacent nodes
