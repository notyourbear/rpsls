var Rpsls = function(){
  //what do i need:
  //function that takes two params and evaluates winner
  //totals on back end to validate with front end?
  this.outcomes = {
    'Spock': {'Scissors': 'smashes',
              'Rock': 'vaporizes'},
    'Lizard': {'Spock': 'poisons',
              'Paper': 'eats'},
    'Rock': {'Lizard': 'crushes',
             'Scissors': 'crushes'},
    'Paper': {'Rock': 'covers',
              'Spock': 'disproves'},
    'Scissors': {'Paper': 'cuts',
                 'Lizard': 'decapitates'}
  };
   
};

Rpsls.prototype.fight = function(side1, side2){
  var winner;

  if (this.outcomes[side1].hasOwnProperty(side2)){
    winner = side1;
  } else if (this.outcomes[side2].hasOwnProperty(side1)) {
    winner = side2;
  } else {
    winner = 'tie';
  }

  return winner;
};





