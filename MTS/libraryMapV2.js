function MyMap(userOptions) {
	
	this.sheetData;
    this.mapObject;
	this.options = {
		url: '',
		mapDiv: 'map',
		callBackFunction: ''
		};
	
	this.extend(this.options, userOptions);
    this.loadSpreadsheet();
}
 
MyMap.prototype.loadSpreadsheet = function()
{
	this.mapObject = this.loadMap();
        
	if (this.options.callBackFunction != '') {
		callback = this.options.callBackFunction;
		Tabletop.init({
			key: this.options.url,
			callback: function (data, tabletop) {
				callback(data);
			},
			simpleSheet: true
		});

	} else {
		Tabletop.init({
			key: this.options.url,
			callback: this.loadMarkers,
			simpleSheet: true
		});
	}
}

MyMap.prototype.loadMap = function()
{
	//var saopaulo = new google.maps.LatLng(-23.548881, - 46.74408);
	var brasil = new google.maps.LatLng(-14.264383, - 51.943359);
	// Creating a map
	choosedDiv = this.options.mapDiv;
	map_obj = new google.maps.Map(document.getElementById(choosedDiv), {
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
	return map_obj;
}

MyMap.prototype.loadMarkers = function(data)
{
	this.sheetData = data;
	data.forEach(function (data) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.lng),
			map: this.map_obj,
			title: data.title
		});
		if (data.icon !== "") {
			marker.setIcon(new google.maps.MarkerImage(data.icon));
		}
	});
}

MyMap.prototype.getData = function(url)
{
	return this.sheetData;
}

MyMap.prototype.extend = function(defaultOptions, userOptions)
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
}