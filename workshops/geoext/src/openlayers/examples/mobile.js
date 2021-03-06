
// initialize map when page ready
var map;
function init() {
    var gg = new OpenLayers.Projection("EPSG:4326");
    var sm = new OpenLayers.Projection("EPSG:900913");
    
    // layer for drawn features
    var vector = new OpenLayers.Layer.Vector();

    // create map
    map = new OpenLayers.Map({
        div: "map",
        projection: sm,
        units: "m",
        numZoomLevels: 18,
        maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(
            -20037508.34, -20037508.34, 20037508.34, 20037508.34
        ),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.DrawFeature(
                vector, OpenLayers.Handler.Point, {id: "point-control"}
            ),
            new OpenLayers.Control.DrawFeature(
                vector, OpenLayers.Handler.Path, {id: "line-control"}
            ),
            new OpenLayers.Control.DrawFeature(
                vector, OpenLayers.Handler.Polygon, {id: "poly-control"}
            ),
            new OpenLayers.Control.ModifyFeature(vector, {id: "mod-control"}),
        ],
        layers: [new OpenLayers.Layer.OSM(), vector],
        center: new OpenLayers.LonLat(0, 0),
        zoom: 1
    });

    // attempt to get position
    if (window.navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            updatePosition,
            function failure(error) {
                updateLog(error.message);
            },
            {
                enableHighAccuracy: true
            }
        );
    }

};

// get position if possible
var position;
function updatePosition(pos) {
    position = pos;
    var lon =  position.coords.longitude;
    var lat = position.coords.latitude;
    updateLog("position: lon " + lon + ", lat " + lat);
    map.setCenter(
        new OpenLayers.LonLat(lon, lat).transform(gg, sm)
    );
}

// allow simple logging
var log = [];
function updateLog(message) {
    log.push(message);
    if (window.console) {
        console.log(message);
    }
}
function clearLog() {
    log.length = 0;
}    

function pan(fx, fy) {
    var size = map.getSize();
    map.pan(size.w * fx, size.h * fy);
}
