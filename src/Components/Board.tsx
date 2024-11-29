import React, { useState } from 'react';
import { Piece, PieceType } from './Piece';

type Square = { piece: string | null; owner: "self" | "opponent" | null };
type Board = Square[][];

const initialBoard: Board = [
  [{ piece: "香車", owner: "opponent" }, { piece: "桂馬", owner: "opponent" }, { piece: "銀将", owner: "opponent" }, { piece: "金将", owner: "opponent" }, { piece: "王将", owner: "opponent" }, { piece: "金将", owner: "opponent" }, { piece: "銀将", owner: "opponent" }, { piece: "桂馬", owner: "opponent" }, { piece: "香車", owner: "opponent" }],
  [{ piece: null, owner: null }, { piece: "飛車", owner: "opponent" }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: "角行", owner: "opponent" }, { piece: null, owner: null }],
  [{ piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }],
  [{ piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }],
  [{ piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }],
  [{ piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }],
  [{ piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }],
  [{ piece: null, owner: null }, { piece: "角行", owner: "self" }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: "飛車", owner: "self" }, { piece: null, owner: null }],
  [{ piece: "香車", owner: "self" }, { piece: "桂馬", owner: "self" }, { piece: "銀将", owner: "self" }, { piece: "金将", owner: "self" }, { piece: "玉将", owner: "self" }, { piece: "金将", owner: "self" }, { piece: "銀将", owner: "self" }, { piece: "桂馬", owner: "self" }, { piece: "香車", owner: "self" }],
];



const Board: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<"self" | "opponent">("self");
  
  const [selectedPiece, setSelectedPiece] = useState<{
    x: number;
    y: number;
    piece: PieceType | null;
    owner: "self" | "opponent" | null;
  } | null>(null);

  const [moveableSquares, setMoveableSquares] = useState<{ x: number; y: number }[]>([]);


  

  const handleSquareClick = (x: number, y: number) => {
    const clickedSquare = board[y][x];

    
    //駒を選択しているか判定
    if(selectedPiece){
      //移動可能なマスか判定
      const isMoveable = moveableSquares.some((square) => square.x === x && square.y === y);
      if (isMoveable) {
        //クリックしたマスに相手の駒があるか判定
        if((clickedSquare.owner ==="self" && selectedPiece.owner ==="opponent") || (clickedSquare.owner ==="opponent" && selectedPiece.owner ==="self")){
          checkChangePiece(y, turn);  //成ることができるか判定
          const newBoard = board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              if (rowIndex === y && colIndex === x) {
                return { piece: selectedPiece.piece, owner: selectedPiece.owner };
              }
              if (rowIndex === selectedPiece.y && colIndex === selectedPiece.x) {
                return { piece: null, owner: null };
              }
              return square;
            })
          );
          setBoard(newBoard);
          setSelectedPiece(null);
          setMoveableSquares([]);
          setTurn(turn === "self" ? "opponent" : "self"); // ターン交代
        }
        else{
          checkChangePiece(y, turn);  //成ることができるか判定
          const newBoard = board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              if (rowIndex === y && colIndex === x) {
                return { piece: selectedPiece.piece, owner: selectedPiece.owner };
              }
              if (rowIndex === selectedPiece.y && colIndex === selectedPiece.x) {
                return { piece: null, owner: null };
              }
              return square;
            })
          );
          setBoard(newBoard);
          setSelectedPiece(null);
          setMoveableSquares([]);
          setTurn(turn === "self" ? "opponent" : "self"); // ターン交代
        }
      }
      else{
        //選択した駒を再度クリックしたか判定
        if(selectedPiece.x === x && selectedPiece.y === y){
          setSelectedPiece(null);
          setMoveableSquares([]);
        }
        else{
          //クリックした駒が自分の駒か判定
          if(clickedSquare.owner === selectedPiece.owner){
            const moves = Piece.getMoveableSquares(
              clickedSquare.piece as PieceType,
              x,
              y,
              clickedSquare.owner || "self",
              board
            );
            setSelectedPiece({
              x,
              y,
              piece: clickedSquare.piece as PieceType,
              owner: clickedSquare.owner,
            });
            setMoveableSquares(moves);
            
          }
        }
      }
    }
    else{
      if(clickedSquare.owner === turn){
        const moves = Piece.getMoveableSquares(
          clickedSquare.piece as PieceType,
          x,
          y,
          clickedSquare.owner || "self",
          board
        );
        setSelectedPiece({
          x,
          y,
          piece: clickedSquare.piece as PieceType,
          owner: clickedSquare.owner,
        });
        setMoveableSquares(moves);
      }
    }
    
  };

  const checkChangePiece = (y: number, turn: "self" | "opponent") => {
    let isChange: boolean = false;
    if(selectedPiece){
      if(selectedPiece.piece === "歩" || selectedPiece.piece === "飛車" || selectedPiece.piece === "角行" || selectedPiece.piece === "銀将" || selectedPiece.piece === "桂馬" || selectedPiece.piece === "香車"){
        if(turn === "self"){
          if(selectedPiece?.y <= 2 || y <= 2){
            isChange = window.confirm("成りますか");
          }
        }
        else{
          if(selectedPiece?.y >= 6 || y >= 6){
            isChange = window.confirm("成りますか");
          }
        }

        if(isChange){
          if(selectedPiece.piece === "歩"){
            selectedPiece.piece = "と金";
          }
          else if(selectedPiece.piece === "飛車"){
            selectedPiece.piece = "竜王"
          }
          else if(selectedPiece.piece === "角行"){
            selectedPiece.piece = "竜馬"
          }
          else if(selectedPiece.piece === "銀将"){
            selectedPiece.piece = "成銀"
          }
          else if(selectedPiece.piece === "桂馬"){
            selectedPiece.piece = "成桂"
          }
          else if(selectedPiece.piece === "香車"){
            selectedPiece.piece = "成香"
          }
        }
      }
    }
  }


  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const isHighlighted = moveableSquares.some(
            (move) => move.x === colIndex && move.y === rowIndex
          );

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`square ${isHighlighted ? 'highlighted' : ''}`}
              onClick={() => handleSquareClick(colIndex, rowIndex)}
            >
              {square.piece && (
                <span className={square.owner === "opponent" ? "opponent-piece" : "self-piece"}>
                  {square.piece}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
  
  export default Board;
