const input = (await Bun.file('./src/2024/06/input.txt').text()).split('\n')

class Guard {
  x: number
  y: number
  currentDirection: '>' | 'v' | '<' | '^' = '>'
  map: string[][]

  constructor(x: number, y: number, map: string[][]) {
    this.x = x
    this.y = y
    this.currentDirection = '^'
    this.map = map
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

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async guardPath() {
    while (this.x <= this.map[0].length && this.y <= this.map.length) {
      this.map[this.y][this.x] = 'X'

      const nextCoords = this.getNextCoordinates()
      if (nextCoords.x >= this.map[0].length || nextCoords.y >= this.map.length)
        break

      const facingBlock = this.map[nextCoords.y][nextCoords.x]

      if (facingBlock.includes('#')) {
        this.map[nextCoords.y][nextCoords.x] = '\x1b[36m#\x1b[0m'
        this.rotate()
      }

      this.gotoNextStep()
      // Animation
      // await this.delay(5);
      // console.clear()
      // console.log(`\r${this.rejoinMap()}\n\nTotal X: ${this.amountOfX()}`)
    }
    console.log(`\r${this.rejoinMap()}\n\nTotal X: ${this.amountOfX() + 1}`)
  }

  rejoinMap() {
    const currentMap = this.map
    currentMap[this.y][this.x] = this.currentDirection
    return this.map.map((row) => row.join('')).join('\n')
  }

  amountOfX() {
    return this.map.reduce((prev, curr) => {
      const xInRow = curr.filter((cell) => cell === 'X')
      return prev + xInRow.length
    }, 0)
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

const guard = new Guard(startPosition.x, startPosition.y, map)
await guard.guardPath()
