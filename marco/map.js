
var app = (function(myApp) {

    // other ESRI Basemaps to explore...
    // World_Street_Map, World_Topo_Map, World_Imagery, NatGeo_World_Map, World_Light_Gray_Base
    var oceans = new ol.layer.Tile({
        source: new ol.source.XYZ({        
            url: 'http://server.arcgisonline.com/arcgis/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
        })
    });
    var streets = new ol.layer.Tile({
        source: new ol.source.OSM(),
        preload: Infinity
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
    var basemaps = {'oceans': oceans, 'streets': streets, 'watercolor': watercolor, 'natgeo': natgeo};
    var basemap = streets;

    var template = 'Lat/Lon: {y}, {x}';

    var mousePositionControl = new ol.control.MousePosition({
        // coordinateFormat: ol.coordinate.createStringXY(2),
        coordinateFormat: function(coord) {return ol.coordinate.format(coord, template, 2);},
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
    });

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
        }).extend([mousePositionControl]),
        view: new ol.View({
            center: [-8139259.370296092, 4705772.670696784],
            zoom: 6,
            minZoom: 5,
            maxZoom: 14
        })
    });

    // app.map = map;
    myApp.mapLayers = getMapLayers();
    myApp.featureOverlay = myApp.mapLayers.getFeatureOverlay(map);

    var layers = {};
    layers['canyons'] = myApp.mapLayers.getCanyonLayer();
    layers['corals'] = myApp.mapLayers.getCoralLayer();
    layers['seabed'] = myApp.mapLayers.getSeabedLayer();

    var activeLayers = {};

    var basemaps = basemaps;
    var currentBasemap = basemap;

    var highlights = [];
    var displayFeatureInfo = function(pixel) {
        var info = document.getElementById('info');
        var features = [];
        map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            // had to do the following to prevent features from being added twice...
            if (features.indexOf(feature) === -1) {
                features.push(feature);
            }        
        });

        var output = '';

        // unhighlight any features no longer under the mouse
        var x = highlights.length;
        while (x--) {
            if (features.indexOf(highlights[x]) === -1) {
                myApp.featureOverlay.removeFeature(highlights[x]);
                highlights.splice(x, 1);
            }
        }
        
        if (features.length) {
            for (feature of features) {                    
                // highlight any features not yet highlighted
                if (highlights.indexOf(feature) === -1) {
                    myApp.featureOverlay.addFeature(feature);
                    highlights.push(feature);
                }

                // create info overlay context
                if (feature) {
                    var text = feature.get('NAME');
                    if (!text) {
                        text = feature.get('ORDER_');
                    }
                    if (!text) {
                        text = feature.get('DRAWING');
                    }
                    if (text) {
                        output += text + '<br>';
                    } 
                }
            }
            info.innerHTML = output;
            info.style.display = 'block';
        } else {
            info.innerHTML = '';
        }
        if (info.innerHTML === '') {        
            info.style.display = 'none';
        }
    };


    $(map.getViewport()).on('mousemove', function(evt) {
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
    });

    // map.on('click', function(evt) {
    //   displayFeatureInfo(evt.pixel);
    // });

    var toggleLayer = function(layerName) {
        if (activeLayers[layerName]) {
            // then de-activate layer
            map.removeLayer(activeLayers[layerName]);
            delete activeLayers[layerName];    
            $('#' + layerName).find('span').removeClass('glyphicon-check');
            $('#' + layerName).find('span').addClass('glyphicon-unchecked');
        } else if (layers[layerName]) {
            // then activate layer
            map.addLayer(layers[layerName]);
            activeLayers[layerName] = layers[layerName];
            $('#' + layerName).find('span').removeClass('glyphicon-unchecked');
            $('#' + layerName).find('span').addClass('glyphicon-check');
        }
    };


    var switchBasemaps = function(basemapName) {
        if (basemaps[basemapName] && currentBasemap !== basemapName) {
            map.removeLayer(basemaps[currentBasemap]);
            map.getLayers().insertAt(1, basemaps[basemapName]);
            // map.layers[0] = map.basemaps[basemapName];
            currentBasemap = basemapName;
            if (currentBasemap === 'streets') {
                $('#export-png').attr('disabled', false);
            } else {
                $('#export-png').attr('disabled', true);
            }
        }
    };


    // Export attempt
    var exportPNG = document.getElementById('export-png');

    if ('download' in exportPNG) {
        exportPNG.addEventListener('click', function(e) {
            map.once('postcompose', function(event) {
                var canvas = event.context.canvas;
                exportPNG.href = canvas.toDataURL('image/png');
            });
            map.renderSync();
        }, false);
    } else {
        var info = document.getElementById('no-download');
        info.style.display = '';
    }

    return {
        map: map,
        layers: layers,
        activeLayers: activeLayers,
        toggleLayer: toggleLayer,
        switchBasemaps: switchBasemaps
    }

})(app || {});

    