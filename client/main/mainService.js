(function(){
	angular
		.module('scramble')

		.factory('MainFactory', MainFactory);

		MainFactory.$inject = ['$http'];

		function MainFactory($http){
			// Query a random word from the Wordnik API
			var getWord = function(){
				return $http({
					method: 'GET',
					url: 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=6&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
				})
				.then(function(res){
					return res.data;
				})
			};

			// Searh a word using the Wordnik API which returns, among others, the total search result count
			// Invalid word will return 'totalResults' of 0
			var checkWord = function(word){
				return $http({
					method: 'GET',
					url: 'http://api.wordnik.com:80/v4/words.json/search/' + word + '?caseSensitive=true&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
				})
				.then(function(res){
					return res.data;
				})
			};

			return {
				getWord: getWord,
				checkWord: checkWord
			};
		}
})();