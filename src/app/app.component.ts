import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from './api.service';

enum TYPEVIEW { TEMPERATURES, PRECIPITATION }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('charts', { static: false }) charts: ElementRef;

  typeView = TYPEVIEW;
  currentTypeView = TYPEVIEW.TEMPERATURES;
  temperatures: [];
  precipitations: [];
  worker: Worker;
  loading = true;
  startYears = [];
  endYears = [];
  startYear = 0;
  endYear = 0;
  chartData;
  isWorkerDisabled = false;
  options = {
    legend: false, showLabels: true, animations: false, xAxis: true, yAxis: true, showXAxisLabel: true,
    showYAxisLabel: true, xAxisLabel: 'Year', yAxisLabel: 'Temperature', timeline: true, view: [0, 0]
  };

  constructor(private apiService: ApiService) {

  }

  ngOnInit(): void {
    forkJoin([this.apiService.getTemperature(), this.apiService.getPrecipitation()])
      .subscribe(data => {
        this.temperatures = data[0];
        this.precipitations = data[1];
        this.sendMessageToWorker('begin', data);

      });
  }

  testMethod() {
    this.isWorkerDisabled = !this.isWorkerDisabled;
  }

  changeYearsPeriod(startYear?) {
    if (startYear) {
      this.endYears = this.startYears.slice(this.startYears.lastIndexOf(this.startYear), this.startYears.length - 1);
      this.endYear = this.endYears[this.endYears.length - 1];
    }
    this.sendMessageToWorker('average',
      {
        startYear: +this.startYear, endYear: +this.endYear,
        valueArray: this.currentTypeView === 0 ? this.temperatures : this.precipitations
      });
    console.log();
  }

  sendMessageToWorker(workerType: string, value: any): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./worker.worker', { type: 'module' });

      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        this.workerHandler(data);
      };
      worker.postMessage({ type: workerType, payload: value });
    } else {
      this.isWorkerDisabled = true;
    }
  }

  workerHandler = (workerAnswer) => {
    switch (workerAnswer.type) {
      case 'begin':
        this.startYears = workerAnswer.data.years;
        this.endYears = workerAnswer.data.years;
        this.startYear = this.startYears[0];
        this.endYear = this.endYears[this.endYears.length - 1];
        this.sendMessageToWorker('average', { startYear: +this.startYear, endYear: +this.endYear, valueArray: this.temperatures });
        break;
      case 'average':
        this.options.view = [this.charts.nativeElement.clientWidth, this.charts.nativeElement.clientHeight];
        this.chartData = workerAnswer.data;
        break;

      default:
        break;
    }
  }

  changeCurrentViewType(viewType: number): void {
    if (viewType === 0) {
      if (this.currentTypeView === 0) { return; }
      this.currentTypeView = this.typeView.TEMPERATURES;
      this.options.yAxisLabel = 'Temperature';
      this.sendMessageToWorker('average', { startYear: +this.startYear, endYear: +this.endYear, valueArray: this.temperatures });
    } else {
      if (this.currentTypeView === 1) { return; }
      this.currentTypeView = this.typeView.PRECIPITATION;
      this.options.yAxisLabel = 'Precipitation';
      this.sendMessageToWorker('average', { startYear: +this.startYear, endYear: +this.endYear, valueArray: this.precipitations });
    }
  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}

