const input = (await Bun.file('./src/2024/06/test.txt').text()).split('\n')

class Guard {
  x: number
  y: number
  currentDirection: '>' | 'v' | '<' | '^' = '>'

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.currentDirection = '^'
  }

  toString() {
    return `Currently at y: ${this.y} and x: ${this.x}`
  }

  getNextCoordinates() {
    switch (this.currentDirection) {
      case '>':
        return { x: this.x + 1, y: this.y }
      case 'v':
        return { x: this.x, y: this.y + 1 }
      case '<':
        return { x: this.x - 1, y: this.y }
      case '^':
        return { x: this.x, y: this.y - 1 }
    }
  }

  rotate() {
    switch (this.currentDirection) {
      case '>':
        this.currentDirection = 'v'
        break
      case 'v':
        this.currentDirection = '<'
        break
      case '<':
        this.currentDirection = '^'
        break
      case '^':
        this.currentDirection = '>'
        break
    }
  }

  gotoNextStep() {
    const nextCoordinates = this.getNextCoordinates()
    this.x = nextCoordinates.x
    this.y = nextCoordinates.y
  }
}

const map = input.map((row) => row.split(''))

const startPosition = input
  .map((row, rowIndex) => {
    const column = row.split('').findIndex((cell) => cell === '^')
    if (column === -1) return undefined
    return { y: rowIndex, x: column }
  })
  .filter((entry) => entry !== undefined)[0]

const guard = new Guard(startPosition.x, startPosition.y)

while (guard.x <= map[0].length && guard.y <= map.length) {
  map[guard.y][guard.x] = 'X'

  const nextCoords = guard.getNextCoordinates()
  if (nextCoords.x >= map[0].length || nextCoords.y >= map.length) break

  const facingBlock = map[nextCoords.y][nextCoords.x]

  if (facingBlock === '#') {
    guard.rotate()
  }

  guard.gotoNextStep()
}

const rejoinedMap = map.map((row) => row.join('')).join('\n')
const amountOfX = map.reduce((prev, curr) => {
  const xInRow = curr.filter(cell => cell === 'X')
  return prev + xInRow.length
}, 0)

console.log(rejoinedMap)
console.log(amountOfX)
