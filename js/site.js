function generateringComponent(vardata, vargeodata){
var lookup = genLookup(vargeodata) ;
var Imap = dc.leafletChoroplethChart('#MapInform');
var cf = crossfilter(vardata) ;
var all = cf.groupAll();
var mapDimension = cf.dimension(function(d) { return d.country_code});
var mapGroup = mapDimension.group().reduceSum(function(d){ return d.datasets});

dc.dataCount('#count-info')
  .dimension(cf)
  .group(all);
  
   Imap.width(200)
       .height(400)
       .dimension(mapDimension)
       .group(mapGroup)
       .label(function (p) { return p.key; })
       .renderTitle(true)
       .center([0,0])
       .zoom(0)
       .geojson(vargeodata)
       .colors(['#cce0f0','#99c1e1', '#66a1d1', '#3382c2', '#0063b3'])
       .colorDomain([0,4])
       .colorAccessor(function (d){
        var c = 0
           if (d>6) {
                 c = 4;
               } else if (d>3) {
                    c = 3;
               } else if (d>0){
                  c = 1;
              
              }
               return c
        })
       .featureKeyAccessor(function (feature){
          return feature.properties['country_code'];
          }).popup(function (d){
          return '<h5>'+ d.properties['country_name'] +'</h5> '+'<h7><b>'+'Number of datasets'+'</b></h7>';
       })
          
        .renderPopup(true);
//begin test

//remove loader
    $('.sp-circle').remove();
    $('.container').show();

   
      
      dc.renderAll();

      var map = Imap.map({ 
        /*maxZoom: 5,
        minZoom: 3*/
      });

      zoomToGeom(vargeodata);
      function zoomToGeom(geodata){
        var bounds = d3.geo.bounds(geodata) ;
        map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]])
            .setZoom(1)
            .setView([5, 10.37], 2)
            .dragging.disable();
      }
    map.keyboard.disable();
    
 Winheight = $(window).height();
     $("#MapInform").css("background-color","#FFFFFF");
     
      function genLookup(geojson) {
        var lookup = {} ;
        geojson.features.forEach(function (e) {
          lookup[e.properties['country_code']] = String(e.properties['country_name']);
        });
        return lookup ;
      }
}

var dataCall = $.ajax({
    type: 'GET',
    url: 'data/InformData2.json',
    dataType: 'json',
});

var geomCall = $.ajax({
    type: 'GET',
    url: 'data/worldmap.geojson',
    dataType: 'json',
});

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var geom = geomArgs[0];
    geom.features.forEach(function(e){
        e.properties['country_code'] = String(e.properties['country_code']);
    });
    generateringComponent(dataArgs[0],geom);
});

// testing