import React from 'react'
// import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import render from './custom-render/render'
import Container from './custom-render/Container'

const p = {
  setData(state: any, callback: () => void) {
    console.log(state)
    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  },
};

const container = new Container(p)
render(<App />, container)
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )
