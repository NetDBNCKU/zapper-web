  var map = L.map('map').setView([22.969919,120.210703], 13);
  mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  var EVENT_COLOR_HEX = ['#BD3F32','rgba(203, 87, 75, 0.85)','rgba(203, 87, 75, 0.7)',
                         'rgba(203, 87, 75, 0.55)','rgba(203, 87, 75, 0.4)','rgba(203, 87, 75, 0.25)'];
  var currentEventNum = 0;
  var MAX_EVENT_NUM = 50;
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
    
    var idCounter = 1;
    var eventIndex = 0;
    var fakeTimes = [];
    for(var i = 0;i < collection.features.length;i++)
        fakeTimes.push(Math.floor(Math.random() * 200));

    currentEventNum += collection.features.length;
    if( currentEventNum > MAX_EVENT_NUM){
      $('#list ol').empty();
      currentEventNum = 0;
    }

    fakeTimes.sort(function(a,b) {
        return b - a;
    });

    var events = collection.features.slice();
    events.forEach(function(event){
      var fakeIds = [];
      for(var i = 0;i < 3;i++){
        fakeIds.push('id '+idCounter);
        idCounter++;
      }
      addEventListItem(fakeIds, fakeTimes[eventIndex], EVENT_COLOR_HEX[eventIndex> 5? 5:eventIndex]);
      eventIndex++;
    });

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

    function addEventListItem(zapperIds, times, colorHex){
      var html = '<li style="background-color:' + colorHex + '">(' + zapperIds[0]+ ', ' + zapperIds[1]+ ' ,' + zapperIds[2]+ '), ' + times + ' times</li>';
      $('#list ol').append(html);
    }

  });