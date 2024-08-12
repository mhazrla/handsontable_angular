import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { GlobalComponent } from 'src/app/global-component';
import { catchError, Observable, throwError } from 'rxjs';

// const httpOptions = {
//   headers: new HttpHeaders({
//     // 'Content-Type': 'multipart/form-data',
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//   }),
// };

const headerToken = new HttpHeaders({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const httpOptions = {
  headers: headerToken,
  responseType: 'json' as const,
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  /***
   * Get All Vendors
   */
  getAll(url: string): Observable<any> {
    return this.http.get(GlobalComponent.API_DEV + url, httpOptions);
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(GlobalComponent.API_DEV + url, body, httpOptions);
  }

  getSingle(url: string, id: string | number): Observable<any> {
    return this.http.get(GlobalComponent.API_DEV + url + id, httpOptions);
  }

  put(url: string, id: string | number, body: any): Observable<any> {
    return this.http.put(GlobalComponent.API_DEV + url + id, body, httpOptions);
  }

  delete(url: string, id: string | number): Observable<any> {
    return this.http.delete(GlobalComponent.API_DEV + url + id, httpOptions);
  }

  getEmployee(): Observable<any> {
    return this.http.get(GlobalComponent.API_AIO);
  }
}
