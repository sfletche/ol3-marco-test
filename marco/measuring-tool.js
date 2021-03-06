
// Measuring Tool
app.measuringTool = (function() {
    var map = app.map;

    // var measuringSource = new ol.source.Vector();

    var measuringVector = new ol.layer.Vector({
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

    /**
     * Currently drawed feature
     * @type {ol.Feature}
     */
    var sketch;


    /**
     * Element for currently drawed feature
     * @type {Element}
     */
    var sketchElement = document.getElementById('measureOutput');


    /**
     * handle pointer move
     * @param {Event} evt
     */
    var mouseMoveHandler = function(evt) {
      if (sketch) {
          var output;
          var geom = (sketch.getGeometry());
          if (geom instanceof ol.geom.Polygon) {
              output = 'Area: ' + formatArea(/** @type {ol.geom.Polygon} */ (geom));

          } else if (geom instanceof ol.geom.LineString) {
              output = 'Length: ' + formatLength( /** @type {ol.geom.LineString} */ (geom));
          }
          sketchElement.innerHTML = output;
      }
    };

    $(map.getViewport()).on('mousemove', mouseMoveHandler);


    var measuringDraw; // global so we can remove it later
    var addInteraction = function(type) {
        // var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
        measuringDraw = new ol.interaction.Draw({
            source: measuringVector.getSource(),
            type: /** @type {ol.geom.GeometryType} */ (type)
        });
        map.addInteraction(measuringDraw);

        measuringDraw.on('drawstart', function(evt) {
            // remove any previous drawings
            measuringVector.getSource().clear();
            // set sketch
            sketch = evt.feature;        
        }, this);

        measuringDraw.on('drawend', function(evt) {
            // unset sketch
            sketch = null;
            if (type === 'Polygon') {
                evt.feature.set('DRAWING', 'Area: ' + formatArea(evt.feature.getGeometry())); 
            } else {            
                evt.feature.set('DRAWING', 'Length: ' + formatLength(evt.feature.getGeometry())); 
            }   
        }, this);
    };


    /**
     * format length output
     * @param {ol.geom.LineString} line
     * @return {string}
     */
    var formatLength = function(line) {
        var length = Math.round(line.getLength() * 100) / 100;
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) + ' ' + 'm';
        }
        return output;
    };


    /**
     * format length output
     * @param {ol.geom.Polygon} polygon
     * @return {string}
     */
    var formatArea = function(polygon) {
        var area = polygon.getArea();
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    var currentlyMeasuring = false;

    var startMeasuring = function(type) {
        if (currentlyMeasuring) {
            sketchElement.innerHTML = "";
            //remove features from draw
            // var iter = draw.source_.getFeatures().values();
            // while (!(entry = iter.next()).done) { 
            //     draw.source_.removeFeature(entry.value); 
            // }
            measuringVector.getSource().clear(); 
            // uncheck the measuring checkbox
            $('#' + currentlyMeasuring).find('span').removeClass('glyphicon-check');
            $('#' + currentlyMeasuring).find('span').addClass('glyphicon-unchecked');
            // vector.source = new ol.source.Vector();
            // remove vector layer from map
            map.removeLayer(measuringVector);
            // remove draw Interaction
            map.removeInteraction(measuringDraw);
            // if unchecking a measuring box, then end here
            if (currentlyMeasuring === type) {
                currentlyMeasuring = false;
                return;          
            }
        } 
        currentlyMeasuring = type;
        map.addLayer(measuringVector);
        $('#' + type).find('span').removeClass('glyphicon-unchecked');
        $('#' + type).find('span').addClass('glyphicon-check');
        if (type === 'length') {
            addInteraction('LineString');
        } else {
            addInteraction('Polygon');
        }
    };

    return {
        currentlyMeasuring: currentlyMeasuring,
        startMeasuring: startMeasuring
    };

})();



