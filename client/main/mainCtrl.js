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
			$scope.strike = 0;

			// On keypress, check if pressed character matches any character in the scrambled string
			// If so, remove character from scrambled string and add it to the unscrambled string.
			// If unscrambled string matches the original word or is an anagram, call getWord() to get a new word
	    $rootScope.$on('keypress', function (evt, obj, key) {
	    	$scope.$apply(function () {
		    	var index = $scope.scrambled.indexOf(key);
		    	if(index !== -1){
		    		$scope.unscrambled += $scope.scrambled[index];
		    		$scope.scrambled = $scope.scrambled.slice(0, index) + $scope.scrambled.slice(index + 1);
		    		$scope.indexStack.push(index);
		    	}
		    	if($scope.unscrambled.length === $scope.word.length){
		    		MainFactory.checkWord($scope.unscrambled)
		    			.then(function(result){
		    				if(result.totalResults > 0 || $scope.unscrambled === $scope.word){
		    					$scope.matched = true;
		    					$scope.score += 100;
		    					$scope.strike += 1;
		    					$timeout(function(){
		    						$scope.getWord()
		    					}, 500);
		    				}else{
				    			$scope.noMatch = !$scope.noMatch;
				    			$timeout(function(){
				    				$scope.score = 0;
				    				$scope.strike = 0;
					    			$scope.unscrambled = '';
					    			$scope.scrambled = $scope.scrambledWord;
					    			$scope.noMatch = !$scope.noMatch;
				    			}, 500);
				    		}
		    			});
		    	}
        });
	    });

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
	    })

	    // Call getWord() in MainFactory to query a random word from the Wordnik api
			$scope.getWord = function(){
				MainFactory.getWord()
					.then(function(word){
						$scope.matched = false;
						$scope.word = word.word;
						$scope.unscrambled = '';
						$scope.scrambled = '';
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
				$scope.scrambledWord = arr.join('');
				$scope.scrambled = $scope.scrambledWord;
			}

			$scope.getWord();
		}
})();