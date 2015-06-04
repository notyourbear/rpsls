curvytron

somethings wrong with adding players to the room.player correctly in the back end. 

figure out why adding/removing a person isn't working correctly.
 

issues: 
  2. rooms being displayed multiple times on home screen 
  2c. also add a join message


...on room delete, send out message to update rooms...


//ok. so on disconnecting and then connecting to another room, all fucking messages get shown more than once. it only gets sent once, so its on the front end. because once again i am using jquery. switch the messages to ng-repeat.

also write an on disconnect get out of room thing -- more important
