import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import config from '../../config'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Get data for graphing
async function getDataAsync(ticker) {
  if (ticker == null || ticker == '') return {data:[]}
  let response = axios({
    method: 'get',
    url: `${config.stocks.eod}/${ticker}`, // gets all the records for a particular stock. 
    config: { headers: { 'Content-Type': 'application/json' } }
  })
  //console.log(response)
  return response
}

class SingleSeriesChart extends Component {

  constructor(props) {
    super(props);
    console.log("Props: ", props)
    this.state = {
      ticker: props.ticker
    }
  }

  componentDidMount = () => {
    let data = []
    let ticker = this.props.ticker
    console.log("Query: ", this.props.ticker)
    getDataAsync(ticker)
      .then(function (response) {
        for (let i = 0; i < response.data.length; i++) {
          data.push({ "date": response.data[i].d, "name": response.data[i].T, "value": response.data[i].c });
        }
      })
      .then(() => {
        let chart = am4core.create("chartdiv", am4charts.XYChart);

        chart.paddingRight = 20;

        //This line sorts the data so its in order before it goes in
        chart.data = data.map((d,i)=>({i,t:new Date(d.date).getTime()})).sort((a,b)=>a.t-b.t).map(d=>data[d.i]) //this.state.series;
        
        chart.dateFormatter.dateFormat = "yyyy-MM-dd";
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";

        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;

        this.chart = chart;
      });

  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default SingleSeriesChart;