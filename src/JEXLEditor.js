import '../node_modules/react/dist/react.js' /* global React */

import ContentEditable from './ContentEditable.js'
import {TokenSet} from './parser.js'

const {Component, PropTypes: pt} = React

export default class JEXLEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokenSet: new TokenSet({input: ''})
    }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput ({target: {value}}) {
    this.setState({
      tokenSet: new TokenSet({input: value})
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
          {tokenSet.map((token, i) => {
            const onChange = this.makeTokenOnChange(token.id)
            return <Token key={`token-${i}`} token={token} onChange={onChange} />
          })}
        </div>
        <div>
          {tokenSet.content}
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
        <ContentEditable html={token.content} onChange={this.handleInput} />
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
