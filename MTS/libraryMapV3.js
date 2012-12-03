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
		col_title: 'name',
		default_marker: 'images/marker.png'
		};
	
	var message;
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
		message = new MessageWindow(mapObject);
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
					} else {
						marker.setIcon(new google.maps.MarkerImage(options.default_marker));
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
						openMTSInfoWindow(message, infoBubble, marker, mapObject);
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
/* *************************/

function MessageWindow(map){
  			  this.setMap(map);
  			}
			
			MessageWindow.prototype = new google.maps.OverlayView();
			MessageWindow.prototype.onAdd = function() {
												this.$div_ = $('<div id="message">aksjdkasjdksjd</div>').appendTo(this.getPanes().floatPane);
												this.$div_.hide();
											}
        MessageWindow.prototype.draw = function() {
										  var me = this;
										  var $div = this.$div_;
										  var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
										  if (point) {
												$div.css({ right: point.x, top: point.y});
										  }
										};
        MessageWindow.prototype.remove = function() {
          if (this.$div_) {
            this.$div_.remove();
            this.$div_ = null;
          }
        };
		
        MessageWindow.prototype.getPosition = function() {
         return this.latlng_;
        };
        
        var openTimeout;
		
        MessageWindow.prototype.open = function(marker) {
											marker.setAnimation(google.maps.Animation.DROP);
											marker.setZIndex(google.maps.Marker.MAX_ZINDEX);
																					
											clearTimeout(openTimeout);
											var left = this.map.getBounds().getSouthWest().lat();
											var right = this.map.getBounds().getNorthEast().lat();
											var offset = (right - left) * .25;
											var newCenter = new google.maps.LatLng(marker.position.lat(), marker.position.lng()+offset);
											this.map.panTo(newCenter);
											//$div = this.$div_.stop().css('opacity',1).hide().empty();
											this.latlng_ = marker.position;
											this.draw();
											
											var closeButton = $("<div class=\"icon ui-state-default ui-corner-all\"><span class=\"ui-icon ui-icon-closethick\" /></div>").click(function(){ 
																							$div.fadeOut(); 
																					})
																					.css({ top:'5px', right:'5px' });
				conteudo = "<div class=\"azul\">" +  marker.title + "</div>"
							+ "<div class=\"cinza_claro\"><span>Cidade: </span><span style=\"right:0px;\">" +  marker.cidade + "</span></div>"
							+ "<div class=\"cinza_claro\">Site: <span class=\"site\"><a href=\"" +  marker.site + "\" target=\"_blank\">" +  marker.site + "</a></span></div>"
							+ "<div class=\"cinza_claro\">Twitter: <span class=\"twitter\">" +  marker.twitter + "</span></div>"
							+ "<div class=\"cinza_escuro\">FUTEBOL AMERICANO NO BRASIL</div>";
				
											
											  this.$div_.show();
										};
										

												
function openMTSInfoWindow(message, infoBubble, marker, map)
{
	var content;
	content = ich.infoWindowTpl(marker.MTS);
	marker.setAnimation(google.maps.Animation.DROP);
	marker.setZIndex(google.maps.Marker.MAX_ZINDEX);
	//var newCenter = new google.maps.LatLng(marker.position.lat(), marker.position.lng()+0.5);
	//map.panTo(newCenter);	
	infoBubble.setContent(content[0]);
	infoBubble.open(map, marker);
	message.open(marker);
	
}