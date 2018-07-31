

/******************************************************************************
 * Commonalities for both vertical and horizontal charts
 *****************************************************************************/


// Bar colors for male/female
color_map = {Male: '#24D5D8', Female: '#38B487'};

// Setup SVG area for chart
var margin = {top: 50, right: 5, bottom: 50, left: 100};
var fullWidth = 1000;
var fullHeight = 530;
var width = fullWidth - margin.right - margin.left;
var height = fullHeight - margin.top - margin.bottom;

// Function used to switch between vertical and horizontal bar charts
// NOTE: trying to get transition to work but can't figure this out
function updateChart(button) {
  if (button.value == 'Dept') {
    svgVert.transition().duration(5000).attr('display', 'none')
    svgHoriz.transition().duration(5000).attr('display', 'inline')
    button.value = 'All'
  } else if (button.value == 'All') {
    svgHoriz.transition().duration(5000).attr('display', 'none')
    svgVert.transition().duration(5000).attr('display', 'inline')
    button.value = 'Dept'
  }
}


/******************************************************************************
 * Vertical chart for by-department gender distribution
 *****************************************************************************/


// Data for by-department vertical bar chart
var data = [
    {dept: 'Quality Management', male: 10921, female: 7374},
    {dept: 'Finance', male: 9273, female: 6306},
    {dept: 'Research', male: 11587, female: 7698},
    {dept: 'Human Resources', male: 9701, female: 6370},
    {dept: 'Marketing', male: 11111, female: 7315},
    {dept: 'Development', male: 46218, female: 30740},
    {dept: 'Customer Service', male: 13101, female: 8712},
    {dept: 'Production', male: 39885, female: 26790},
    {dept: 'Sales', male: 28176, female: 18746},
];

// SVG element containing the vertical bar chart
var svgVert = d3.select('#gender_chart').append('svg')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', fullWidth)
  .attr('height', fullHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Create x axis scale for vertical by-dept chart
var depts  = data.map(function(d) {
  return d.dept
});

var deptScale = d3.scaleBand()
  .domain(depts)
  .range([0, width])
  .paddingInner(0.1);

var bandwidth = deptScale.bandwidth() / 2.5;

// Create y axis scale for vertical by-dept chart
var maxVal = d3.max(data, function(d) { return Math.max(d.male, d.female); });
var valScale = d3.scaleLinear()
  .domain([0, maxVal])
  .range([height, 0])
  .nice();

// Create and configure x and y axes for vertical by-dept chart
var xAxis = d3.axisBottom(deptScale);
var yAxis = d3.axisLeft(valScale);

var xAxisEle = svgVert.append('g')
  .classed('x axis', true)
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis);

var yAxisEle = svgVert.append('g')
  .classed('y axis', true)
  .call(yAxis);

var xText = xAxisEle.append('text')
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('dx', width/2)
  .attr('dy', '2em')
  .style('font-size', 24)
  .style('font-weight', 'bold')
  .text('Departments');

var yText = yAxisEle.append('text')
  .attr('transform', 'rotate(-90)translate(-' + height/2 + ', -20)')
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('dy', '-2em')
  .style('font-size', 24)
  .style('font-weight', 'bold')
  .text('No. Employees');

// Create container for vertical bars
var barHolder = svgVert.append('g')
  .classed('bar-holder', true);

var bars = barHolder.selectAll('rect.bar').data(data).enter()

// Add male bars to bar container
bars.append('rect')
    .classed('bar', true)
    .attr('x', function(d, i) {
      return deptScale(d.dept) + 7;
    })
    .attr('width', bandwidth)
    .attr('y', function(d) {
      return valScale(d.male);
    })
    .attr('height', function(d) {
      return height - valScale(d.male);
    })
    .style('fill', color_map['Male']);

// Add female bars to bar container
bars.append('rect')
     .classed('bar', true)
     .attr('x', function(d, i) {
       return (deptScale(d.dept) + bandwidth + 11);
     })
     .attr('width', bandwidth)
     .attr('y', function(d) {
       return valScale(d.female);
     })
     .attr('height', function(d) {
       return height - valScale(d.female);
     })
     .style('fill', color_map['Female']);

// Create legend for vertical bar chart
var legend = svgVert.append("g")
  .attr("class", "legend")
  .attr("x", 65)
  .attr("y", 25)
  .attr("height", 100)
  .attr("width", 200);

// Add text/color indicator for male bars
legend.append("text")
  .attr("x",  65)
  .attr("y", 20)
  .text(function(d) { return 'Male'; });

legend.append("rect")
  .attr("x", 130)
  .attr("y", 5)
  .attr("width", 100)
  .attr("height", 20)
  .style("fill", function(d) { return color_map['Male']});

// Add text/color indicator for female bars
legend.append("text")
  .attr("x",  65)
  .attr("y", 50)
  .text(function(d) { return 'Female'; });

legend.append("rect")
  .attr("x", 130)
  .attr("y", 35)
  .attr("width", 100)
  .attr("height", 20)
  .style("fill", function(d) { return color_map['Female']});


/******************************************************************************
 * Horizontal chart for all departments gender distribution
 *****************************************************************************/


// Data for all-department horizontal bar chart
var agg_data = [
    {gender: 'Male', count: 0},
    {gender: 'Female', count: 0}
];

male_total = 0;
female_total = 0;

data.forEach(function (d) {
    male_total += d.male;
    female_total += d.female;
});

agg_data[0].count = male_total;
agg_data[1].count = female_total;

// SVG element containing the horizontal bar chart
var svgHoriz = d3.select('#gender_chart').append('svg')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', fullWidth)
  .attr('height', fullHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('display', 'none');

// Create x axis scalefor horizontal bar chart
var counts = agg_data.map(function(d) {
    return d.count
});

var maxVal = d3.max(counts);

var valScale = d3.scaleLinear()
  .domain([0, maxVal])
  .range([0, width-20])
  .nice();

// Create y axis scale for horizontal bar chart
var genders = agg_data.map(function(d) {
  return d.gender
});

var genderScale = d3.scaleBand()
  .domain(genders)
  .range([0, height]);

var bandwidth = genderScale.bandwidth() / 2.5;

// Create and configure x and y axes for horizontal bar chart
var xAxis = d3.axisBottom(valScale);
var yAxis = d3.axisLeft(genderScale);

var xAxisEle = svgHoriz.append('g')
  .classed('x axis', true)
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis);

var yAxisEle = svgHoriz.append('g')
  .classed('y axis', true)
  .call(yAxis);

var xText = xAxisEle.append('text')
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('dx', width/2)
  .attr('dy', '2em')
  .style('font-size', 24)
  .style('font-weight', 'bold')
  .text('No. Employees');

var yText = yAxisEle.append('text')
  .attr('transform', 'rotate(-90)translate(-' + height/2 + ', -20)')
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('dy', '-2em')
  .style('font-size', 24)
  .style('font-weight', 'bold')
  .text('Gender');

// Create container for horizontal bars
var barHolderHoriz = svgHoriz.append('g')
  .classed('bar-holder', true);

var bars = barHolderHoriz.selectAll('rect.bar').data(agg_data).enter()

// Add bars to horizontal bar container
bars.append('rect')
    .classed('bar', true)
    .attr('x', function(d, i) {
      return 0;
    })
    .attr('width', function(d) {
        return valScale(d.count);
    })
    .attr('y', function(d, i) {
      return genderScale(d.gender) + 90;
    })
    .attr('height', function(d) {
      return bandwidth;
    })
    .attr('fill', function(d) {
      return color_map[d.gender];
    });
