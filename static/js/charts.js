// initialize dashboard
function init() {
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// build new data for a newly selected sample
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// build demographics panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata)
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray)
    var result = resultArray[0];
    console.log(result)
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Deliverable 1: Create a Horizontal Bar Chart 

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFiltered = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var results = sampleFiltered[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids;

    var otu_labels = results.otu_labels;

    var sample_values = results.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse();
    var xvalues = sample_values.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barTrace = [{
      x: xvalues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labels.slice(0,10).reverse(),
      marker: {
        color: '#0fb3ba'
      }
    }];

    // 9. Create the layout for the bar chart. 
  
    var barLayout = {
      title: {
      text: "Top 10 Bacteria Cultures Found",
      },
      paper_bgcolor: '#cdf6d2',
      plot_bgcolor: '#cdf6d2',
};

// 10. Use Plotly to plot the data with the layout. 
Plotly.newPlot("bar", barTrace, barLayout);

// Deliverable 2: Create a Bubble Chart
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = [
      {
      type: 'bubble',
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size : sample_values,
        color: otu_ids, 
        colorscale: "YlGnBu"
      }}];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<br><b>Bacteria Cultures Per Sample</b>",
      margin: {t: 0},
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      margin: {t: 30}, 
      paper_bgcolor: '#cdf6d2',
      plot_bgcolor: '#cdf6d2',
  };

    // 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);


// Deliverable 3: Create a Gauge Chart
// 1. Create a variable that filters the metadata array for the object with the desired sample number.
var metadata = data.metadata;

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeArray = metadata.filter(metadataObj => metadataObj.id == sample);
    var gaugeResult = gaugeArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washFrequency = gaugeResult.wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeTrace = [
    {
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Washes Per Week" },
      value: parseFloat(washFrequency),
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
        ]}}];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 425, 
      margin: { t: 0, b: 0 }, 
      paper_bgcolor: '#cdf6d2',
      plot_bgcolor: '#cdf6d2',
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeTrace, gaugeLayout);

  });
}

// Initialize the dashboard
init();