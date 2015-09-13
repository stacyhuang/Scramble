(function(){
	angular
		.module('scramble', ['ngRoute'])
			
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: '/main/main.html',
					controller: 'MainCtrl'
				});
		})

		.directive('keypressEvents', function ($document, $rootScope){
	    return {
        restrict: 'A',
        link: function () {
          $document.bind('keypress', function (e) {
            $rootScope.$broadcast('keypress', e, String.fromCharCode(e.which));
          });
        }
	    }
		})

		.directive('keydownEvents', function ($document, $rootScope){
	    return {
        restrict: 'A',
        link: function () {
          $document.bind('keydown', function (e) {
          	if(e.which === 8){
	          	e.preventDefault();
	            $rootScope.$broadcast('keydown', e, String.fromCharCode(e.which));
          	}
          });
        }
	    }
		});


})();
