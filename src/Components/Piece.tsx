export type PieceType = "歩" | "飛車" | "竜王" | "角行" | "竜馬" | "桂馬" | "香車" | "金将" | "銀将" | "王将" | "玉将" | "成銀" | "成桂" | "成香" | "と金" | null;

type Square = { piece: string | null; owner: "self" | "opponent" | null };

export type Board = Square[][];

export class Piece {
    static getMoveableSquares(piece: PieceType, x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        let moves: { x: number, y: number }[] = [];
        switch(piece) {
            case "歩":
                moves = this.getFuMove(x, y, owner, board);
                break;
            case "飛車":
                moves = this.getHisyaMove(x, y, owner, board);
                break;
            case "竜王":
                // 成り後の竜王は飛車の動き + 王将の動き
                moves = [
                    ...this.getHisyaMove(x, y, owner, board),
                    ...this.getOshoMove(x, y, owner, board),
                ];
                break;
            case "角行":
                moves = this.getKakuMove(x, y, owner, board);
                break;
            case "竜馬":
                // 成り後の竜馬は角行の動き + 王将の動き
                moves = [
                    ...this.getKakuMove(x, y, owner, board),
                    ...this.getOshoMove(x, y, owner, board),
                ];
            break;
            case "桂馬":
                moves = this.getKeimaMove(x, y, owner, board);
                break;
            case "香車":
                moves = this.getKyosyaMove(x, y, owner, board);
                break;
            case "金将":
            case "成銀":
            case "成桂":
            case "成香":
            case "と金":
                moves = this.getKinMove(x, y, owner, board);
                break;
            case "銀将":
                moves = this.getGinMove(x, y, owner, board);
                break;
            case "王将":
            case "玉将":
                moves = this.getOshoMove(x, y, owner, board);
                break;
            default:
                break;
        }

        return moves;
    }

