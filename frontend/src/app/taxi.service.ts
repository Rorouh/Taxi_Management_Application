import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxiService {
  private url = 'http://localhost:3000/api/taxi';
  constructor(private http: HttpClient) { }

  getTaxis(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  createTaxi(taxi: any): Observable<any> {
    return this.http.post<any>(this.url, taxi);
  }
}
