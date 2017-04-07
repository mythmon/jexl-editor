// Based on https://github.com/lovasoa/react-contenteditable
// Apache Licensed, for more info see
// https://github.com/lovasoa/react-contenteditable/blob/master/LICENSE

import '../node_modules/react/dist/react.js' /* global React */

const {PropTypes: pt} = React

export default class ContentEditable extends React.Component {
  constructor () {
    super()
    this.emitChange = this.emitChange.bind(this)
  }

  render () {
    const { tagName, html } = this.props
    const otherProps = Object.assign({}, this.props)
    delete otherProps.tagName
    delete otherProps.html

    return React.createElement(
      tagName || 'div',
      Object.assign({}, otherProps, {
        ref: (e) => { this.htmlEl = e },
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {__html: html}
      }),
      this.props.children)
  }

  shouldComponentUpdate (nextProps) {
    // We need not rerender if the change of props simply reflects the user's
    // edits. Rerendering in this case would make the cursor/caret jump.
    return (
      // Rerender if there is no element yet... (somehow?)
      !this.htmlEl ||
      // ...or if html really changed... (programmatically, not by user edit)
      (nextProps.html !== this.htmlEl.innerHTML &&
        nextProps.html !== this.props.html) ||
      // ...or if editing is enabled or disabled.
      this.props.disabled !== nextProps.disabled
    )
  }

  componentDidUpdate () {
    if (this.htmlEl && this.props.html !== this.htmlEl.innerHTML) {
      // Perhaps React (whose VDOM gets outdated because we often prevent
      // rerendering) did not update the DOM. So we update it manually now.
      this.htmlEl.innerHTML = this.props.html
    }
  }

  emitChange (evt) {
    if (!this.htmlEl) return
    var html = this.htmlEl.innerHTML
    if (this.props.onChange && html !== this.lastHtml) {
      evt.target = { value: html }
      this.props.onChange(evt)
    }
    this.lastHtml = html
  }
}

ContentEditable.propTypes = {
  html: pt.string.isRequired,
  tagName: pt.string,
  onBlur: pt.func,
  onChange: pt.func,
  disabled: pt.bool,
  children: pt.object
}
