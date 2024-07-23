import { useState } from 'react';

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const [isReversed, setIsReversed] = useState(false);
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; 
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1); 
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {        
    setIsReversed(!isReversed);    
  }

  const moves = history.map((squares, move) => {
    let description;

    var cell_ind = null;
    if (move > 0)
    {
      for (let i=0; i < 9; i++)
        if (!(history[move][i] === history[move-1][i])){
          cell_ind = i;
          break;
        }
    }

    if (move === history.length - 1){
      description = 'You are at move #' + move;
    }      
    else if (move > 0) {
      var row_ind = Math.floor(cell_ind / 3)
      var col_ind = cell_ind % 3;
      description = 'Go to move #' + move + '(' + row_ind + ', ' + col_ind + ')';
    } else {
      description = 'Go to game start';
    }
    return (
        <li key={move}>
          {move === history.length - 1 ? (
            <div>{description}</div>
          ) : (
            <button onClick={() => jumpTo(move)}>{description}</button>
          )}
        </li>
    );
  });

  if (isReversed)
    moves.reverse()

  let sortButtonText = isReversed ? 'Sort ascending' : 'Sort descending';

  return (
    <div className="game"> 
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => sortMoves()}>{sortButtonText}</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i){
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext){
      nextSquares[i] = "X";
    }
    else{
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner){
    status = "Winner: " + winner.player;
  } 
  else if (squares.includes(null)) {
      status = "Next player: " + (xIsNext ? "X" : "O");
  }
  else {
    status = "Game over. Result is Draw!";
  }

  const row_inds = Array(3).fill(0);  
  const col_inds = Array(3).fill(0);  

  for (let i =0; i < 3; i++){
    row_inds[i] = i;
    col_inds[i] = i;
  }
  
  const rows = row_inds.map(row_ind => {    
    const rows = col_inds.map(col_ind =>{
      const cell_ind = row_ind * 3 + col_ind;      
      var isHighlighted = false;
      if (winner)
        isHighlighted = winner.line.includes(cell_ind)
      return <Square value={squares[cell_ind]} isHighlighted={isHighlighted} onSquareClick={() => handleClick(cell_ind)}/>
    });
    
    return(
      <div className="board-row">
        {rows}
      </div>
    )
  });

  return (
    <>
    <div className="status">{status}</div>
    {rows}
    </>);
}

function Square({value, isHighlighted, onSquareClick}) {
  return <>
    {isHighlighted ? (
      <button className="highlighted-square" onClick={onSquareClick}>
        {value}
      </button>
      ) : (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    )}
    </>  
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i=0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])          
      return {'player': squares[a], 'line': lines[i]};  
  }
  return null;
}