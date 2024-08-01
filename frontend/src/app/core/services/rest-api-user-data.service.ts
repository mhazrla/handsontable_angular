import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRole } from '../models/master-admin.model';
import { GlobalComponent } from 'src/app/global-component';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({ providedIn: 'root' })
export class RestApiUserDataService {
  constructor(private http: HttpClient) {}

  /***
   * Get All UserRole
   */
  getAllUsers(): Observable<any> {
    return this.http.get(GlobalComponent.API_DEV + GlobalComponent.user);
  }

  // Single
  getSingleUser(id: any): Observable<any> {
    return this.http.get(
      GlobalComponent.API_DEV + GlobalComponent.user + id,
      httpOptions
    );
  }

  postUser(user: UserRole): Observable<any> {
    return this.http.post(
      GlobalComponent.API_DEV + GlobalComponent.user,
      JSON.stringify(user),
      httpOptions
    );
  }

  putUser(user: UserRole): Observable<any> {
    return this.http.put(
      GlobalComponent.API_DEV + GlobalComponent.user + user.id,
      JSON.stringify(user),
      httpOptions
    );
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(
      GlobalComponent.API_DEV + GlobalComponent.user + id,
      httpOptions
    );
  }

  /***
   * Get All Users from API
   */
  getAllUsersFromApi(): Observable<any> {
    return this.http.get(GlobalComponent.API_AIO, httpOptions);
  }
}
