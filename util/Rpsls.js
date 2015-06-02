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