var app = angular.module("newsApp", []);
var yammermsg={customButton : true, //false by default. Pass true if you are providing your own button to trigger the share popup
	    classSelector: 'mybutton-css-class',pageUrl: window.location.href};


app.filter("dateValue", function() { 

	  return function(actualdate) { 
		  var d= new Date(Number(actualdate))
	    return d.toDateString(); 

	  };
});



app.controller("newsController", ["$scope","$http", function ($scope,$http) {
	$scope.apihits = 0;
	$scope.globalLoading = true;
	$scope.productUpdates = [];
	$scope.filterText ="";
	$scope.parcelValue = "-price";
	
	if(!localStorage.hasOwnProperty("apihits")){
		localStorage.setItem("apihits",0);
	}else{
		$scope.apihits = Number(localStorage.getItem("apihits"));
	}
		
	$scope.sortByParcelValue = function() {
		$scope.reverse = !$scope.reverse ;
		$scope.parcelValue = ($scope.parcelValue === "-price")? "price" : "-price";
  };
  
	
	if(!localStorage.hasOwnProperty("like")){
		$scope.globalLoading=false;
		$http({
			method : "GET",
			url : "http://starlord.hackerearth.com/cognizantinternal/trackr",
			
		}).then(function successCallback(response) {
			$scope.apihits = $scope.apihits+1
			localStorage.setItem("apihits",$scope.apihits);
			
			var data = response.data;
			data = data.parcels;
			data.forEach(function(d){
				var actual = d.price;
				d.price= parseInt(actual.replace(",",""));				
			});
			
			$scope.data = data;
			localStorage.setItem("like",JSON.stringify(data));
			$scope.globalLoading=true;
			
		},function errorCallback(){
			alert("There is no response from git, change langauage ");
			$scope.data =[];
			$scope.globalLoading=true;
		});
	} else {
		var value = localStorage.getItem("like");
		$scope.data =JSON.parse(value);
		$scope.globalLoading = true;
	}
	
	$scope.activeFeed = function(event,productDetail){
		$("blockquote").removeClass("active");
		 $(event.currentTarget).addClass('active');
		 $scope.productUpdates =productDetail;
		
		$("#colorBox").css("color",$scope.productUpdates.color);
		yammermsg.defaultMessage ="Digitopia contest \n Product :"+$scope.productUpdates.name +"\n location : "+$scope.productUpdates.live_location;
		
//        var uluru = {lat: -25.363, lng: 131.044};
        var uluru = $scope.productUpdates.live_location;
        uluru = {lat: uluru.latitude, lng: uluru.longitude};
        var map = new google.maps.Map(document.getElementById('map_canvas'), {
          zoom: 10,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
	};
	
	$scope.shareBtn = function(){
		//alert("share");
		//console.log(yammermsg);
		yam.platform.yammerShare(yammermsg);
	}
	
	$scope.likeBtn = function(name){
		var value = localStorage.getItem("like");
		 value=JSON.parse(value);
		 
		 value.forEach(function(d){

			 if(d.name === name){
				 if(d.hasOwnProperty("like")){
					 console.log("has like");
				    d.like = d.like+1;
				    $scope.productUpdates =d;
				 }else{
					 d.like = 1;
					 $scope.productUpdates = d;
				 }
			 }
			
		 });
		 
		 $scope.data = value;
		 
		 localStorage.setItem("like",JSON.stringify(value));
	};
	
	
	
	
}]);