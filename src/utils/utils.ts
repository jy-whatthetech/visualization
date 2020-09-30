export function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// generate permutation of integers from 1 to n
export function generatePermutations(arr: string[]) {
  let rtn: string[][] = [];
  permuteHelper(arr, 0, rtn);
  return rtn;
}
function permuteHelper(arr: string[], start: number, rtn: string[][]) {
  if (start === arr.length - 1) {
    rtn.push([...arr]);
    return;
  }
  permuteHelper(arr, start + 1, rtn);
  for (let i = start + 1; i < arr.length; i++) {
    let temp = arr[i];
    arr[i] = arr[start];
    arr[start] = temp;

    permuteHelper(arr, start + 1, rtn);

    temp = arr[i];
    arr[i] = arr[start];
    arr[start] = temp;
  }
}
