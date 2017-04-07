import SpanMap from './SpanMap.js'
import {nextId} from './utils.js'

export class TokenSet {
  constructor ({input, tokens}) {
    if (input === undefined && tokens === undefined) {
      throw new Error('Must pass either input or tokens')
    }
    if (tokens) {
      this.tokens = tokens
      this.content = unparse(tokens)
    } else {
      this.tokens = parse(input)
      this.content = input
    }
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
    return new TokenSet({tokens: newTokens})
  }

  map (func) {
    return this.tokens.map(func)
  }
}

export function parse (input) {
  const tokenizer = new Tokenizer()
  tokenizer.addRule('char', /\d+/)
  tokenizer.addRule('char', /[\s\S]/)
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
    const spanLength = span[1] - span[0]
    if (content.length !== spanLength) {
      throw new Error(`Not implemented: no support for mismatched token sizes. Span is ${spanLength}, content is ${content.length}`)
    }
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

  addRule (type, baseRegex) {
    const regex = new RegExp('^(' + baseRegex.source + ')(.*)')
    const rule = {regex, type}
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
      for (const {regex, type} of this.rules) {
        const match = partialInput.match(regex)
        if (match) {
          const content = match[1]
          const span = [left, left + content.length]
          left = span[1]
          tokens.push(new Token({type, content, span}))
          partialInput = match[2]
          matched = true
          break
        }
      }
      if (!matched) {
        throw new Error(`syntax error, could not match any rule at "${partialInput}".`)
      }
    }

    return tokens.filter(token => token.content.trim() !== '')
  }
}
