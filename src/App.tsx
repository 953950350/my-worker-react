import React, { useState, useEffect } from 'react'
import TestComponent from './TestComponent'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // useEffect(() => {
  //   setInterval(() => {
  //     setCount(c => c + 1)
  //   }, 500)
  // }, [])

  function onValueChange (e: any) {
    // console.log(e, '---------onValueChange--------')
  }

  return (
    <div className="App">
      <header className="App-header">
        {count < 5 && <img src={logo} className="App-logo" alt="logo" />}
        {count >= 10 && <img src={logo} className="App-logo" alt="logo" />}
        <p>Hello Vite + React!</p>
        <TestComponent count={count} onValueChange={onValueChange} />
        {<p>
          <button onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>}
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            data-test={count}
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs{count}
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
