import React, { useState } from 'react';
import { Piece, PieceType } from './Piece';

type Square = { piece: string | null; owner: "self" | "opponent" | null };
type CapturedPieces = { //持ち駒オブジェクト
  [owner in "self" | "opponent"]: { [piece: string]: number };
};
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

const initialCapturedPieces: CapturedPieces = {
  self: {
    飛車: 0,
    角行: 0,
    金将: 0,
    銀将: 0,
    桂馬: 0,
    香車: 0,
    歩: 0,
  },
  opponent: {
    飛車: 0,
    角行: 0,
    金将: 0,
    銀将: 0,
    桂馬: 0,
    香車: 0,
    歩: 0,
  },
};


const Board: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<"self" | "opponent">("self");
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>(initialCapturedPieces);
  const [selectedCapturedPiece, setSelectedCapturedPiece] = useState<string | null>(null);
  
  const [selectedPiece, setSelectedPiece] = useState<{
    x: number;
    y: number;
    piece: PieceType | null;
    owner: "self" | "opponent" | null;
  } | null>(null);

  const [moveableSquares, setMoveableSquares] = useState<{ x: number; y: number }[]>([]);


  

  const handleSquareClick = (x: number, y: number) => {
    const clickedSquare = board[y][x];

    if(selectedCapturedPiece === null){
      //駒を選択しているか判定
      if(selectedPiece){
        //移動可能なマスか判定
        const isMoveable = moveableSquares.some((square) => square.x === x && square.y === y);
        if (isMoveable) {
          //クリックしたマスに相手の駒があるか判定
          if((clickedSquare.owner ==="self" && selectedPiece.owner ==="opponent") || (clickedSquare.owner ==="opponent" && selectedPiece.owner ==="self")){
            checkPromotePiece(y, turn);  //成ることができるか判定
            //(取った相手の駒を持ち駒に入れる処理を書く)
            const newCapturedPieces = { ...capturedPieces };
            let pieceName = ""
            if(clickedSquare.piece === "竜王"){
              pieceName = "飛車"
            }
            else if(clickedSquare.piece === "竜馬"){
              pieceName = "角行"
            }
            else if(clickedSquare.piece === "成銀"){
              pieceName = "銀将"
            }
            else if(clickedSquare.piece === "成桂"){
              pieceName = "桂馬"
            }
            else if(clickedSquare.piece === "成香"){
              pieceName = "香車"
            }
            else if(clickedSquare.piece === "と金"){
              pieceName = "歩"
            }
            else if(clickedSquare.piece === "王将" || clickedSquare.piece === "玉将"){
              endGame(clickedSquare.piece)
            }
            else{
              pieceName = clickedSquare.piece as string;
            }
            if (selectedPiece.owner === "self") {
              newCapturedPieces.self[pieceName]++;
            } else {
              newCapturedPieces.opponent[pieceName]++;
            }
            setCapturedPieces(newCapturedPieces);
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
            checkPromotePiece(y, turn);  //成ることができるか判定
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
    }
    else{
      if(clickedSquare.owner === turn){ //自分の駒を選択したとき
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
        setSelectedCapturedPiece(null);
      }
      else if(!clickedSquare.owner){
        const newBoard = board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            if (rowIndex === y && colIndex === x) {
              return { piece: selectedCapturedPiece, owner: turn };
            }
            return square;
          })
        );
        
        const newCapturedPieces = { ...capturedPieces };
        if (turn === "self") {
          newCapturedPieces.self[selectedCapturedPiece]--;
        } else {
          newCapturedPieces.opponent[selectedCapturedPiece]--;
        }
        setBoard(newBoard);
        setSelectedPiece(null);
        setMoveableSquares([]);
        setSelectedCapturedPiece(null);
        setTurn(turn === "self" ? "opponent" : "self"); // ターン交代
      }
    }
    
  };

  const checkPromotePiece = (y: number, turn: "self" | "opponent") => {
    let isPromotable: boolean = false;
    if(selectedPiece){
      if(selectedPiece.piece === "歩" || selectedPiece.piece === "飛車" || selectedPiece.piece === "角行" || selectedPiece.piece === "銀将" || selectedPiece.piece === "桂馬" || selectedPiece.piece === "香車"){
        if(turn === "self"){
          if(selectedPiece?.y <= 2 || y <= 2){
            isPromotable = window.confirm("成りますか");
          }
        }
        else{
          if(selectedPiece?.y >= 6 || y >= 6){
            isPromotable = window.confirm("成りますか");
          }
        }

        if(isPromotable){
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

  const handleCapturedPieces = (owner: string, piece: string, count: number) => {
    if(owner === turn && count !== 0){
      setSelectedPiece(null);
      setMoveableSquares([]);
      if(piece !== "歩"){ //駒が置かれていないすべてのマスをハイライト
        const moves: { x: number, y: number }[] = [];
        board.forEach((row, rowIndex) => {
          row.forEach((square, colIndex) => {
            // 駒がない場合
            if (!square.piece) {
              if(piece === "香車"){
                if (
                  (turn === "self" && rowIndex !== 0) || 
                  (turn === "opponent" && rowIndex !== 8)
                ) {
                  moves.push({ x: colIndex, y: rowIndex });
                }
              }
              else if(piece === "桂馬"){
                if (
                  (turn === "self" && rowIndex !== 0 && rowIndex !== 1) || 
                  (turn === "opponent" && rowIndex !== 8 && rowIndex !== 7)
                ) {
                  moves.push({ x: colIndex, y: rowIndex });
                }
              }
              else{
                moves.push({ x: colIndex, y: rowIndex });
              }
            }
          });
        });
        setMoveableSquares(moves)
        setSelectedCapturedPiece(piece)
      }
      else{ //列に自分の歩がないマスをハイライト
        const moves: { x: number, y: number }[] = [];
        for (let x = 0; x < 9; x++) {
          // 列に自分の歩があるか確認
          const hasFuInColumn = board.some(
            (row) => row[x].piece === "歩" && row[x].owner === turn // 自分の持ち駒の場合
          );
      
          if (!hasFuInColumn) {
            // 二歩でない列に限定して、その列の空マスを追加
            board.forEach((row, rowIndex) => {
              if (
                (turn === "self" && rowIndex !== 0 && !row[x].piece) || 
                (turn === "opponent" && rowIndex !== 8 && !row[x].piece)
              ) {
                moves.push({ x, y: rowIndex });
              }
            });
          }
        }
        setMoveableSquares(moves);
        setSelectedCapturedPiece(piece);
      }
    }
    else{
      setSelectedPiece(null);
      setMoveableSquares([]);
      setSelectedCapturedPiece(null)
    }
  }

  const endGame = (player:string) => {
    if(player === "王将"){
      alert("あなたの勝ちです")
    }
    else{
      alert("あなたの負けです")
    }
  }


  return (
    <div className="app">
      <div className="board-container">
        {/* 相手の持ち駒 */}
        <div className="captured-pieces">
          <h3>相手の持ち駒</h3>
          {Object.entries(capturedPieces.opponent).map(([piece, count]) => (
            <div className="captured-piece" key={piece} onClick={() => handleCapturedPieces("opponent", piece, count)}>
              {piece}: {count}
            </div>
          ))}
        </div>
  
        {/* 盤面 */}
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
                    <span className={square.owner === "opponent" ? "opponent-piece" : "self-piece"}>{square.piece}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
  
        {/* 自分の持ち駒 */}
        <div className="captured-pieces">
          <h3>自分の持ち駒</h3>
          {Object.entries(capturedPieces.self).map(([piece, count]) => (
            <div className="captured-piece" key={piece} onClick={() => handleCapturedPieces("self", piece, count)}>
              {piece}: {count}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  
  export default Board;
