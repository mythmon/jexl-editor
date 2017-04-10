import SpanMap from './SpanMap.js'
import {nextId} from './utils.js'

export class TokenSet {
  constructor (input) {
    this.tokens = parse(input)
    this.content = input
  }

  withTokenContent (id, newContent) {
    const newTokens = []
    for (const token of this.tokens) {
      if (token.id === id) {
        newTokens.push(token.withContent(newContent))
      } else {
        newTokens.push(token)
      }
    }
    return new TokenSet(unparse(newTokens))
  }

  map (func) {
    return this.tokens.map(func)
  }
}

class Node {
  constructor ({root = false, children = []}) {
    this.root = root
    this.children = children
  }
}

export function parse (input) {
  const tokenizer = new Tokenizer()
  tokenizer.addRule('number', /-?\d+(\.\d*)?/)
  tokenizer.addRule('operator', /[+*/-]/)
  tokenizer.addRule('whitespace', /\s/, {skip: true})
  return tokenizer.tokenize(input)
}

export function unparse (tokens) {
  const output = new SpanMap()

  for (const token of tokens) {
    output.set(token.span, token.content)
  }

  return output.toString()
}

class Token {
  constructor ({type, span, content}) {
    this.id = nextId()
    this.type = type
    this.span = span
    this.content = content
  }

  withContent (newContent) {
    return new Token({
      type: this.type,
      span: this.span,
      content: newContent
    })
  }
}

class Tokenizer {
  constructor () {
    this.rules = []
  }

  addRule (type, baseRegex, {skip = false} = {}) {
    const regex = new RegExp('^(' + baseRegex.source + ')(.*)')
    const rule = {regex, type, skip}
    this.rules.push(rule)
  }

  tokenize (input) {
    const tokens = []
    let left = 0

    if (input === undefined) {
      throw new Error('input is not defined')
    }

    let partialInput = input
    while (partialInput !== '') {
      let matched = false
      for (const {regex, type, skip} of this.rules) {
        const match = partialInput.match(regex)
        if (match) {
          const content = match[1]
          const span = [left, left + content.length]
          left = span[1]
          if (!skip) {
            tokens.push(new Token({type, content, span}))
          }
          partialInput = match[match.length - 1]
          matched = true
          break
        }
      }
      if (!matched) {
        throw new Error(`syntax error, could not match any rule at "${partialInput}".`)
      }
    }

    return tokens
  }
}
