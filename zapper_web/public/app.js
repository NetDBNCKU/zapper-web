
//var mymap = L.map('map').setView([51.505, -0.09], 13);
// light theme
// 	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'your.mapbox.project.id',
// }).addTo(mymap);

/*		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
}).addTo(mymap);*/
  var map = L.map('map').setView([22.969919,120.210703], 13);
  mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'your.mapbox.project.id',
      accessToken: 'pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg'
  }).addTo(map);
        
  /* Initialize the SVG layer */
  map._initPathRoot(); 
  //L.svg().addTo(map);
  /* We simply pick up the SVG from the map object */
  var svg = d3.select("#map").select("svg");
  g = svg.append("g");

  d3.json("zapper_data.json", function(collection) {
    collection.forEach(function(d) {
      d.LatLng = new L.LatLng(d.lng, d.lat)

      switch(d.status) {
        case 1:
            d.color = "65FF29";
            break;
        case 2:
            d.color = "E8DF2E";
            break;
        case 3:
            d.color = "FFC440";
            break;
        case 4:
            d.color = "E8732E";
            break;
        case 5:
            d.color = "FF3333";
            break;
        default:
            d.color = "FFC440";
            break;
      }

    });
    var radius = 5;
    
    var feature = g.selectAll("circle")
      .data(collection)
      .enter().append("circle")
      .style("stroke", function(d) { return d.color })
      .style("opacity", .6) 
      .style("fill", function(d) { return d.color })
      .attr("stroke-width", 20)
      .attr("r", radius)
      .attr('id', function(d) { return "z"+d.zapper_id })
      .each(pulse);  
    
    map.on("viewreset", update);
    update();

    

    function update() {
      feature.attr("transform", 
      function(d) { 
        return "translate("+ 
          map.latLngToLayerPoint(d.LatLng).x +","+ 
          map.latLngToLayerPoint(d.LatLng).y +")";

        }
      )
    }

    function pulse() {
      var circle = d3.select(this);
      circle = circle.transition()
        .duration(1000)
        .attr("stroke-width", 20)
        .attr("r", function(d) { 
          if (d.u_or_d == "up")
            return 10;
          else if (d.u_or_d == "down")
            return 1;
          else
            return 7;
        })
        .ease('sine');
    }

    repeat();

    function repeat() {
      setInterval(function(){       
        var circle = d3.selectAll("circle");
        circle = circle.transition()
          .duration(1000)
          .attr("stroke-width", 20)
          .attr("r", function(d){return Math.floor((Math.random() * 20) + 1)})
          .ease('sine'); 
      }, 3000);
    }

  });

  var svg2 = d3.select(map.getPanes().overlayPane).append("svg"),
  g2 = svg2.append("g").attr("class", "leaflet-zoom-hide");
   
  d3.json("trend_data.json", function(collection) {
    
    //  create a d3.geo.path to convert GeoJSON to SVG
    var transform = d3.geo.transform({point: projectPoint}),
              path = d3.geo.path().projection(transform);
   
    // create path elements for each of the features
    d3_features = g2.selectAll("path")
     .data(collection.features)
     .enter().append("path");

    map.on("viewreset", reset);

    reset();

    // fit the SVG element to leaflet's map layer
    function reset() {
          
     bounds = path.bounds(collection);

     var topLeft = bounds[0],
      bottomRight = bounds[1];

     svg2.attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[1] - topLeft[1])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[1] + "px");

     g2.attr("transform", "translate(" + -topLeft[0] + "," 
                                       + -topLeft[1] + ")");

     // initialize the path data 
     d3_features.attr("d", path)
      .style("stroke", "red")
      .attr("stroke-width", 10)
      .attr('fill','none');
    } 

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
     var point = map.latLngToLayerPoint(new L.LatLng(y, x));
     this.stream.point(point.x, point.y);
    }

  });