const [list1, list2] = (await Bun.file('./src/2024/05/input.txt').text()).split(
  '\n\n'
)

const ordering = list1
  .split('\n')
  .map((e) => e.split('|').map((e) => Number(e)))
const update = list2.split('\n').map((e) => e.split(',').map((e) => Number(e)))

const validMiddleNumber: number[] = []
for (let i = 0; i < update.length; i++) {
  let isLineValid = true
  for (let j = 0; j < update[i].length - 1; j++) {
    const valid = isXBeforeY(update[i][j], update[i][j + 1])
    const name = `${update[i][j]} is before ${update[i][j + 1]}? ${valid} `
    if (!valid) {
      isLineValid = false
      break
    }
  }
  if (isLineValid) {
    validMiddleNumber.push(update[i][Math.ceil((update[i].length - 1) / 2)])
  }
}

const total = validMiddleNumber.reduce((prev, curr) => prev + curr, 0)
console.log(total)

function isXBeforeY(x: number, y: number) {
  const found = ordering.find(
    (e) => (e[0] === x && e[1] === y) || (e[0] === y && e[1] === x)
  )
  if (!found) return false
  return found[0] === x
}
