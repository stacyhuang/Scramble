(function(){
	angular
		.module('scramble')

		.controller('MainCtrl', MainCtrl);

		MainCtrl.$inject = ['$scope', 'MainFactory'];

		function MainCtrl($scope, MainFactory){
			$scope.word = [];

			$scope.getWord = function(){
				MainFactory.getWord()
					.then(function(word){
						console.log(word);
						$scope.word = word;
					});
			}

			$scope.getWord();
		}
})();