const [list1, list2] = (await Bun.file('./src/2024/05/input.txt').text()).split(
  '\n\n'
)

const ordering = list1
  .split('\n')
  .map((e) => e.split('|').map((e) => Number(e)))
const update = list2.split('\n').map((e) => e.split(',').map((e) => Number(e)))

const invalidLines: number[][] = []
for (let i = 0; i < update.length; i++) {
  let isLineValid = true
  for (let j = 0; j < update[i].length - 1; j++) {
    const valid = isXBeforeY(update[i][j], update[i][j + 1])
    if (!valid) {
      isLineValid = false
      break
    }
  }
  if (!isLineValid) {
    invalidLines.push(reOrderLine(update[i]))
  }
}

const total = invalidLines.reduce((prev, curr) => {
  return prev + curr[(curr.length - 1) / 2]
}, 0)

console.log(total)

function isXBeforeY(x: number, y: number) {
  const found = ordering.find(
    (e) => (e[0] === x && e[1] === y) || (e[0] === y && e[1] === x)
  )
  if (!found) return false
  return found[0] === x
}

function reOrderLine(line: number[]) {
  return line.sort((a, b) => {
    const order = ordering.find(
      (e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)
    )
    if (!order) throw new Error(`Can't find order for ${a} and ${b}`)
    if (order[0] === a) return -1
    return 1
  })
}
