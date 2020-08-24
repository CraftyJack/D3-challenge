// @TODO: YOUR CODE HERE!
var svgHeight = 800;
var svgWidth = 800;

var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 100
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
var chosenYAxis = "poverty";

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
      .domain([d3.min(povertyData, d => d[chosenYAxis]) * 1.2,
        d3.max(povertyData, d => d[chosenYAxis]) * 0.8
      ])
      .range([0, height])
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

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
    ;
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var xLabel;  
        if (chosenXAxis === "income") {
          xLabel = "Income: ";
        }
        else if (chosenXAxis === "age") {
          xLabel = "Age: ";
        }
        else if (chosenXAxis === "healthcare") {
          xLabel = "Healthcare: ";
        }
        else if (chosenXAxis === "obesity") {
          xLabel = "Obesity: ";
        }
        else {
        xLabel = "Smokes: ";
    }

    var yLabel;
        if (chosenYAxis === "poverty") {
        yLabel = "Poverty: ";
        }
        else {
        yLabel = "Obesity: ";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
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
d3.csv("data.csv").then(function(povertyData, err) {
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
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.poverty)])
    .range([height, 0]);
      
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(povertyData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "pink")
      .attr("opacity", ".5");
  
    // Create group for x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var xincomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "income") // value to grab for event listener
      .classed("active", true)
      .text("Median Income in Dollars");
  
    var xobesityLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Percentage of Obesity");
    
    var xageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Median Age");

    var xhealthcareLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 80)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      .text("Healthcare");

    var xsmokesLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 100)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokers");
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Poverty Level");
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          //console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(povertyData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "obesity") {
            xobesityLabel
              .classed("active", true)
              .classed("inactive", false);
            xincomeLabel
              .classed("active", false)
              .classed("inactive", true);
            xageLabel
              .classed("active", false)
              .classed("inactive", true);
            xhealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            xsmokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "income") {
            xobesityLabel
              .classed("active", false)
              .classed("inactive", true);
            xincomeLabel
              .classed("active", true)
              .classed("inactive", false);
            xageLabel
              .classed("active", false)
              .classed("inactive", true);
            xhealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            xsmokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            xobesityLabel
              .classed("active", false)
              .classed("inactive", true);
            xincomeLabel
              .classed("active", false)
              .classed("inactive", true);
            xageLabel
              .classed("active", true)
              .classed("inactive", false);
            xhealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            xsmokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "healthcare") {
            xobesityLabel
              .classed("active", false)
              .classed("inactive", true);
            xincomeLabel
              .classed("active", false)
              .classed("inactive", true);
            xageLabel
              .classed("active", false)
              .classed("inactive", true);
            xhealthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            xsmokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            xobesityLabel
              .classed("active", false)
              .classed("inactive", true);
            xincomeLabel
              .classed("active", false)
              .classed("inactive", true);
            xageLabel
              .classed("active", false)
              .classed("inactive", true);
            xhealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            xsmokesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }).catch(function(error) {
    console.log(error);
  });