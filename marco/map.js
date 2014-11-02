
var oceans = new ol.layer.Tile({
    source: new ol.source.XYZ({
        // ESRI Basemaps to explore...
        // World_Street_Map, World_Topo_Map, World_Imagery, NatGeo_World_Map, World_Light_Gray_Base
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

var basemaps = {'oceans': oceans, 'watercolor': watercolor, 'natgeo': natgeo},
    basemap = oceans;

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
    zoom: 6
  })
});

app = {};
app.map = map;
map.layers = {};
map.activeLayers = {};
map.basemaps = basemaps;
map.currentBasemap = basemap;

var styleCache = {};
var canyons = new ol.layer.Vector({
  source: new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/geojson/canyons.json'
  }),
  style: function(feature, resolution) {
    var text = resolution < 5000 ? feature.get('name') : '';
    if (!styleCache[text]) {
      styleCache[text] = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new ol.style.Stroke({
          color: '#319FD3',
          width: 1
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          text: text,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
          })
        })
      })];
    }
    return styleCache[text];
  }
});
map.layers['canyons'] = canyons;

var highlightStyleCache = {};
var featureOverlay = new ol.FeatureOverlay({
  map: map,
  style: function(feature, resolution) {
    var text = resolution < 5000 ? feature.get('name') : '';
    if (!highlightStyleCache[text]) {
      highlightStyleCache[text] = [new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#f00',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0.1)'
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          text: text,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
          })
        })
      })];
    }
    return highlightStyleCache[text];
  }
});

var highlight;
var displayFeatureInfo = function(pixel) {

  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });

  var info = document.getElementById('info');
  if (feature) {
    info.innerHTML = feature.get('NAME');
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

