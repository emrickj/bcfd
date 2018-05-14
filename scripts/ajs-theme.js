app = angular.module('myApp',[]);
app.filter('trustHtml', [
        '$sce',
        function($sce) {
            return function(value) {
                return $sce.trustAs('html', value);
            }
        }
    ]);
app.controller('pname', ['$scope' ,'$rootScope' ,'$http' ,'$window' ,function($scope, $rootScope, $http, $window) {
	var url = $window.location.href;
	var pos = url.search("p=[1-6]");
	if (pos != -1) $scope.pnum = url.charAt(pos+2); else $scope.pnum = "1";
    $http.get("data/website.xml").then(function (response) {
        if (typeof DOMParser != "undefined") {
            var parser = new DOMParser();
            dom = parser.parseFromString(response.data, "text/xml");
        }
        else {
            var doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.async = false;
            dom = doc.loadXML(response.data);
        }
        // Now response is a DOMDocument with childNodes etc.
		$scope.pnames = [];
		$rootScope.strip_tags = function(str) {
			var pos=str.lastIndexOf("> ");
			if (pos != -1) str=str.substring(pos+2);
			pos=str.lastIndexOf(" <");
			if (pos != -1) str=str.substring(0,pos);
			return str;
		};
		$rootScope.title = dom.evaluate('/website/title', dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
		$rootScope.style = dom.evaluate('/website/style', dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
		var pn = dom.evaluate("/website/page/name[.!='']", dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		for ( var i=0 ; i < pn.snapshotLength; i++ ) $scope.pnames.push(pn.snapshotItem(i).textContent);
		$scope.active = function(x,as) {
			if (x==$scope.pnum) return as; else return "";
		};
		$scope.ic_html = function(navitem) {
			if (navitem.charAt(1)==" ") return '<i class="fa">'+navitem.charAt(0)+'</i>'+navitem.substring(1);
			else return navitem;
		};
		$scope.render = function(pnum) {
		    $scope.pnum = pnum;
			$scope.img = dom.evaluate('/website/page['+pnum+']/image', dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
			$scope.cnt = dom.evaluate('/website/page['+pnum+']/contents', dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
			$scope.attr = dom.evaluate('/website/page['+pnum+']/@type', dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
		};
		$scope.render($scope.pnum);
    });
}]);
