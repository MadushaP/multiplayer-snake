import React, { useState, useEffect } from 'react';
import Snake from './Snake';

function App() {

  function keypress({ key }) {
   console.log(key);
  }

  useEffect(() => {
    window.addEventListener('keydown', keypress);
    return () => {
      window.addEventListener('keydown', keypress);
    };
  }, []);


  const [snakeDots, setSnake] = useState([
    [0, 0],
    [2, 0],
    [4, 0],
    [6, 0]
  ]);



  return (
    <div className="game-area" > >
      <Snake snake={snakeDots} />
    </div>
  );
}

export default App;
