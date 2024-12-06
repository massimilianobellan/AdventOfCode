class Guard {
  x: number
  y: number
  direction: '^' | '>' | 'v' | '<'

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.direction = '^'
  }

  toString() {
    return `Currently at y: ${this.y} and x: ${this.x}`
  }

  getNextCoordinates(numberOfSteps: number) {
    switch (this.direction) {
      case '>':
        return { x: this.x + numberOfSteps, y: this.y }
      case 'v':
        return { x: this.x, y: this.y + numberOfSteps }
      case '<':
        return { x: this.x - numberOfSteps, y: this.y }
      case '^':
        return { x: this.x, y: this.y - numberOfSteps }
    }
  }

  rotate() {
    switch (this.direction) {
      case '>':
        this.direction = 'v'
        break
      case 'v':
        this.direction = '<'
        break
      case '<':
        this.direction = '^'
        break
      case '^':
        this.direction = '>'
        break
    }
  }

  gotoNextSteps(steps: number) {
    const nextCoordinates = this.getNextCoordinates(steps)
    this.x = nextCoordinates.x
    this.y = nextCoordinates.y
  }
}

class Map {
  map: string[][]
  guard: Guard

  constructor(map: string[][], guard: Guard) {
    this.map = map
    this.guard = guard
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  getGuardFacingBlock() {
    const nextCoords = this.guard.getNextCoordinates(1)
    if (nextCoords.y >= this.map.length || nextCoords.x >= this.map[0].length) {
      return undefined
    }
    return this.map[nextCoords.y][nextCoords.x]
  }

  async guardPath() {
    while (
      this.guard.x <= this.map[0].length &&
      this.guard.y <= this.map.length
    ) {
      let facingCell = this.getGuardFacingBlock()

      if (facingCell === undefined) break

      while (facingCell !== undefined && facingCell.includes('#')) {
        this.guard.rotate()
        facingCell = this.getGuardFacingBlock()
      }

      this.map[this.guard.y][this.guard.x] = 'X'

      this.guard.gotoNextSteps(1)
      // await this.delay(500)
      // this.printMap()
    }
    console.log(this.getX())
  }

  printMap() {
    console.clear()
    const currentMap = this.map
    currentMap[this.guard.y][this.guard.x] = this.guard.direction
    console.log(currentMap.map((row) => row.join('')).join('\n'))
  }

  getX() {
    return (
      this.map.reduce((prev, curr) => {
        const xInRow = curr.filter((cell) => cell === 'X').length
        return prev + xInRow
      }, 0) + 1
    )
  }
}

const input = (await Bun.file('./src/2024/06/input.txt').text()).split('\n')
const parsedMap = input.map((row) => row.split(''))
const startPosition = input
  .map((row, rowIndex) => {
    const column = row.split('').findIndex((cell) => cell === '^')
    if (column === -1) return undefined
    return { y: rowIndex, x: column }
  })
  .filter((entry) => entry !== undefined)[0]
const guard = new Guard(startPosition.x, startPosition.y)
const map = new Map(parsedMap, guard)
await map.guardPath()
