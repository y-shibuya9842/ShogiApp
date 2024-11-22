import React from 'react'
import './App.css'
import './Components/Board.css';
import Board from "./Components/Board"

const App: React.FC =() => {

  return (
    <div>
      <h1>将棋アプリ</h1>
      <Board/>
    </div>
  )
}

export default App
