
// other ESRI Basemaps to explore...
// World_Street_Map, World_Topo_Map, World_Imagery, NatGeo_World_Map, World_Light_Gray_Base
var oceans = new ol.layer.Tile({
    source: new ol.source.XYZ({        
        url: 'http://server.arcgisonline.com/arcgis/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
    })
});
var watercolor = new ol.layer.Tile({
    source: new ol.source.XYZ({
        // ESRI Basemaps to explore...
        // World_Street_Map, World_Topo_Map, World_Imagery, NatGeo_World_Map, World_Light_Gray_Base
        url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png'        
    })
});
var natgeo = new ol.layer.Tile({
    source: new ol.source.XYZ({
        // ESRI Basemaps to explore...
        // World_Street_Map, World_Topo_Map, World_Imagery, NatGeo_World_Map, World_Light_Gray_Base
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
    })
});
var basemaps = {'oceans': oceans, 'watercolor': watercolor, 'natgeo': natgeo};
var basemap = oceans;

var map = new ol.Map({
    target: 'map',
    layers: [
        basemap
    ],
    renderer: exampleNS.getRendererFromQueryString(),
    target: document.getElementById('map'),
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }),
    view: new ol.View({
        center: [-8139259.370296092, 4705772.670696784],
        zoom: 6,
        minZoom: 5,
        maxZoom: 14
    })
});

app = {};
app.map = map;
map.layers = {};
map.activeLayers = {};
map.basemaps = basemaps;
map.currentBasemap = basemap;

var canyonStyle = {};
var canyons = new ol.layer.Vector({
    source: new ol.source.GeoJSON({
        projection: 'EPSG:3857',
        url: 'data/geojson/canyons.json'
    }),
    style: function(feature, resolution) {
        var text = resolution < 5000 ? feature.get('NAME') : '';
        if (!canyonStyle[text]) {
            canyonStyle[text] = [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, .6)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#319FD3',
                    width: 1
                })
            })];
        }
        return canyonStyle[text];
    }
});
map.layers['canyons'] = canyons;

var coralStyle = {};
var corals = new ol.layer.Vector({
    source: new ol.source.GeoJSON({
        projection: 'EPSG:3857',
        url: 'data/geojson/corals.json'
    }),
    style: function(feature, resolution) {
        var text = resolution < 5000 ? feature.get('NAME') : '';
        if (!coralStyle[text]) {
            coralStyle[text] = [new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,255,255,0.4)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#3399CC',
                        width: 1.25
                    }),
                    radius: 5
                })                
            })];
        }
        return coralStyle[text];
    }
});
map.layers['corals'] = corals;

var highlightStyleCache = {};
var featureOverlay = new ol.FeatureOverlay({
    map: map,
    style: function(feature, resolution) {
        if (feature.get('NAME')) {
            var text = feature.get('NAME');
            if (!highlightStyleCache[text]) {
                highlightStyleCache[text] = [new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#38d',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        // color: 'rgba(0,0,255,0.1)'
                        color: 'white'
                    })
                })];
            }
            return highlightStyleCache[text];
        } else if (feature.get('ORDER_')) {
            var text = feature.get('ORDER_');
            if (!highlightStyleCache[text]) {
                var strokeColor = '#38d',
                    fillColor = 'white';
                // coloring Corals                
                if (text === 'Anthoathecatae') {
                    strokeColor = '#dddd00';
                    fillColor = '#ffff10';
                } else if (text === 'Antipatharia') {
                    strokeColor = '#00dd00';
                    fillColor = '#00ff00';
                } else if (text === 'Alcyonacea') {
                    strokeColor = '#c70000';
                    fillColor = '#e71818';
                } else if (text === 'Gorgonacea') {
                    strokeColor = '#dd5d00';
                    fillColor = '#ff7d00';
                } else if (text === 'Scleractinia') {
                    strokeColor = '#853509';
                    fillColor = '#a55529';
                } else if (text === 'Pennatulacea') {
                    strokeColor = '#a392b6';
                    fillColor = '#c3b2d6';
                }
                highlightStyleCache[text] = [new ol.style.Style({
                    image: new ol.style.Circle({
                        stroke: new ol.style.Stroke({
                            color: strokeColor,
                            width: 1
                        }),
                        fill: new ol.style.Fill({
                            // color: 'rgba(0,0,255,0.1)'
                            color: fillColor
                        }),
                        radius: 5
                    })
                })];
            }
            return highlightStyleCache[text];
        }        
    }
});

var highlight;
var displayFeatureInfo = function(pixel) {

    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        return feature;
    });

    var info = document.getElementById('info');
    if (feature) {
        var text = feature.get('NAME');
        if (!text) {
           text = feature.get('ORDER_');
        }
        info.innerHTML = text;
        info.style.display = 'block';
    } else {
        info.innerHTML = '';
        info.style.display = 'none';
    }

    if (feature !== highlight) {
        if (highlight) {
            featureOverlay.removeFeature(highlight);
        }
        if (feature) {
            featureOverlay.addFeature(feature);
        }
        highlight = feature;
    }

};

$(map.getViewport()).on('mousemove', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

// map.on('click', function(evt) {
//   displayFeatureInfo(evt.pixel);
// });

map.toggleLayer = function(layerName) {
    if (map.activeLayers[layerName]) {
        // then de-activate layer
        map.removeLayer(map.activeLayers[layerName]);
        delete map.activeLayers[layerName];    
        $('#' + layerName).find('span').removeClass('glyphicon-check');
        $('#' + layerName).find('span').addClass('glyphicon-unchecked');
    } else if (map.layers[layerName]) {
        // then activate layer
        map.addLayer(map.layers[layerName]);
        map.activeLayers[layerName] = map.layers[layerName];
        $('#' + layerName).find('span').removeClass('glyphicon-unchecked');
        $('#' + layerName).find('span').addClass('glyphicon-check');
    }
};

map.switchBasemaps = function(basemapName) {
    if (map.basemaps[basemapName] && map.currentBasemap !== basemapName) {
        map.removeLayer(map.basemaps[map.currentBasemap]);
        map.getLayers().insertAt(1, map.basemaps[basemapName]);
        // map.layers[0] = map.basemaps[basemapName];
        map.currentBasemap = basemapName;
    }
};

