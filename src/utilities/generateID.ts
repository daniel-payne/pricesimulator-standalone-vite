export default function generateID() {
  const numberOne = (Math.random() * 46656) | 0
  const numberTwo = (Math.random() * 46656) | 0

  const numberThree = new Date().getTime()

  const stringOne = ("000" + numberOne.toString(36)).slice(-3)
  const stringTwo = ("000" + numberTwo.toString(36)).slice(-3)

  const stringThree = ("000000" + numberThree.toString(36)).slice(-6)

  return (stringOne + stringTwo + "-" + stringThree).toUpperCase()
}
