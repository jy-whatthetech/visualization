// directed pairs
// [[2,1],[3,1],[1,4]]
export function parsePairs(input: string, directed = true) {
  // trim whitespace
  input = input.trim();
  input = input.slice(1, input.length - 1);

  return input;
}

// adjacency array
// array where arr[i] is an array of adjacent nodes
