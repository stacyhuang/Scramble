(function(){
	angular
		.module('scramble')

		.controller('MainCtrl', MainCtrl);

		MainCtrl.$inject = ['$scope', 'MainFactory'];

		function MainCtrl($scope, MainFactory){
			$scope.word = [];
			$scope.characters = [];

			$scope.getWord = function(){
				MainFactory.getWord()
					.then(function(word){
						$scope.word = word.word;
						$scope.characters = [];
						for(var i=0; i<$scope.word.length; i++){
							$scope.characters.push($scope.word[i]);
						}
						console.log($scope.characters);
					});
			};

			$scope.parseWord = function(){

			};

			$scope.getWord();
		}
})();