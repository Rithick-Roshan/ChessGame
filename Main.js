document.addEventListener('DOMContentLoaded',()=>{
    let board=null;
    const game =new Chess();
    const moveHistory=document.getElementById('move-history');
    let moveCount=1;
    let userColor='w';
    let audio= new Audio("audio.mp3");
    
    const makeRandomMove = () => {
        const possibleMoves = game.moves();
        if (game.game_over()) {
            alert("Checkmate!");
        } else {
            // Prioritize capturing moves
            const captureMoves = possibleMoves.filter(move => move.includes('x'));
            let move;
            if (captureMoves.length > 0) {
                const randomIndex = Math.floor(Math.random() * captureMoves.length);
                move = captureMoves[randomIndex];
            } else {
                const randomIndex = Math.floor(Math.random() * possibleMoves.length);
                move = possibleMoves[randomIndex];
            }
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount);
            moveCount++;
        }
    };
     

    const recordMove=(move,count)=>{
           const formateMove = count % 2 ===1 ?`${Math.ceil(count/2)}.${move}`: `${move} -`;
           moveHistory.textContent+= formateMove+' ';
           moveHistory.scrollTop=moveHistory.scrollHeight;
    };

    const onDragStart=(source ,piece)=>{
        return !game.game_over()&& piece.search(userColor)===0;

    };

    const onDrop=(source,target)=>{
        const move=game.move({
            from:source,
            to:target,
            prmotion:'q',
        });
        if(move===null) return 'snapback';
        window.setTimeout(makeRandomMove,250);
        recordMove(move.san,moveCount)
        moveCount++;
    }

    

    const onSnapEnd=()=>{
       board.position(game.fen());
    };
    
    const boardConfiguration={
        showNotification:true,
        draggable:true,
        position:'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed:'fast',
        snapBackspeed:500,
        snapSpeed:100,
    };

    board=Chessboard('board', boardConfiguration);

    document.querySelector('.play-again').addEventListener('click',()=>{
        game.reset();
        board.start();
        moveHistory.textContent=' ';
        moveCount=1;
        userColor='w';


    });
    document.querySelector('.set-pos').addEventListener('click',()=>{
        const fen=prompt("Enter thr FEN notation for the desired position!");
        if(fen!=null)
        {
            if(game.load(fen)){
                board.position(fen);
                moveHistory.textContent=''
                moveCount=1;
                userColor='w';
            }
            else{
                alert("invalid fen");
            }
        }

    });
    document.querySelector('.flip-board').addEventListener('click',()=>{
        board.flip();
        makeRandomMove();
        userColor=userColor==='w'?'b':'w';
    })
  
    document.querySelector('.audio').addEventListener('click', () => {
        if(audio.paused)
        {
            audio.play();
            document.querySelector('.fa-volume-xmark').classList.add('fa-volume-high');
            document.querySelector('.fa-volume-xmark').classList.remove('fa-volume-xmark');
        }
        else{
            audio.pause()
            document.querySelector('.fa-volume-high').classList.add('fa-volume-xmark');
            document.querySelector('.fa-volume-high').classList.remove('fa-volume-high');
        }
    });
    
    
});

