(function(){
	angular
		.module('scramble')

		.controller('MainCtrl', MainCtrl);

		MainCtrl.$inject = ['$scope', 'MainFactory', '$rootScope'];

		function MainCtrl($scope, MainFactory, $rootScope){
			$scope.word = [];
			$scope.characters = [];
			$scope.key = ''

	    $rootScope.$on('keypress', function (evt, obj, key) {
        $scope.$apply(function () {
           $scope.key = key;
        });
	    })

			$scope.getWord = function(){
				MainFactory.getWord()
					.then(function(word){
						$scope.word = word.word;
						$scope.characters = [];
						for(var i=0; i<$scope.word.length; i++){
							$scope.characters.push($scope.word[i]);
						}
					});
			};

			$scope.getWord();
		}
})();