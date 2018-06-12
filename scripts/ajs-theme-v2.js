app = angular.module('myApp',[], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<|');
  $interpolateProvider.endSymbol('|>');
});
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
	var p, w;
	if (pos != -1) p = url.charAt(pos+2); else p = "1";
	pos = url.search("w=[1-9]");
	if (pos != -1) w = url.charAt(pos+2); else w = "1";
	$rootScope.strip_tags = function(str) {
		var pos=str.lastIndexOf("> ");
		if (pos != -1) str=str.substring(pos+2);
		pos=str.lastIndexOf(" <");
		if (pos != -1) str=str.substring(0,pos);
		return str;
	};
	var dom = [], fileNameList = [];
	// -----------------------------------
	fileNameList.push('data/website.xml');
	fileNameList.push('data/website2.xml');
	// Add/Remove website data files here.
	var xml_dom = function(flist) {
		var file = flist.shift();
		$http.get(file).then(function (response) {
			if (typeof DOMParser != "undefined") {
				var parser = new DOMParser();
				xmldata = parser.parseFromString(response.data, "text/xml");
			}
			else {
				var doc = new ActiveXObject("Microsoft.XMLDOM");
				doc.async = false;
				xmldata = doc.loadXML(response.data);
			}
			dom.push(xmldata);
			if (flist.length != 0) xml_dom(flist); else {
				$rootScope.title = dom[0].querySelector("title");
				$rootScope.style = dom[0].querySelector("style");
				$scope.pnames = dom[0].querySelectorAll("name:not(:empty)");
				// The following is used for contents of drop-down.
				$scope.title2 = dom[1].querySelector("title");
				$scope.pnames2 = dom[1].querySelectorAll("name:not(:empty)");
				// The following code is used for contents of an additional drop-down.
				// $scope.title3 = dom[2].querySelector("title");
				// $scope.pnames3 = dom[2].querySelectorAll("name:not(:empty)");
				// ------------------------------------------------
				$scope.render(p,w);
			}
		});
	};
	xml_dom(fileNameList);
	$scope.active = function(x,as,wd) {
		if (x==p && wd==w) return as; else return "";
	};
	$scope.ic_html = function(navitem) {
		if (navitem.charAt(1)==" ") return '<i class="fa">'+navitem.charAt(0)+'</i>'+navitem.substring(1);
		else return navitem;
	};
	var change_links = function(str) {
		if (w > 1) while (str.indexOf('"?p=')!=-1) {
		   str=str.replace('"?p=1','"?w='+w+'&p=1');
		   str=str.replace('"?p=2','"?w='+w+'&p=2');
		   str=str.replace('"?p=3','"?w='+w+'&p=3');
		   str=str.replace('"?p=4','"?w='+w+'&p=4');
		   str=str.replace('"?p=5','"?w='+w+'&p=5');
		   str=str.replace('"?p=6','"?w='+w+'&p=6');
		}
		return str;
	};
	$scope.render = function(pnum,ws) {
		p = pnum;
		w = ws;
		var cp = dom[ws-1].getElementsByTagName("page")[pnum-1];
		$scope.img = cp.querySelector("image");
		cnt = cp.querySelector("contents");
		$scope.contents = change_links(cnt.textContent);
		$scope.attr = cp.attributes.getNamedItem("type");
	};
}]);
