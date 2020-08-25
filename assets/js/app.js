// @TODO: YOUR CODE HERE!
var svgHeight = 800;
var svgWidth = 800;

var margin = {
  top: 20,
  right: 40,
  bottom: 90,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
;

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
;

// Initial Params
var chosenXAxis = "income";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(povertyData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
        d3.max(povertyData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width])
    ;
    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(povertyData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(povertyData, d => d[chosenYAxis]) * 0.8,
        d3.max(povertyData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0])
    ;
    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis)
    ;
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
      .duration(1000)
      .call(leftAxis)
  ;
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]))
    ;
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xLabel;  
      if (chosenXAxis === "income") {
        xLabel = "Household Income (Median): ";
      }
      else if (chosenXAxis === "age") {
        xLabel = "Age (Median): ";
      }
      else {
        xLabel = "In Poverty (%): ";
      }


    var yLabel;  
      if (chosenYAxis === "healthcare") {
        yLabel = "Lacks Healthcare (%): ";
      }
      else if (chosenYAxis === "obesity") {
        yLabel = "Obesity (%): ";
      }
      else {
        yLabel = "Smokes (%): ";
      }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .style("display", "block")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(povertyData, err) {
    if (err) throw err;
  
    // parse data
    povertyData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });
    console.log(povertyData);
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(povertyData, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = yScale(povertyData, chosenYAxis);
      
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis   
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(povertyData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 8)
      .classed("stateCircle", true);
    
    // circle text
  
    // Create group for x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    var xpovertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("inactive", true)
      .text("In Poverty (%)");
     
    var xageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
  
    var xincomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("active", true)
      .text("Household Income (Median)");
    
    // Create group for y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      // .attr("transform", `translate(${width / 2}, ${height + 20})`);
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
   
    var yobesityLabel = ylabelsGroup.append("text")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obese (%)");

    var ysmokesLabel = ylabelsGroup.append("text")
      .attr("y", 40 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

    var yhealthcareLabel = ylabelsGroup.append("text")
      .attr("y", 60 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");
   
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(povertyData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);
          
          // updates circles with new x-y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            xpovertyLabel
              .classed("active", true)
              .classed("inactive", false);
            xincomeLabel
              .classed("active", false)
              .classed("inactive", true);
            xageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "income") {
            xpovertyLabel
              .classed("active", false)
              .classed("inactive", true);
            xincomeLabel
              .classed("active", true)
              .classed("inactive", false);
            xageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            xpovertyLabel
              .classed("active", false)
              .classed("inactive", true);
            xincomeLabel
              .classed("active", false)
              .classed("inactive", true);
            xageLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
          // replaces chosenYAxis with value
          chosenYAxis = value;
  
          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(povertyData, chosenYAxis);
  
          // updates y axis with transition
          yAxis = renderYAxis(yLinearScale, yAxis);
  
          // updates circles with new x-y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenYAxis === "obesity") {
            yobesityLabel
              .classed("active", true)
              .classed("inactive", false);
            yhealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            ysmokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "healthcare") {
            yobesityLabel
              .classed("active", false)
              .classed("inactive", true);
            yhealthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            ysmokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            yobesityLabel
              .classed("active", false)
              .classed("inactive", true);
            yhealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            ysmokesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }).catch(function(error) {
    console.log(error);
  });