(function(){
	angular
		.module('scramble', ['ngRoute'])
			
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: '/main/main.html',
					controller: 'MainCtrl'
				});
		});
})();