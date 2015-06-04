curvytron

2. then get a way to the main screen with a back button

3. this is what i need to do:
on the click of the button, 
  first: send request to back end (with inGame status):
  on backend: 
  if inGame is true:
    run through leave game stuff;

  store room in variable:
  in room: take person out of people (if tis is even a thing)
  if room has 0 people in it, delete the room

  on socket:
    -leave room

  in player:
    -this.room = null


  then send back to the front:
    all of the available rooms


  on return to front end:
  -if in players: run through leave game.
  then:
  -change profile's:
    -inGame to false;
    -playedPiece to null
    -currentRoomId to null

     

