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

			// Check if two strings are anagrams of each other and returns a boolean
			var compareAnagram = function(str1, str2){
				var storage = {};
				for(var i = 0; i < str1.length; i++){
					if(!storage[str1[i]]){
						storage[str1[i]] = 1;
					}else{
						storage[str1[i]] = storage[str1[i]] + 1;
					}
				}
				for(var j = 0; j < str2.length; j++){
					if(!storage[str2[j]]){
						return false;
					}else{
						storage[str2[j]] = storage[str2[j]] - 1;
						if(storage[str2[j]] === 0){
							delete storage[str2[j]];
						}
					}
				}
				return Object.keys(storage).length === 0;
			};

			return {
				getWord: getWord,
				compareAnagram: compareAnagram
			};
		}
})();