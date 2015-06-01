app.factory('roomDiv', function (){
  return {
        room: {
            roomBeg: "<div class='gameRoom'>",
            nameBeg: "<div class='name'>",
            name: "",
            nameEnd: "</div>",
            createdBeg:"<div class='createdBy'>",
            createdBy: "",
            createdEnd:"</div>",
            roomEnd: "</div>"
            },
        join: {
            buttonBeg: "<div ng-click='checkRoom(",
            buttonBegEnd: ")' class='joinButton'>",
            buttonText: "Join this room",
            buttonEnd: "</div>"
        }
    };
});