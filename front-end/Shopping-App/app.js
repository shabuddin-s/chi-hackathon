var myApp = angular.module("myApp", ["ngRoute"]);


myApp.config(function($routeProvider) {
	$routeProvider
		.when("/home", {
			templateUrl: "partials/home.html",
			controller: "HomeCtrl"
		})


		 .when("/landing", {
                        templateUrl: "partials/landing.html",
                        controller: "HomeCtrl"
                })

		 .when("/final", {
                        templateUrl: "partials/final.html",
                        controller: "HomeCtrl"
                })


		.otherwise({
			redirectTo: "/landing"
		}); 
});

/*
myApp.controller("HeaderCtrl", function($scope, $location) {
	$scope.appDetails = {};
	$scope.appDetails.title = "VizShopper";
	$scope.appDetails.tagline = "We have 1  million items for you";	

	$scope.nav = {};
	$scope.nav.isActive = function(path) {
		if(path == $location.path()){
			return true;
		}

		return false;
	}
});
*/
myApp.controller("HomeCtrl", function($scope, $http, $location, $interval) {
	
	$interval(function(){
	$http.get("http://528457d7.ngrok.io/api/getState")	
		 .then(function(response) {
			//console.log(response)
			$scope.items = response['data']['items'];
			if(response['data']['updated'] == 'true') {
				//console.log(response['data']['view'] );
			if(response['data']['view'] == 'landing')
                                $location.path('/landing');
			else if(response['data']['view'] == 'home')
				$location.path('/home');
			else if(response['data']['view'] == 'search') 
				$location.path('/home');
			else if(response['data']['view'] == 'filter') 
				$location.path('/home');
			else if(response['data']['view'] == 'final')
                                $location.path('/final');
			else
				$location.path('/landing');
			}
    })}, 1000); 

});
