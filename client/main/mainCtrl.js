(function(){
	angular
		.module('scramble')

		.controller('MainCtrl', MainCtrl);

		MainCtrl.$inject = ['$scope', 'MainFactory', '$rootScope'];

		function MainCtrl($scope, MainFactory, $rootScope){
			$scope.word = '';
			$scope.unscrambled = '';
			$scope.scrambled = '';
			$scope.indexStack = [];

			// On keypress, check if pressed character matches any character in the scrambled string
			// If so, remove character from scrambled string and add it to the unscrambled string
	    $rootScope.$on('keypress', function (evt, obj, key) {
	    	$scope.$apply(function () {
		    	var index = $scope.scrambled.indexOf(key);
		    	if(index !== -1){
		    		$scope.unscrambled += $scope.scrambled[index];
		    		$scope.scrambled = $scope.scrambled.slice(0, index) + $scope.scrambled.slice(index + 1);
		    		$scope.indexStack.push(index);
		    	}
        });
	    });

	    // On keydown, remove last ad character from the unscrambled string,
	    // and add it back to previous index in the scrambled string
	    $rootScope.$on('keydown', function (evt, obj, key) {
        $scope.$apply(function () {
        	var prevIndex = $scope.indexStack.pop();
        	var prevChar = $scope.unscrambled[$scope.unscrambled.length - 1];
        	$scope.unscrambled = $scope.unscrambled.slice(0, $scope.unscrambled.length - 1);
        	$scope.scrambled = $scope.scrambled.slice(0, prevIndex) + prevChar + $scope.scrambled.slice(prevIndex);
        });
	    })

	    // Call getWord() in MainFactory to query a random word from the Wordnik api
			$scope.getWord = function(){
				MainFactory.getWord()
					.then(function(word){
						$scope.word = word.word;
						console.log("original word: " + $scope.word);
						$scope.scramble($scope.word);
					});
			};

			// Scramble the random word and set it to $scope.scrambled
			$scope.scramble = function(str){
				var arr = str.split('')
				for(var i = arr.length - 1; i > 0; i--){
					var j = Math.floor(Math.random() * (i+1));
					var temp = arr[i];
					arr[i] = arr[j];
					arr[j] = temp;
				}
				$scope.scrambled = arr.join('');
			}

			$scope.getWord();
		}
})();