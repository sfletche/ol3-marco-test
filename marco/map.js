
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        // ESRI Basemaps to explore...
        // World_Street_Map, World_Topo_Map, World_Imagery, NatGeo_World_Map, World_Light_Gray_Base
        // url: 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
        // Others include 
        // url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png'
        url: 'http://server.arcgisonline.com/arcgis/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
      })
    })
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

var styleCache = {};
var vectorLayer = new ol.layer.Vector({
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
map.addLayer(vectorLayer);

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

// var highlight;
// var displayFeatureInfo = function(pixel) {

//   var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
//     return feature;
//   });

//   var info = document.getElementById('info');
//   if (feature) {
//     info.innerHTML = feature.getId() + ': ' + feature.get('name');
//   } else {
//     info.innerHTML = '&nbsp;';
//   }

//   if (feature !== highlight) {
//     if (highlight) {
//       featureOverlay.removeFeature(highlight);
//     }
//     if (feature) {
//       featureOverlay.addFeature(feature);
//     }
//     highlight = feature;
//   }

// };

// $(map.getViewport()).on('mousemove', function(evt) {
//   var pixel = map.getEventPixel(evt.originalEvent);
//   displayFeatureInfo(pixel);
// });

// map.on('click', function(evt) {
//   displayFeatureInfo(evt.pixel);
// });

