// Drawing Tool

var map = app.map;

var source = new ol.source.Vector();

var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});

// The features are not added to a regular vector layer/source,
// but to a feature overlay which holds a collection of features.
// This collection is passed to the modify and also the draw
// interaction, so that both can add or modify features.
var featureOverlay = new ol.FeatureOverlay({
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});
featureOverlay.setMap(map);

// var modify = new ol.interaction.Modify({
//   features: featureOverlay.getFeatures(),
//   // the SHIFT key must be pressed to delete vertices, so
//   // that new vertices can be drawn at the same position
//   // of existing vertices
//   deleteCondition: function(event) {
//     return ol.events.condition.shiftKeyOnly(event) &&
//         ol.events.condition.singleClick(event);
//   }
// });
// map.addInteraction(modify);

var getDrawingLayer = function(evt) {
    return vector.getSource();
};

var addNewDrawing = function(evt) {
  // console.log(evt);
  // var drawingDiv = document.getElementById('drawings');
  // var button = document.createElement('a');
  // drawingDiv.appendChild(button);
  // button.id = 

  // enable the drawing button 
  var drawingButton = document.getElementById('drawings');
  drawingButton.removeAttribute('disabled');
  $('#drawings').find('span').removeClass('glyphicon-unchecked');
  $('#drawings').find('span').addClass('glyphicon-check');  

  // add drawing to map layers
  map.layers['drawings'] = vector;
  map.addLayer(map.layers['drawings']);
  map.activeLayers['drawings'] = map.layers['drawings']; 
  
  // end the drawing process
  map.removeInteraction(draw); 
};

var draw; // global so we can remove it later
map.enableDrawing = function() {
  draw = new ol.interaction.Draw({
    // features: featureOverlay.getFeatures(),
    source: source,
    type: /** @type {ol.geom.GeometryType} */ "Polygon"
  });
  draw.on('drawend', function(evt) {
    addNewDrawing(evt);
  });
  map.addInteraction(draw);
};

map.toggleDrawing = function(drawingName) {
    if (map.activeLayers[drawingName]) {
        // then de-activate layer
        map.removeLayer(map.activeLayers[drawingName]);
        delete map.activeLayers[drawingName];    
        $('#' + drawingName).find('span').removeClass('glyphicon-check');
        $('#' + drawingName).find('span').addClass('glyphicon-unchecked');
    } else if (map.layers[drawingName]) {
        // then activate layer
        map.addLayer(map.layers[drawingName]);
        map.activeLayers[drawingName] = map.layers[drawingName];
        $('#' + drawingName).find('span').removeClass('glyphicon-unchecked');
        $('#' + drawingName).find('span').addClass('glyphicon-check');
    }
};
