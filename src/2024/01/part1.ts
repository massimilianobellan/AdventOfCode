const input = await Bun.file('./src/2024/01/input.txt').text()

const list1: number[] = []
const list2: number[] = []

input.split('\n').forEach((e) => {
  const [element1, element2] = e.split('   ')
  list1.push(Number(element1))
  list2.push(Number(element2))
})

list1.sort()
list2.sort()

let total = 0
list1.forEach((list1e, index) => {
  total = total + Math.abs(list1e - list2[index])
})

console.log(total)
