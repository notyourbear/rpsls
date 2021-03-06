var Rpsls = function(){
  //what do i need:
  //function that takes two params and evaluates winner
  //totals on back end to validate with front end?
  this.outcomes = {
    'Spock': {'Scissors': 'smashed',
              'Rock': 'vaporized'},
    'Lizard': {'Spock': 'poisoned',
              'Paper': 'ate'},
    'Rock': {'Lizard': 'crushed',
             'Scissors': 'crushed'},
    'Paper': {'Rock': 'covered',
              'Spock': 'disproved'},
    'Scissors': {'Paper': 'cut',
                 'Lizard': 'decapitated'}
  };
   
};

Rpsls.prototype.evaluate = function(side1, side2){
  var winner = [];

  if (this.outcomes[side1].hasOwnProperty(side2)){
    winner.push(side1);
    winner.push(this.outcomes[side1][side2]);
    winner.push(side2);
  } else if (this.outcomes[side2].hasOwnProperty(side1)) {
    winner.push(side2);
    winner.push(this.outcomes[side2][side1]);
    winner.push(side1);
  } else {
    winner.push('tie');
  }

  return winner;
};

module.exports = Rpsls;



