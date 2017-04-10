import React, {Component, PropTypes as pt} from 'react'

import {TokenSet} from './parser.js'

export default class JEXLEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokenSet: new TokenSet('')
    }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput ({target: {value}}) {
    this.setState({
      tokenSet: new TokenSet(value)
    })
  }

  makeTokenOnChange (tokenId) {
    return (value) => {
      this.setState({
        tokenSet: this.state.tokenSet.withTokenContent(tokenId, value)
      })
    }
  }

  render () {
    const {tokenSet} = this.state
    return (
      <div>
        <div>
          <textarea onChange={this.handleInput} value={tokenSet.content} />
        </div>
        <div className="editor">
          {tokenSet.error
           ? <span className="error">Syntax error {tokenSet.error.toString()}</span>
           : tokenSet.map((token, i) => {
             const onChange = this.makeTokenOnChange(token.id)
             return <Token key={`token-${i}`} token={token} onChange={onChange} />
           })}
        </div>
      </div>
    )
  }
}

class Token extends Component {
  constructor (props) {
    super(props)
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput ({target: {value}}) {
    this.props.onChange(value)
  }

  render () {
    const {token} = this.props
    return (
      <span className="token">
        <input value={token.content} onChange={this.handleInput} />
        <span className="type">{token.type}</span>
      </span>
    )
  }
}

Token.propTypes = {
  onChange: pt.func.isRequired,
  token: pt.shape({
    content: pt.string.isRequired
  }).isRequired
}
