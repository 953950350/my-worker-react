import React from 'react'
// import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import render from './custom-render/render'
import Container from './custom-render/Container'
import DomRender from './dom-render'

let domRender: DomRender

const p = {
  setData(state: any, callback: () => void) {
    if (!domRender) {
      domRender = new DomRender(state, container)
    } else {
      domRender.update(state)
    }
    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  },
};

const container = new Container(p)

// ReactDOM.render(<App />, document.getElementById('root'))

render(<App />, container)
