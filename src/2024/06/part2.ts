const input = (await Bun.file('./src/2024/06/test.txt').text()).split('\n')

type DirectionBlock = '>' | 'v' | '<' | '^'
class Guard {
  x: number
  y: number
  currentDirection: DirectionBlock
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

  printMap() {
    console.clear()
    console.log(`\r${this.rejoinMap()}\n\n`)
  }


  getNextCoordinates(numberOfSteps: number) {
    switch (this.currentDirection) {
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
    const nextCoordinates = this.getNextCoordinates(1)
    this.x = nextCoordinates.x
    this.y = nextCoordinates.y
  }

  getNextBlock(numberOfBlocks: number) {
    const nextCoords = this.getNextCoordinates(numberOfBlocks)
    if (nextCoords.y >= this.map.length || nextCoords.x >= this.map[0].length ) return undefined
    return this.map[nextCoords.y][nextCoords.x]
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async guardPath(map: string[][]) {
    while (this.x <= map[0].length && this.y <= map.length) {
      let facingBlock = this.getNextBlock(1)
      
      if (facingBlock === undefined)
        break

      while (facingBlock !== undefined && (facingBlock.includes('#')  || facingBlock.includes("O"))) {
        this.rotate()
        facingBlock = this.getNextBlock(1)
      }

      map[this.y][this.x] = "X"

      this.gotoNextStep()
      // Animation
      await this.delay(10);
      this.printMap()
    }
  }

  // brute force bcause I hate myself
  async testAllBlocks(){
    for (let y = 0; y < this.map.length; y++) {
      for ( let x = 0; x < this.map[0].length; x++) {
        if (this.map[y][x] === "#") {
          continue;
        }
        this.map[y][x] = "O"
        await this.guardPath(this.map)
        this.printMap()
      }
    }
  }

  rejoinMap() {
    const currentMap = this.map
    currentMap[this.y][this.x] = this.currentDirection
    return currentMap.map((row) => row.join('')).join('\n')
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
await guard.testAllBlocks()
console.log("Done")