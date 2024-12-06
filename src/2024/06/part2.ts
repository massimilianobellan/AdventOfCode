const loops: string[] = []

type Direction = '^' | '>' | 'v' | '<'

class Guard {
  x: number
  y: number
  direction: Direction

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
  hitObstacles: { x: number; y: number; direction: Direction }[] = []

  constructor(map: string[][], guard: Guard) {
    this.map = map
    this.guard = guard
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  getGuardFacingBlock() {
    const nextCoords = this.guard.getNextCoordinates(1)
    if (
      nextCoords.y >= this.map.length ||
      nextCoords.x >= this.map[0].length ||
      nextCoords.y < 0 ||
      nextCoords.x < 0
    ) {
      return undefined
    }
    return this.map[nextCoords.y][nextCoords.x]
  }

  async guardPath() {
    let isInInfiniteLoop = false
    while (
      this.guard.x <= this.map[0].length &&
      this.guard.y <= this.map.length
    ) {
      let facingCell = this.getGuardFacingBlock()

      if (facingCell === undefined) break

      while (
        facingCell !== undefined &&
        (facingCell.includes('#') || facingCell.includes('O'))
      ) {
        const hittingBlock = {
          x: this.guard.getNextCoordinates(1).x,
          y: this.guard.getNextCoordinates(1).y,
          direction: this.guard.direction,
        }

        // Check if block is hit a second time from the same direction
        if (
          this.hitObstacles.some(
            (block) =>
              block.x === hittingBlock.x &&
              block.y === hittingBlock.y &&
              block.direction === hittingBlock.direction
          )
        ) {
          isInInfiniteLoop = true
        }
        this.hitObstacles.push(hittingBlock)
        this.guard.rotate()
        facingCell = this.getGuardFacingBlock()
      }

      this.map[this.guard.y][this.guard.x] = 'X'

      if (isInInfiniteLoop) {
        break
      }

      this.guard.gotoNextSteps(1)
      // await this.delay(10)
      // this.printMap()
    }
    if (isInInfiniteLoop) return 'loop'
    return 'no-loop'
  }

  printMap() {
    console.clear()
    const currentMap = this.map
    currentMap[this.guard.y][this.guard.x] = this.guard.direction
    console.log(currentMap.map((row) => row.join('')).join('\n'))
    console.log(
      'Number of infinite loops: ',
      loops.filter((loop) => loop === 'loop').length
    )
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

for (let row = 0; row < parsedMap.length; row++) {
  for (let column = 0; column < parsedMap[0].length; column++) {
    const newMap = JSON.parse(JSON.stringify(parsedMap))
    if (newMap[row][column] === '#' || newMap[row][column] === '^') continue
    newMap[row][column] = 'O'
    let map = new Map(newMap, new Guard(startPosition.x, startPosition.y))
    loops.push(await map.guardPath())
  }
}

console.log(
  'Number of infinite loops: ',
  loops.filter((loop) => loop === 'loop').length
)
