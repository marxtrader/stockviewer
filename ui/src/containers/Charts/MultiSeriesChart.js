import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("chartdiv", am4charts.XYChart);

// Create axes
let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

for (var i = 0; i < 10; i++) {
  createSeries("value" + i, "Series #" + i);
}
// stock -  against similar

// Create series
function createSeries(s, name) {
  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "value" + s;
  series.dataFields.dateX = "date";
  series.name = name;

  let segment = series.segments.template;
  segment.interactionsEnabled = true;

  let hoverState = segment.states.create("hover");
  hoverState.properties.strokeWidth = 3;

  let dimmed = segment.states.create("dimmed");
  dimmed.properties.stroke = am4core.color("#dadada");

  segment.events.on("over", function(event) {
    processOver(event.target.parent.parent.parent);
  });

  segment.events.on("out", function(event) {
    processOut(event.target.parent.parent.parent);
  });

  let data = [];
  let value = Math.round(Math.random() * 100) + 100;
  for (var i = 1; i < 100; i++) {
    value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 30 + i / 5);
    let dataItem = { date: new Date(2018, 0, i) };
    dataItem["value" + s] = value;
    data.push(dataItem);
  }

  series.data = data;
  return series;
}

chart.legend = new am4charts.Legend();
chart.legend.position = "right";
chart.legend.scrollable = true;
chart.legend.itemContainers.template.events.on("over", function(event) {
  processOver(event.target.dataItem.dataContext);
})

chart.legend.itemContainers.template.events.on("out", function(event) {
  processOut(event.target.dataItem.dataContext);
})

function processOver(hoveredSeries) {
  hoveredSeries.toFront();

  hoveredSeries.segments.each(function(segment) {
    segment.setState("hover");
  })

  chart.series.each(function(series) {
    if (series != hoveredSeries) {
      series.segments.each(function(segment) {
        segment.setState("dimmed");
      })
      series.bulletsContainer.setState("dimmed");
    }
  });
}

function processOut(hoveredSeries) {
  chart.series.each(function(series) {
    series.segments.each(function(segment) {
      segment.setState("default");
    })
    series.bulletsContainer.setState("default");
  });
}