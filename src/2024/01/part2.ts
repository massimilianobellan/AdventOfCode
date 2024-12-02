const input = await Bun.file('./src/2024/01/input.txt').text()

console.time('day1')

const list1: number[] = []
const list2: number[] = []

input.split('\n').forEach((e) => {
  const [element1, element2] = e.split('   ')
  list1.push(Number(element1))
  list2.push(Number(element2))
})

list1.sort()
list2.sort()

const list2Occurances = new Map<number, number>()

list2.forEach((e) => {
  const occurances = list2Occurances.get(e) ?? 0
  list2Occurances.set(e, occurances + 1)
})

let total = 0
list1.forEach((list1e, index) => {
  const happenedInList2 = list2Occurances.get(list1e) ?? 0
  total = total + list1e * happenedInList2
})

console.log(total)

console.timeEnd('day1')
