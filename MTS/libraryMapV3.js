function MyMap(userOptions) {
	
	var sheetData;
    var mapObject;
	var options = {
		url: 'https://docs.google.com/spreadsheet/ccc?key=0AmnmVYhStAhLdER5aHk2cWk3ZWl2bnlybjJZalVxZ1E&single=true&gid=0&output=html',
		mapDiv: 'map',
		callBackFunction: '',
		col_lat: 'lat',
		col_lng: 'lng',
		col_icon: 'icon',
		col_title: 'name'
		};
	
	
	this.init = function(userOptions) 
	{
		this.extend(options, userOptions);
		this.loadSpreadsheet();
	};
    
	this.loadSpreadsheet = function() {
		this.loadMap();
			
		if (options.callBackFunction != '') {
			callback = options.callBackFunction;
			Tabletop.init({
				key: options.url,
				callback: function (data, tabletop) {
					callback(data);
				},
				simpleSheet: true
			});
		} else {
			Tabletop.init({
				key: options.url,
				callback: this.loadMarkers,
				simpleSheet: true
			});
		}
	};
	
	this.loadMap = function() {
		var saopaulo = new google.maps.LatLng(-23.548881, - 46.74408);
		// Creating a map
		choosedDiv = options.mapDiv;
		mapObject = new google.maps.Map(document.getElementById(choosedDiv), {
			zoom: 5,
			center: saopaulo,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			}
		});
	};
	
	this.loadMarkers = function(data)
	{
		this.sheetData = data;
		counter = 0;
		data.forEach(function (data) {
			setTimeout(function() {
				var marker = new google.maps.Marker({
						position: new google.maps.LatLng(data[options.col_lat], data[options.col_lng]),
						map: mapObject,
						title: data[options.col_title],
						animation: google.maps.Animation.DROP,
						MTS: data
					});
					if (data.icon !== "") {
						marker.setIcon(new google.maps.MarkerImage(data[options.col_icon]));
					}
					var infoBubble = new InfoBubble({
						  shadowStyle: 1,
						  padding: 0,
						  borderRadius: 4,
						  arrowSize: 10,
						  borderWidth: 1,
						  borderColor: '#2c2c2c',
						  disableAutoPan: false,
						  hideCloseButton: false
						});
					google.maps.event.addListener(marker, "click", function(){
						
						openMTSInfoWindow(infoBubble, marker, mapObject);
					});
				}, counter * 100);
				counter++;
		});
	};
	
	this.extend = function(defaultOptions, userOptions)
	{
		defaultOptions = defaultOptions || {};
		for (var prop in userOptions) {
			if (typeof defaultOptions[prop] === 'object') {
				defaultOptions[prop] = extend(defaultOptions[prop], userOptions[prop]);
			} else {
				defaultOptions[prop] = userOptions[prop];
			}
		}
		return defaultOptions;
	};
	
	this.getData = function(url)
	{
		return this.sheetData;
	};
	this.init(userOptions);
}

function openMTSInfoWindow(infoBubble, marker, map)
{
	var html = Mustache.to_html(infoWindowTpl.text, marker.MTS);
	infoBubble.setContent(html);
	infoBubble.open(map, marker);
}