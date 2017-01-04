var app = angular.module("newsApp", []);


app.filter("discountValue", function() { 

	  return function(actualprice , percent) { 
	    return Math.round(actualprice - (actualprice * (parseInt(percent)/100))); 

	  };
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

app.controller("newsController", ["$scope","$http", function ($scope,$http) {
	
	$scope.rating = 1000;
	$scope.filterObj ="javascript";
	$scope.globalLoading = true;
	
	$scope.chageLanguage = function(){
		$scope.globalLoading=false;
		$http({
			method : "GET",
			url : "https://api.github.com/search/repositories?q=language:"+ $scope.filterObj +"&stars:%3E="+$scope.rating,
			
		}).then(function successCallback(response) {
			
			var data = response.data;
			$scope.data = data.items;
			$scope.globalLoading=true;
			
		},function errorCallback(){
			alert("There is no response from git, change langauage ");
			$scope.data =[{name:"No data found",owner : {avatar_url: "https://cdnjs.cloudflare.com/ajax/libs/topcoat-icons/0.1.0/svg/error.svg"}}];
			$scope.globalLoading=true;
		});
	};
	
	$scope.chageLanguage();
	
	
}]);