import React from 'react'
import ReactDOM from 'react-dom'

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
