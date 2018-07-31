var data = {
	"children": [
	{"freq": 18, "salary": 57176}, 
	{"freq": 19, "salary": 58413}, 
	{"freq": 20, "salary": 59418}, 
	{"freq": 21, "salary": 60891}, 
	{"freq": 22, "salary": 62194}, 
	{"freq": 23, "salary": 63549}, 
	{"freq": 24, "salary": 65123}, 
	{"freq": 25, "salary": 66359}, 
	{"freq": 26, "salary": 67520}, 
	{"freq": 27, "salary": 68986}, 
	{"freq": 28, "salary": 70511}, 
	{"freq": 29, "salary": 71571}, 
	{"freq": 30, "salary": 72800}, 
	{"freq": 31, "salary": 74414}, 
	{"freq": 32, "salary": 75745}, 
	{"freq": 33, "salary": 76477}
	]
};
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "20px sans-serif")
    .text("tooltip");

var diameter = 700;
var color = d3.scaleOrdinal(d3.schemeCategory10); 

var bubble = d3.pack(data).size([diameter, diameter]).padding(1.5);

var svg = d3.selectAll('#salary_chart')
	.append('svg')
	.attr('width', diameter)
	.attr('height', diameter);

var nodes = d3.hierarchy(data).sum(function(d){
	return d.freq;
});

var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            })
            .on("mouseover", function(d) {
              tooltip.text(d.data.freq + " people make $" + d.data.salary);
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", function() {
          	return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		})
      		.on("mouseout", function(){return tooltip.style("visibility", "hidden");});

node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return "$"+d.data.salary;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

 node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.freq;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}