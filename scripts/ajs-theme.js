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
	var file = fileNameList.shift();
	var xml_dom = function() {
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
			if (fileNameList.length != 0) {
				file = fileNameList.shift();
				xml_dom();
			} else {
				$rootScope.title = dom[0].evaluate('/website/title', dom[0], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
				$rootScope.style = dom[0].evaluate('/website/style', dom[0], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
				$scope.pnames = [];
				var pn = dom[0].evaluate("/website/page/name[.!='']", dom[0], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
				for ( var i=0 ; i < pn.snapshotLength; i++ ) $scope.pnames.push(pn.snapshotItem(i).textContent);
				// The following is used for contents of drop-down.
				$scope.title2 = dom[1].evaluate('/website/title', dom[1], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
				$scope.pnames2 = [];
				pn = dom[1].evaluate("/website/page/name[.!='']", dom[1], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
				for ( i=0 ; i < pn.snapshotLength; i++ ) $scope.pnames2.push(pn.snapshotItem(i).textContent);
				// The following code is used for contents of an additional drop-down.
				// $scope.title3 = dom[2].evaluate('/website/title', dom[2], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
				// $scope.pnames3 = [];
				// pn = dom[2].evaluate("/website/page/name[.!='']", dom[2], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
				// for ( i=0 ; i < pn.snapshotLength; i++ ) $scope.pnames3.push(pn.snapshotItem(i).textContent);
				// ------------------------------------------------
				$scope.render(p,w);
			}
		});
	};
	xml_dom();
	$scope.active = function(x,as,wd) {
		if (x==p && wd==w) return as; else return "";
	};
	$scope.ic_html = function(navitem) {
		if (navitem.charAt(1)==" ") return '<i class="fa">'+navitem.charAt(0)+'</i>'+navitem.substring(1);
		else return navitem;
	};
	var change_links = function(str) {
		if (w > 1) while (str.includes('"?p=')) {
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
		$scope.img = dom[ws-1].evaluate('/website/page['+pnum+']/image', dom[ws-1], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
		cnt = dom[ws-1].evaluate('/website/page['+pnum+']/contents', dom[ws-1], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
		$scope.contents = change_links(cnt.singleNodeValue.textContent);
		$scope.attr = dom[ws-1].evaluate('/website/page['+pnum+']/@type', dom[ws-1], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
	};
}]);
