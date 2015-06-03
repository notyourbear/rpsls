(1-800-6344579)

//ok:
on creation of room, player gets pushed into to the game (as a key; Room.game[playerId]: null); 

anyone who joins the room can press a button to join the game. 

if the game.array has two people in it, then the join game button dissapears and the 'get in line' button appears. anyone who presses that will get put in the queue. 

when in the game itself, there should be buttons to press. you choose which thing you want, then press ready. 

ready submits the choice to the backend


1. get room 
2. set key value
3. if both key values are set eval otherwise send back 'waiting on other dude'
4. when both are set, meow meow meow

backend sets choice to the rooms game object as the key value pairing (Room.game[playerId] = choice!);

when the game value length === 2... 
    var count = 0;
    var i;

    for (i in a) {
        if (a.hasOwnProperty(i) && i !== null) {
            count++;
        }
    })

then evaluate the game and send results back. also update the game object and the queue.
