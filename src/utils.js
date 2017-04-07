export const nextId = (() => {
  let _next = 1
  return () => _next++
})()
