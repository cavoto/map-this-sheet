function MyMap(userOptions) {
	
	var sheetData;
    var mapObject;
	var options = {
		url: '',
		mapDiv: 'map',
		callBackFunction: '',
		col_lat: 'lat',
		col_lng: 'lng',
		col_icon: 'icon',
		col_title: 'name'
		};
	
	
	this.init = function(userOptions) 
	{
		//alert(userOptions.mapDiv);
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
		//var saopaulo = new google.maps.LatLng(-23.548881, - 46.74408);
		var brasil = new google.maps.LatLng(-14.264383, - 51.943359);
		// Creating a map
		choosedDiv = options.mapDiv;
		mapObject = new google.maps.Map(document.getElementById(choosedDiv), {
			zoom: 5,
			center: brasil,
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
		data.forEach(function (data) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(data[options.col_lat], data[options.col_lng]),
				map: mapObject,
				title: data[options.col_title]
			});
			if (data.icon !== "") {
				marker.setIcon(new google.maps.MarkerImage(data[options.col_icon]));
			}
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