    private static getFuMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];
        if (owner === "self" && y > 0 && (board[y - 1][x].piece === null || board[y - 1][x].owner !== owner)) {
            moves.push({ x, y: y - 1 }); // 上方向に1マス進む
        }
        if (owner === "opponent" && y < 8 && (board[y + 1][x].piece === null || board[y + 1][x].owner !== owner)) {
            moves.push({ x, y: y + 1 }); // 下方向に1マス進む
        }
        return moves;
    }

    private static getHisyaMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];

        for (let i = 1; i < 9; i++) {
            if (y - i >= 0) {
                // 上方向に移動
                if (board[y - i][x].piece === null) {
                    moves.push({ x, y: y - i });
                } else if(board[y - i][x].owner !== owner){
                    moves.push({ x, y: y - i });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }
        for (let i = 1; i < 9; i++) {
            if (y + i < 9) {
                // 下方向に移動
                if (board[y + i][x].piece === null) {
                    moves.push({ x, y: y + i });
                } else if(board[y + i][x].owner !== owner){
                    moves.push({ x, y: y + i });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }

        // 横方向（右と左）
        for (let i = 1; i < 9; i++) {
            if (x - i >= 0) {
                // 左方向に移動
                if (board[y][x - i].piece === null) {
                    moves.push({ x: x - i, y });
                } else if(board[y][x - i].owner !== owner){
                    moves.push({ x: x - i, y });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }
        for (let i = 1; i < 9; i++) {
            if (x + i < 9) {
                // 右方向に移動
                if (board[y][x + i].piece === null) {
                    moves.push({ x: x + i, y });
                } else if(board[y][x + i].owner !== owner){
                    moves.push({ x: x + i, y });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }
        
        return moves;
    }

    private static getKakuMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];
    
        for (let i = 1; i < 9; i++) {
            if (y - i >= 0 && x + i < 9) {
                // 右上方向に移動
                if (board[y - i][x + i].piece === null) {
                    moves.push({ x: x + i, y: y - i });
                } else if(board[y - i][x + i].owner !== owner){
                    moves.push({ x: x + i, y: y - i });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }
        for (let i = 1; i < 9; i++) {
            if (y + i < 9 && x + i < 9) {
                // 右下方向に移動
                if (board[y + i][x + i].piece === null) {
                    moves.push({ x: x + i, y: y + i });
                } else if(board[y + i][x + i].owner !== owner){
                    moves.push({ x: x + i, y: y + i });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }

        for (let i = 1; i < 9; i++) {
            if (x - i >= 0 && y - i >= 0) {
                // 左上方向に移動
                if (board[y - i][x - i].piece === null) {
                    moves.push({ x: x - i, y: y - i });
                } else if(board[y - i][x - i].owner !== owner){
                    moves.push({ x: x - i, y: y - i });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }
        for (let i = 1; i < 9; i++) {
            if (x - i >= 0 && y + i < 9) {
                // 左下方向に移動
                if (board[y + i][x - i].piece === null) {
                    moves.push({ x: x - i, y: y + i });
                } else if(board[y + i][x - i].owner !== owner){
                    moves.push({ x: x - i, y: y + i });
                    break;
                }else {
                break;  // 自分の駒があればそれ以上進めない
                }
            }
        }
    
        return moves;
    }

    private static getKyosyaMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];
    
        
        // 上方向
        for (let i = 1; i < 9; i++) {
            if (owner === "self") {
                if (y - i >= 0) {
                    // 上方向に移動
                    if (board[y - i][x].piece === null) {
                        moves.push({ x, y: y - i });
                    } else if (board[y - i][x].owner !== owner) {
                        moves.push({ x, y: y - i });
                        break;
                    } else {
                    break;  // 自分の駒があればそれ以上進めない
                    }
                }
            }
            if (owner === "opponent") {
                if (y + i <= 8) {
                    // 上方向に移動
                    if (board[y + i][x].piece === null) {
                        moves.push({ x, y: y + i });
                    } else if (board[y + i][x].owner !== owner) {
                        moves.push({ x, y: y + i });
                        break;
                    } else {
                    break;  // 自分の駒があればそれ以上進めない
                    }
                }
            }
        }
        return moves;
    }

    private static getKeimaMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];
    
        const directions = [
            { dx: 1, dy: 2 },
            { dx: -1, dy: 2 },
            { dx: 1, dy: -2 },
            { dx: -1, dy: -2 }
        ];

        directions.forEach(({ dx, dy }) => {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
                if (board[newY][newX].piece === null || board[newY][newX].owner !== owner) {
                moves.push({ x: newX, y: newY });
                }
            }
        });

        return moves;
  }


    private static getGinMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];
    
        if (owner === "self") {
            const directions = [
                { dx: 0, dy: -1 }, // 縦
                { dx: 1, dy: 1 }, { dx: -1, dy: 1 }, // 斜め
                { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
            ];
            directions.forEach(({ dx, dy }) => {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
                    if (board[newY][newX].piece === null || board[newY][newX].owner !== owner) {
                    moves.push({ x: newX, y: newY });
                    }
                }
            });
        }
        if (owner === "opponent") {
            const directions = [
                { dx: 0, dy: 1 }, // 縦
                { dx: 1, dy: 1 }, { dx: -1, dy: 1 }, // 斜め
                { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
            ];
            directions.forEach(({ dx, dy }) => {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
                    if (board[newY][newX].piece === null || board[newY][newX].owner !== owner) {
                    moves.push({ x: newX, y: newY });
                    }
                }
            });
        }

        return moves;
    }

    private static getKinMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];

        if (owner === "self") {
            const directions = [
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, // 横
                { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // 縦
                { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
            ];
            directions.forEach(({ dx, dy }) => {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
                    if (board[newY][newX].piece === null || board[newY][newX].owner !== owner) {
                    moves.push({ x: newX, y: newY });
                    }
                }
            });
        }
        if (owner === "opponent") {
            const directions = [
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, // 横
                { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // 縦
                { dx: 1, dy: 1 }, { dx: -1, dy: 1 }
            ];
            directions.forEach(({ dx, dy }) => {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
                    if (board[newY][newX].piece === null || board[newY][newX].owner !== owner) {
                    moves.push({ x: newX, y: newY });
                    }
                }
            });
        }

        return moves;
    }
    

    private static getOshoMove(x: number, y: number, owner: "self" | "opponent", board: Board): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];
    
        const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, // 横
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // 縦
            { dx: 1, dy: 1 }, { dx: -1, dy: 1 }, // 斜め
            { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
        ];

        directions.forEach(({ dx, dy }) => {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
                if (board[newY][newX].piece === null || board[newY][newX].owner !== owner) {
                moves.push({ x: newX, y: newY });
                }
            }
        });

        return moves;
    }
}