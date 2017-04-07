import '../node_modules/react/dist/react.js' /* global React */
import '../node_modules/react-dom/dist/react-dom.js' /* global ReactDOM */

import JEXLEditor from './JEXLEditor.js'

document.addEventListener('DOMContentLoaded', () => {
  let target = document.querySelector('#target')

  if (!target) {
    target = document.createElement('div')
    target.id = 'target'
    document.body.appendChild(target)
  }

  ReactDOM.render(<JEXLEditor />, target)
})
