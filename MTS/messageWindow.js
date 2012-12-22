function MessageWindow(map) {
    this.setMap(map);
}


MessageWindow.prototype = new google.maps.OverlayView();
MessageWindow.prototype.onAdd = function () {
    this.$div_ = $('<div id="message" style="position:absolute"/>').appendTo(this.getPanes().floatPane);
}
MessageWindow.prototype.draw = function () {
    var me = this;
    var $div = this.$div_;
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
        $div.css({
            left: point.x,
            top: point.y
        });
    }
};
MessageWindow.prototype.remove = function () {
    if (this.$div_) {
        this.$div_.remove();
        this.$div_ = null;
    }
};
MessageWindow.prototype.getPosition = function () {
    return this.latlng_;
};

var openTimeout;

MessageWindow.prototype.open = function (marker, data) {
    marker.setAnimation(google.maps.Animation.DROP);
    marker.setZIndex(google.maps.Marker.MAX_ZINDEX);
    map = marker.getMap();
    clearTimeout(openTimeout);
    var left = map.getBounds().getSouthWest().lat();
    var right = map.getBounds().getNorthEast().lat();
    var offset = (right - left) * .25;
    var newCenter = new google.maps.LatLng(marker.position.lat(), marker.position.lng() + offset);
    map.panTo(newCenter);
    $div = this.$div_.stop().css('opacity', 1).hide().empty();
    this.latlng_ = marker.position;
    this.draw();

    var closeButton = $("<div class=\"icon ui-state-default ui-corner-all\"><span class=\"ui-icon ui-icon-closethick\" />X</div>").click(function () {
        $div.fadeOut();
    })
        .css({
        top: '5px',
        right: '5px'
    });
	
	var conteudo = ich.infoWindowTpl(MTS)

    $div.html(conteudo).end();
	$div.append(closeButton).end();
    $div.show();
    $div.show("drop", {
        direction: "right"
    });
};

var message;