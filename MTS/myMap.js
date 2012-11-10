function MyMap () {
	var sheetData;
	var map;
}

MyMap.prototype.loadSpreadsheet = function(url, callBackFunction) {
	map = this.loadMap();
	if(callBackFunction != null) {
		
		Tabletop.init({ 
				key: url,
				callback: function(data, tabletop) { 
							callBackFunction(data); 
				}, 
				simpleSheet: true
		});
	
	} else {
		Tabletop.init({ 
				key: url,
				callback: this.loadMarkers, 
				simpleSheet: true
		});
	}
};

MyMap.prototype.loadMap  = function() {
	var	map = new L.Map('map', {
		touchZoom: true,
		scrollWheelZoom: false,
		dragging: true,
	});

	var cloudmade = new L.TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
	    maxZoom: 18
	});
	map.addLayer(cloudmade);
	
	return map;
};


MyMap.prototype.loadMarkers = function(data) {
	sheetData = data;
	data.forEach(function (data){
		var markerLocation = new L.LatLng(data.lat, data.long);
		var marker = new L.Marker(markerLocation);
		map.addLayer(marker);
		marker.bindPopup(data.name);
		map.setView(markerLocation, 7);
	});
};

MyMap.prototype.getData = function(url) {
  return this.sheetData;
};