(function(){
  angular
    .module('scramble')

    .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', 'MainFactory', '$rootScope', '$timeout'];

    function MainCtrl($scope, MainFactory, $rootScope, $timeout){
      $scope.word = '';
      $scope.scrambledWord = '';
      $scope.unscrambled = '';
      $scope.scrambled = '';
      $scope.indexStack = [];
      $scope.matched = false;
      $scope.noMatch = false;
      $scope.score = 0;
      $scope.streak = 0;
      $scope.highScore = 0;

      // On keypress, check if pressed character matches any character in the scrambled string
      // If so, remove character from scrambled string and add it to the unscrambled string.
      $rootScope.$on('keypress', function (evt, obj, key) {
        $scope.$apply(function () {
          var index = $scope.scrambled.indexOf(key);
          if(index !== -1){
            $scope.unscrambled += $scope.scrambled[index];
            $scope.scrambled = $scope.scrambled.slice(0, index) + $scope.scrambled.slice(index + 1);
            $scope.indexStack.push(index);
          }
          $scope.checkWord();
        });
      });

      // Check if unscrambled string matches the original word or is an anagram. If so, call getWord() to get a new word
      $scope.checkWord = function(){
        if($scope.unscrambled.length === $scope.word.length){
          MainFactory.checkWord($scope.unscrambled)
            .then(function(result){
              if(result.totalResults > 0 || $scope.unscrambled === $scope.word){
                $scope.matched = true;
                $scope.score += 100;
                $scope.streak += 1;
                if($scope.score > $scope.highScore){
                  $scope.highScore = $scope.score;
                }
                $timeout(function(){
                  $scope.getWord()
                }, 500);
              }else{
                $scope.noMatch = !$scope.noMatch;
                $timeout(function(){
                  $scope.score = 0;
                  $scope.streak = 0;
                  $scope.unscrambled = '';
                  $scope.scrambled = $scope.scrambledWord;
                  $scope.noMatch = !$scope.noMatch;
                }, 500);
              }
            });
        }
      };

      // On keydown, remove previous character from the unscrambled string,
      // and add it back to the scrambled string at its previous index
      $rootScope.$on('keydown', function (evt, obj, key) {
        $scope.$apply(function () {
          if($scope.indexStack.length > 0){
            var prevIndex = $scope.indexStack.pop();
            var prevChar = $scope.unscrambled[$scope.unscrambled.length - 1];
            $scope.unscrambled = $scope.unscrambled.slice(0, $scope.unscrambled.length - 1);
            $scope.scrambled = $scope.scrambled.slice(0, prevIndex) + prevChar + $scope.scrambled.slice(prevIndex);
          }
        });
      });

      // Gives a hint by adding the next correct character to the unscrambled string
      $scope.getHint = function(){
        var startIndex = 0;
        while($scope.unscrambled[startIndex] === $scope.word[startIndex] && startIndex < $scope.word.length){
          startIndex++;
        }
        var nextChar = $scope.word[startIndex];
        while($scope.unscrambled.length > startIndex){
          var prevIndex = $scope.indexStack.pop();
          $scope.scrambled = $scope.scrambled.slice(0, prevIndex) + $scope.unscrambled[$scope.unscrambled.length - 1] + $scope.scrambled.slice(prevIndex);
          $scope.unscrambled = $scope.unscrambled.slice(0, $scope.unscrambled.length - 1);
        }
        $scope.unscrambled += nextChar;
        var scrambledIndex = $scope.scrambled.indexOf(nextChar);
        $scope.scrambled = $scope.scrambled.slice(0, scrambledIndex) + $scope.scrambled.slice(scrambledIndex + 1);
        $scope.checkWord();
      };

      // Call getWord() in MainFactory to query a random word from the Wordnik api
      $scope.getWord = function(){
        MainFactory.getWord()
          .then(function(word){
            console.log(word);
            $scope.matched = false;
            $scope.word = word;
            $scope.unscrambled = '';
            $scope.scrambled = '';
            $scope.indexStack = [];
            $scope.scrambled = MainFactory.scramble($scope.word);
          });
      };

      $scope.getWord();
    }
})();