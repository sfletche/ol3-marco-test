// Drawing Tool

var map = app.map;

// var drawingSource = new ol.source.Vector();

var createDrawingVector = function() {
  return new ol.layer.Vector({
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
};

var polygonDrawingVector = createDrawingVector();
var lineDrawingVector = createDrawingVector();
var pointDrawingVector = createDrawingVector();

var getDrawingVector = function(drawingType) {
  if (drawingType === 'polygon') {
    return polygonDrawingVector;
  } else if (drawingType === 'linestring') {
    return lineDrawingVector;
  } else {
    return pointDrawingVector;
  } 
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
  var drawingVector = getDrawingVector(drawingType);
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
  } else if (drawingType === 'linestring') {
    type = "LineString";
  } else if (drawingType === 'point') {
    type = "Point";
  }
  draw = new ol.interaction.Draw({
    // features: featureOverlay.getFeatures(),
    source: getDrawingVector(drawingType).getSource(),
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
        // then de-activate any measurement layers
        if (map.currentlyMeasuring) {
            map.startMeasuring(map.currentlyMeasuring);
        }
        // and enable drawing
        map.enableDrawing(drawingName);
    }
};

var modifyDrawing = false;
map.editDrawing = function(drawingType) {
    if (modifyDrawing) {
        // then toggle off
        // stop icon spin
        $('#edit-' + drawingType).find('span').removeClass('glyphicon-spin');
        map.removeInteraction(modifyDrawing);
        modifyDrawing = false;
    } else {
        // modifyDrawing = true;
        modifyDrawing = new ol.interaction.Modify({
            features: new ol.Collection(getDrawingVector(drawingType).getSource().getFeatures()),
            // the SHIFT key must be pressed to delete vertices, so
            // that new vertices can be drawn at the same position
            // of existing vertices
            deleteCondition: function(event) {
                return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
            }
        });
        map.addInteraction(modifyDrawing);
        // start icon spinning 
        $('#edit-' + drawingType).find('span').addClass('glyphicon-spin');
    }
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
    var editButton = document.getElementById('edit-'+drawingType);
    editButton.setAttribute('disabled', 'disabled');
    var deleteButton = document.getElementById('delete-'+drawingType);
    deleteButton.setAttribute('disabled', 'disabled');
};
