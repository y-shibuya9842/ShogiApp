import React, { useState } from 'react';
import { Piece, PieceType } from './Piece';

type Square = { piece: string | null; owner: "self" | "opponent" | null };
type Board = Square[][];

const initialBoard: Board = [
  [{ piece: "香車", owner: "self" }, { piece: "桂馬", owner: "opponent" }, { piece: "銀将", owner: "opponent" }, { piece: "金将", owner: "opponent" }, { piece: "王将", owner: "opponent" }, { piece: "金将", owner: "opponent" }, { piece: "銀将", owner: "opponent" }, { piece: "桂馬", owner: "opponent" }, { piece: "香車", owner: "opponent" }],
  [{ piece: null, owner: null }, { piece: "飛車", owner: "opponent" }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: "金将", owner: "self" }, { piece: null, owner: null }, { piece: "角行", owner: "opponent" }, { piece: null, owner: null }],
  [{ piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: "歩", owner: "opponent" }, { piece: null, owner: null }],
  [{ piece: "歩", owner: "self" }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }],
  [{ piece: null, owner: null }, { piece: "竜馬", owner: "self" }, { piece: null, owner: null }, { piece: "竜王", owner: "self" }, { piece: null, owner: null }, { piece: "飛車", owner: "opponent" }, { piece: null, owner: null }, { piece: "角行", owner: "opponent" }, { piece: null, owner: null }],
  [{ piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: null, owner: null }],
  [{ piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: null, owner: null }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: "歩", owner: "self" }, { piece: null, owner: null }],
  [{ piece: null, owner: null }, { piece: "角行", owner: "self" }, { piece: null, owner: null }, { piece: "金将", owner: "opponent" }, { piece: "金将", owner: "opponent" }, { piece: null, owner: null }, { piece: null, owner: null }, { piece: "飛車", owner: "self" }, { piece: null, owner: null }],
  [{ piece: "香車", owner: "self" }, { piece: "桂馬", owner: "self" }, { piece: "銀将", owner: "self" }, { piece: "金将", owner: "self" }, { piece: "玉将", owner: "self" }, { piece: "金将", owner: "self" }, { piece: "銀将", owner: "self" }, { piece: "桂馬", owner: "self" }, { piece: "香車", owner: "self" }],
];



const Board: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [highlightedSquares, setHighlightedSquares] = useState<{ x: number; y: number }[]>([]);
  
  const [selectedPiece, setSelectedPiece] = useState<{
    x: number;
    y: number;
    piece: PieceType | null;
    owner: "self" | "opponent" | null;
} | null>(null);

const [moveableSquares, setMoveableSquares] = useState<{ x: number; y: number }[]>([]);


  

  const handleSquareClick = (x: number, y: number) => {
    const clickedSquare = board[y][x];

    // 駒を選択した場合
    if (clickedSquare.piece && (!selectedPiece || selectedPiece.x !== x || selectedPiece.y !== y)) {
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
    // 移動先を選択した場合
    else if (selectedPiece) {
      if(selectedPiece && selectedPiece.x === x && selectedPiece.y === y){
        setSelectedPiece(null);
        setMoveableSquares([]);
      }
      //console.log(selectedPiece)
      const isMoveable = moveableSquares.some((square) => square.x === x && square.y === y);
      if (isMoveable) {
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
      }
    }
  };


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
