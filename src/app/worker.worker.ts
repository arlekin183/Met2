/// <reference lib="webworker" />

import { Watch, WorkerResponse } from './models/models';

addEventListener('message', ({ data }) => {
  const response: WorkerResponse = { type: data.type };
  switch (data.type) {
    case 'begin':
      response.data = {
        years: getYears(data)
      };
      break;
    case 'average':
      response.data = {
        name: '',
        series: getAverageValues(data)
      };
      break;
  }

  postMessage(response);
});

function getYears(data): Array<any> {
  const allYears = new Set();
  data.payload[0].forEach((item: Watch) => {
    const val = item.t.slice(0, 4);
    allYears.add(val);
  });
  return Array.from(allYears);
}

function getAverageValues(data) {
  const { startYear, endYear } = data.payload;
  const valueArray = data.payload.valueArray.map(item => { item.year = +item.t.slice(0, 4); return item; });
  const returnArray = [];
  for (let index = startYear; index < endYear; index++) {
    const valuesPerYear = valueArray.filter(item => item.year === index);
    const averagePerYear = valuesPerYear.reduce((acc, curr) => acc + curr.v, 0) / valuesPerYear.length;
    returnArray.push({ name: index, value: averagePerYear });
  }
  return returnArray;
}
