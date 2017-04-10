export default class SpanMap {
  constructor () {
    this.bits = new Map()
  }

  set (span, content) {
    this.bits.set(span, content)
  }

  toString () {
    let spans = Array.from(this.bits.keys())

    if (spans.length === 0) {
      return ''
    }

    // sort by first element of span
    spans.sort(([a], [b]) => {
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1
      } else {
        return 0
      }
    })
    // make sure no spans overlap
    for (let i = 0; i < spans.length - 1; i++) {
      const a = spans[i]
      const b = spans[i + 1]
      if (a[1] > b[0]) {
        throw new Error(`spans ${i} and ${i + 1} overlap`)
      }
    }
    // put them in their places
    const lastSpan = spans[spans.length - 1]
    const buffer = Array(lastSpan[1])
    let offset = 0

    for (let span of spans) {
      const text = this.bits.get(span)
      for (let i = 0; i < text.length; i++) {
        buffer[i + span[0] + offset] = text[i]
      }
      offset += text.length - (span[1] - span[0])
    }

    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === undefined) {
        buffer[i] = ' '
      }
    }
    return buffer.join('')
  }
}
