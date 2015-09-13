(function(){
	angular
		.module('scramble')

		.controller('MainCtrl', MainCtrl);

		MainCtrl.$inject = ['$scope', 'MainFactory', '$rootScope'];

		function MainCtrl($scope, MainFactory, $rootScope){
			$scope.word = '';
			$scope.selectedChars = [];
			$scope.remainingChars = [];

	    $rootScope.$on('keypress', function (evt, obj, key) {
	    	console.log(key);
	    	$scope.$apply(function () {
		    	var index = $scope.remainingChars.indexOf(key);
		    	if(index !== -1){
		    		$scope.selectedChars.push($scope.remainingChars[index]);
		    		$scope.remainingChars.splice(index, 1);
		    	}
        });
	    });

	    $rootScope.$on('keydown', function (evt, obj, key) {
        $scope.$apply(function () {
        	var prev = $scope.selectedChars.pop();
        	$scope.remainingChars.push(prev);
        });
	    })

			$scope.getWord = function(){
				MainFactory.getWord()
					.then(function(word){
						$scope.word = word.word;
						$scope.characters = [];
						for(var i=0; i<$scope.word.length; i++){
							$scope.remainingChars.push($scope.word[i]);
						}
					});
			};

			$scope.getWord();
		}
})();