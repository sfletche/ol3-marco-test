var usa = ol.proj.transform([-99, 39], 'EPSG:4326', 'EPSG:3857');

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        // ESRI Basemaps to explore...
        // World_Street_Map, World_Topo_Map, World_Imagery, NatGeo_World_Map, World_Light_Gray_Base
        // url: 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
        // Others include 
        url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png'
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
    center: usa,
    zoom: 3
  })
});
app = {};
app.map = map;

