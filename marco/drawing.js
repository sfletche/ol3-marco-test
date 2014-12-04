// Drawing Tool

var map = app.map;

// var drawingSource = new ol.source.Vector();

var drawingVector = new ol.layer.Vector({
  source: new ol.source.Vector(),
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
// var featureOverlay = new ol.FeatureOverlay({
//   style: new ol.style.Style({
//     fill: new ol.style.Fill({
//       color: 'rgba(255, 255, 255, 0.2)'
//     }),
//     stroke: new ol.style.Stroke({
//       color: '#ffcc33',
//       width: 2
//     }),
//     image: new ol.style.Circle({
//       radius: 7,
//       fill: new ol.style.Fill({
//         color: '#ffcc33'
//       })
//     })
//   })
// });
// featureOverlay.setMap(map);

var getDrawingLayer = function(evt) {
    return drawingVector.getSource();
};

var addNewDrawing = function(evt, drawingType) {
  // enable the drawing buttons 
  var drawingButton = document.getElementById(drawingType);
  drawingButton.removeAttribute('disabled');
  var editButton = document.getElementById('edit-'+drawingType);
  editButton.removeAttribute('disabled');
  var deleteButton = document.getElementById('delete-'+drawingType);
  deleteButton.removeAttribute('disabled');
  $('#'+drawingType).find('span').removeClass('glyphicon-unchecked');
  $('#'+drawingType).find('span').addClass('glyphicon-check');  

  // add drawing to map layers
  map.layers[drawingType] = drawingVector;
  drawingVector.getSource().getFeatures()[0].set('DRAWING', drawingType.charAt(0).toUpperCase() + drawingType.slice(1));
  map.addLayer(map.layers[drawingType]);
  map.activeLayers[drawingType] = map.layers[drawingType]; 

  // end the drawing process
  map.removeInteraction(draw); 
};

var draw; // global so we can remove it later
map.enableDrawing = function(drawingType) {
  var type = "Polygon";
  if (drawingType === 'polygon') {
    type = "Polygon";
  }
  draw = new ol.interaction.Draw({
    // features: featureOverlay.getFeatures(),
    source: drawingVector.getSource(),
    type: /** @type {ol.geom.GeometryType} */ type
  });
  // draw.on('drawstart', function(evt) {
  //   source.clear();
  // });
  draw.on('drawend', function(evt) {
    addNewDrawing(evt, drawingType);
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
    } else {
        map.enableDrawing(drawingName);
    }
};

var modifyDrawing;
map.editDrawing = function() {
    // modifyDrawing = new ol.interaction.Modify({
    //     features: drawingVector.getSource().getFeatures(),
    //     // the SHIFT key must be pressed to delete vertices, so
    //     // that new vertices can be drawn at the same position
    //     // of existing vertices
    //     deleteCondition: function(event) {
    //         return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
    //     }
    // });
    // map.addInteraction(modifyDrawing);
};

map.deleteDrawing = function(drawingType) {
    // uncheck drawings button
    $('#' + drawingType).find('span').removeClass('glyphicon-check');
    $('#' + drawingType).find('span').addClass('glyphicon-unchecked');
    // remove drawings layer
    map.removeLayer(map.activeLayers[drawingType]);
    delete map.activeLayers[drawingType];   
    map.layers[drawingType].getSource().clear(); 
    delete map.layers[drawingType];
    // disable drawing buttons
    // var drawingButton = document.getElementById(drawingType);
    // drawingButton.setAttribute('disabled', 'disabled');
    var editButton = document.getElementById('edit-'+drawingType);
    editButton.setAttribute('disabled', 'disabled');
    var deleteButton = document.getElementById('delete-'+drawingType);
    deleteButton.setAttribute('disabled', 'disabled');
};
