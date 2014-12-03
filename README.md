ol3-marco-test
==============

Testing out some MARCO features in OpenLayers 3

## General Notes

### Next Steps
* Drawing (and Editing) 
  * ~~Create new section called Drawings where new buttons will be added for each new drawing~~
  * ~~currently working on converting draw result to a permanent vector layer~~
  * ~~Delete button~~
  * ~~Measuring tools drawing conflicting with Drawing tools~~
  * ~~Add mouseover effect to drawings (that show the area?)~~
  * Edit button
    * not sure how to convey the end of an edit session...
  * might add buttons/handling for polygon, linestring, and point drawing/editing?  
  * see these examples for [drawing](http://openlayers.org/en/v3.0.0/examples/draw-features.html?q=draw) and [modifying drawings](http://openlayers.org/en/v3.0.0/examples/draw-and-modify-features.html?q=draw)
  * see this [example](http://codepen.io/barbalex/pen/kctHB) for saving features
* Add mouseover to Measurement drawings that shows area/length
* Data upload
  * maybe a modal form tha asks for Layer Name, Styling information, and Attribute info?
  * uploading data creates new Data Layer button (with Delete option?)
* Add basemap attribution similar to [this example](http://openlayers.org/en/v3.0.0/examples/measure.html?q=)

### Features to Test include...
* Basic map with base layer, vector layer, xyz layer, and wms (arcrest) layer
 * ~~Basemaps~~
    * ESRI Ocean (experiment with original ESRI Ocean Basemap Layer and new version)
    * Other ESRI Layers - http://www.esri.com/software/arcgis/arcgisonline/maps/maps-and-map-layers 
    * Others?
 * Vector Layer - Submarine Canyons (from portal) with ~~Mouseover~~ and Click interaction
   * [Vector Layer Example](http://openlayers.org/en/v3.0.0/examples/vector-layer.html?q=)
 * Vector Layer with a very large number of vertices
   * see [Synthetic Lines](http://openlayers.org/en/v3.0.0/examples/synthetic-lines.html?q=) or [Synthetic Points](http://openlayers.org/en/v3.0.0/examples/synthetic-points.html?q=) Example
 * XYZ Layer - with mouseover and click interaction
    * ~~[XYZ Example](http://openlayers.org/en/v3.0.0/examples/xyz.html?q=)~~
    * **Known Gap - UTFGrids**
 * ESRI REST - with click interaction
    * maybe the [XYZ ESRI Example](http://openlayers.org/en/v3.0.0/examples/xyz-esri.html?q=) satifies? - nope
    * (in conjunction with [WMS GetFeatureInfo Example](http://openlayers.org/en/v3.0.0/examples/getfeatureinfo-tile.html?q=))
    * **Known Gap - ESRI REST**
 * WMS Layer (OGC) - with click interaction
   * [WMS GetFeatureInfo Example](http://openlayers.org/en/v3.0.0/examples/getfeatureinfo-tile.html?q=)

### Additional OL3 features to explore
* [Layer Spy Example](http://openlayers.org/en/v3.0.0/examples/layer-spy.html?q=spy)
* [Layer Swipe Example](http://openlayers.org/en/v3.0.0/examples/layer-swipe.html)
* [Drag and Drop Example](http://openlayers.org/en/v3.0.0/examples/drag-and-drop.html)
* [Draw Feature Example](http://openlayers.org/en/v3.0.0/examples/draw-features.html?q=)
* [Dynamic Data Example](http://openlayers.org/en/v3.0.0/examples/dynamic-data.html?q=)
* ~~[Export PNG Example](http://openlayers.org/en/v3.0.0/examples/export-map.html?q=)~~
* ~~[Measure Example](http://openlayers.org/en/v3.0.0/examples/measure.html?q=)~~
* [Mobile Full Screen Example](http://openlayers.org/en/v3.0.0/examples/mobile-full-screen.html?q=)
* ~~[Mouse Position Example](http://openlayers.org/en/v3.0.0/examples/mouse-position.html?q=)~~
* ~~[Overlay Example](http://openlayers.org/en/v3.0.0/examples/overlay.html?q=)~~
* ~~[Preload Example](http://openlayers.org/en/v3.0.0/examples/preload.html?q=)~~
* [Select Feature](http://openlayers.org/en/v3.0.0/examples/select-features.html?q=)
* ~~[Vector Layer Example](http://openlayers.org/en/v3.0.0/examples/vector-layer.html?q=)~~
* [WMS GetFeatureInfo Example](http://openlayers.org/en/v3.0.0/examples/getfeatureinfo-tile.html?q=)
* [XYZ ESRI Example](http://openlayers.org/en/v3.0.0/examples/xyz-esri.html?q=)
* ~~[XYZ Example](http://openlayers.org/en/v3.0.0/examples/xyz.html?q=)~~
* ~~[Zoom Constrained Example](http://openlayers.org/en/v3.0.0/examples/zoom-constrained.html?q=)~~
* Not Yet Committed [Drag Features Example](http://erilem.net/ol3/drag-features/examples/drag-features.html?mode=raw)
  * [Github Ticket](https://github.com/openlayers/ol3/issues/2947)
  * [Related?](https://github.com/openlayers/ol3/issues/2945)

### So Far...
* Layer Buttons in Left Column
* Basemaps in Right Column
* Vector Layer with Mouseover
* [Zoom Constrained Example](http://openlayers.org/en/v3.0.0/examples/zoom-constrained.html?q=)
* Rule Based Styling (albeit programmatic) for Coral layer
* Mouseover with multiple vector layers (corals and canyons?)
 * Fall Through feature querying
* Mouse Position
  * [formatting position](http://stackoverflow.com/questions/26880487/formatting-the-mouseposition-control-output-in-openlayers-3/26886981#26886981)
* Export as PNG
  * does not work on many basemaps due to security concerns (CORS issues)
    * see [this question](http://stackoverflow.com/questions/2390232/why-does-canvas-todataurl-throw-a-security-exception) and [this question](http://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror)
  * However, it does work with OSM and it's working with local geojson and S3 map tiles...I think the basemap issue is a big one...will likely want to stick with one of the current strategies (phantomjs, or printing from browser)
  * Also of note, someone created an [alternative export using canvas.toBlob](https://github.com/openlayers/ol3/issues/2968)  (rather than canvas.toDataURL) which permits greater export size
* Preload - not sure I see the difference...
* Measure Example - in process
  * Items Remaining include
    * ~~removing previous measurement drawings when measuring button is unchecked~~
    * ~~output of measurement~~
    * ~~single click to start measurement drawing~~
    * ~~deactivate hover interactivity while measuring~~
    * ~~might remove previous measurement drawing when new drawing is begun~~

### Known Gaps
* UTFGrids - XYZ interactivity
 * http://stackoverflow.com/questions/25751048/utfgrid-support-or-example-for-openlayers-3 
 * [ol3 ticket](https://github.com/openlayers/ol3/issues/922)
* ESRI WMS
 * http://gis.stackexchange.com/questions/118786/displaying-esri-rest-services-in-openlayers-3
 * http://gis.stackexchange.com/questions/121024/arcgis93rest-for-openlayers-3
 * maybe the [XYZ ESRI Example](http://openlayers.org/en/v3.0.0/examples/xyz-esri.html?q=) satisfies...? -- nope
 * [ol3 ticket](https://github.com/openlayers/ol3/issues/654)

## Deploying Locally
You will need to have the following (which I've left out of the repo) in the project's root directory
* bootstrap-3.2.0
* font-awesome-4.2.0
* openlayers3

To prevent cross domain concerns in Chrome you will need to run a local dev server.  One strategy is to run the following from the project's root directory
```
python -m SimpleHTTPServer
```
