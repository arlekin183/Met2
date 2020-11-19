import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const PROTOCOL = 'http';
const PORT = '3300';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}`;
  }


  getTemperature(): Observable<any> {
    return this.http.get(`${this.baseUrl}/temperature`);
  }

  getPrecipitation(): Observable<any> {
    return this.http.get(`${this.baseUrl}/precipitation`);
  }
}
