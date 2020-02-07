import React, { useState } from 'react';
import './App.css';
import Snake from './Snake';

function App() {

  const [snakeDots, setSnake] = useState([
    [0, 0],
    [2, 0]
  ]);


  return (
    <div className="game-area">
      <Snake snake={snakeDots} />
    </div>
  );
}

export default App;
