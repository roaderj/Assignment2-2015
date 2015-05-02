var width = 960;
var height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

var spinnerVisible = false;
if (!spinnerVisible) {
  $("div#spinner").fadeIn("fast");
  spinnerVisible = true;
}

//get json object which contains media counts
d3.json('/igFollows', function(error, data) {
  if (spinnerVisible) {
    var spinner = $("div#spinner");
    spinner.stop();
    spinner.fadeOut("fast");
    spinnerVisible = false;
  }
  
  var graph = {};
  var nodes = [];
  data.users.forEach(function(item){
    var node = {};
    node.name = item.username;
    node.group = Math.floor(Math.random() * 20);
    nodes.push(node);
  }); 
  graph.nodes = nodes;
  var links = [];
  graph.links = links;
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g").attr("class", "node-group")
      .call(force.drag);
    
  node.append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })

  node.append("title")
      .text(function(d) { return d.name; });
  
  node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) {
        return d.name;
    });


  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
});

