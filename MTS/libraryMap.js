function MyMap(userOptions) {

    if (window === this) {
        return new MyMap(userOptions);
    }
	
	this.sheetData;
    this.mapObject;
	this.options = {
		url: '',
		mapDiv: 'map',
		callBackFunction: ''
		};
	
	this.options = this.extend(options, userOptions);
    this.loadSpreadsheet();
    return this;
}

/*	Prototype Functions
============================*/

MyMap.prototype = {
    loadSpreadsheet: function () {
        
        this.mapObject = this.loadMap();
        
		if (this.options.callBackFunction != '') {

            Tabletop.init({
                key: url,
                callback: function (data, tabletop) {
                    options.callBackFunction(data);
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
    },

    loadMap: function () {

        //var saopaulo = new google.maps.LatLng(-23.548881, - 46.74408);
        var brasil = new google.maps.LatLng(-14.264383, - 51.943359);
        // Creating a map
        map_obj = new google.maps.Map(document.getElementById('map'), {
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
    },

    loadMarkers: function (data) {

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
    },

    getData: function (url) {

        return this.sheetData;
    },
	
	extend: function  (defaultOptions, userOptions) {
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
};