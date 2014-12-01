
app.getCanyonLayer = function() {
    var canyonStyle = {};
    var canyonLayer = new ol.layer.Vector({
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
    return canyonLayer;
};


var getCoralColors = function(text) {
    var colors = {},
        strokeColor = {R: '48', G: '128', B: '171'},
        fillColor = {R: '255', G: '255', B: '255'};
    // coloring Corals                
    if (text === 'Anthoathecatae') {
        strokeColor = {R: '221', G: '221', B: '00'};
        fillColor = {R: '255', G: '255', B: '16'};
    } else if (text === 'Antipatharia') {
        strokeColor = {R: '00', G: '221', B: '00'};
        fillColor = {R: '00', G: '255', B: '00'};
    } else if (text === 'Alcyonacea') {
        strokeColor = {R: '199', G: '00', B: '00'};
        fillColor = {R: '231', G: '24', B: '24'};
    } else if (text === 'Gorgonacea') {
        strokeColor = {R: '221', G: '93', B: '00'};
        fillColor = {R: '255', G: '125', B: '00'};
    } else if (text === 'Scleractinia') {
        strokeColor = {R: '133', G: '53', B: '9'};
        fillColor = {R: '165', G: '85', B: '65'};
    } else if (text === 'Pennatulacea') {
        strokeColor = {R: '163', G: '146', B: '177'};
        fillColor = {R: '195', G: '178', B: '214'};
    }
    colors['strokeColor'] = strokeColor;
    colors['fillColor'] = fillColor;
    return colors;
};

app.getCoralLayer = function() {
    var coralStyle = {};
    var corals = new ol.layer.Vector({
        source: new ol.source.GeoJSON({
            projection: 'EPSG:3857',
            url: 'data/geojson/corals.json'
        }),
        style: function(feature, resolution) {
            var text = resolution < 5000 ? feature.get('ORDER_') : '';
            var coralColors = getCoralColors(text),
                strokeColor = coralColors['strokeColor'],
                fillColor = coralColors['fillColor'];
            if (!coralStyle[text]) {
                coralStyle[text] = [new ol.style.Style({
                    image: new ol.style.Circle({
                        stroke: new ol.style.Stroke({
                            color: 'rgba('+strokeColor['R']+', '+strokeColor['G']+', '+strokeColor['B']+', .6)',
                            width: 1.25
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba('+fillColor['R']+', '+fillColor['G']+', '+fillColor['B']+', .6)'
                        }),
                        radius: 5
                    })                
                })];
            }
            return coralStyle[text];
        }
    });
    return corals;
};

app.getSeabedLayer = function() {
    var seabed = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://s3.amazonaws.com/marco-public-2d/Conservation/SeabedForm/{z}/{x}/{y}.png'
        })
    });
    return seabed;
};


// ESRI REST Attempt #1
// var dangerZones = new ol.layer.Tile({
//     source: new ol.source.XYZ({
//         url: 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/NavigationAndMarineTransportation/MapServer/8/tile/{z}/{y}/{x}'
//     })
// });
// map.layers['dangerZones'] = dangerZones;

// ESRI REST Attempt # 2
// var dangerZones = new ol.layer.Tile({
//     source: new ol.source.TileWMS({ 
//         url: "http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/NavigationAndMarineTransportation/MapServer/WMSServer",
//         params:{
//             LAYERS:"8",
//             FORMAT:"image/png",
//         }
//      })
// });
// map.layers['dangerZones'] = dangerZones;


// feature highlighting strategy
app.getFeatureOverlay = function(map) {
    if (app.featureOverlay) {
        return app.featureOverlay;
    }
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
                    var coralColors = getCoralColors(text),
                        strokeColor = coralColors['strokeColor'],
                        fillColor = coralColors['fillColor'];                
                    highlightStyleCache[text] = [new ol.style.Style({
                        image: new ol.style.Circle({
                            stroke: new ol.style.Stroke({
                                color: 'rgba('+strokeColor['R']+', '+strokeColor['G']+', '+strokeColor['B']+', 1)',
                                width: 1
                            }),
                            fill: new ol.style.Fill({
                                // color: 'rgba(255,255,255,1)'
                                color: 'rgba('+fillColor['R']+', '+fillColor['G']+', '+fillColor['B']+', 1)'
                            }),
                            radius: 5
                        })
                    })];
                }
                return highlightStyleCache[text];
            } else if (feature.get('DRAWING')) {
                var text = feature.get('DRAWING');
                if (!highlightStyleCache[text]) {
                    highlightStyleCache[text] = [new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.4)'
                            // color: 'white'
                        })
                    })];
                }
                return highlightStyleCache[text];
            }      
        }
    });
    return featureOverlay;
};

