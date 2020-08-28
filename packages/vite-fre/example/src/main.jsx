import { h, render, useState, useReducer } from 'fre'
// import { App } from './app'
import './index.css'
function reducer(state, action) {
    switch (action.type) {
      case 'up':
        return { count: state.count + 1 }
      case 'down':
        return { count: state.count - 1 }
    }
  }
  
  function App() {
    const [state, dispatch] = useReducer(reducer, { count: 1 })
    return (
      <div>
        {state.count}
        <button onClick={() => dispatch({ type: 'up' })}>+</button>
        <button onClick={() => dispatch({ type: 'down' })}>+</button>
      </div>
    )
  }
render(<App />, document.getElementById('root'))
