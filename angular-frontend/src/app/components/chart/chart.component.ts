import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators";
import vbp from 'highcharts/indicators/volume-by-price';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() companyHistoricalData;
  @Input() ticker;

  volumeList = [];
  ohlcList = [];
  chartOptions: Options;
  Highcharts: typeof Highcharts = Highcharts;


  constructor() {
    IndicatorsCore(Highcharts);
    vbp(Highcharts);
   }

  ngOnInit(): void {
    for (let i = 0; i < this.companyHistoricalData.length; i++) {
      this.volumeList.push([new Date(this.companyHistoricalData[i].date).getTime(), this.companyHistoricalData[i].volume]);
      this.ohlcList.push([new Date(this.companyHistoricalData[i].date).getTime(), this.companyHistoricalData[i].open, this.companyHistoricalData[i].high, this.companyHistoricalData[i].low, this.companyHistoricalData[i].close]);
    }
    console.log(this.volumeList);
    console.log(this.ohlcList);
    this.buildChart();
  }

  buildChart() {
    // var groupingUnits = [[
    //   'week',                         // unit name
    //   [1]                             // allowed multiples
    // ], [
    //   'month',
    //   [1, 2, 3, 4, 6]
    // ]];
    this.chartOptions = {

      rangeSelector: {
        selected: 2
      },

      title: {
        text: `${this.ticker} Historical`
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      // plotOptions: {
      //   series: {
      //     dataGrouping: {
      //       units: groupingUnits
      //     }
      //   }
      // },

      series: [{
        type: 'candlestick',
        name: this.ticker,
        // id: 'aapl',
        id: this.ticker,
        zIndex: 2,
        data: this.ohlcList
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.volumeList,
        yAxis: 1
      }, {
        type: 'vbp',
        // linkedTo: 'aapl',
        linkedTo: this.ticker,
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        // linkedTo: 'aapl',
        linkedTo: this.ticker,
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    };
  }


}
