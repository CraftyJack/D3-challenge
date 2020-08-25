// D3 Homework starter file

// Section 1: Pre-Data Setup
// ===========================
// Before we code any data visualizations, we need to at least set up the width, height and margins of the graph.

// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the actual SVG canvas for the graph
// ====================================


// Section 2:  Import the .csv file.
// ====================================
// This data file includes state-by-state demographic data from the US Census and measurements from health risks obtained by the 
//        Behavioral Risk Factor Surveillance System.
// Import our CSV data with d3's .csv import method.
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  visualize(data);
});


// Section 3. Create our visualization function
// ====================================
function visualize(theData) {
// We called a "visualize" function on the data obtained with d3's .csv method.

  // 3.1 Create scale functions
  // ==============================


  // 3.2 Create axis functions
  // ==============================


  // 3.3 Append Axes to the chart
  // ==============================


  // 3.4 Create Circles
  // ==============================

  // 3.4.1 Code here to add abbrevations to the circles
  // ===================================================
  // With the circles on our graph, we need matching labels. Let's grab the state abbreviations from our data
  // and place them in the center of our dots.


  // 3.5 Tool tip and tool tip event listeners
  // ==============================


  // 3.6 Create axes labels
  // ==============================
  

  // 3.7 Code here to add abbrevations to the circles
  // ===================================================

 }
