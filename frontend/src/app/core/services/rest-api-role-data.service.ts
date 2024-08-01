import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { RolePermission } from '../models/master-admin.model';
import { GlobalComponent } from 'src/app/global-component';
import { catchError, Observable, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({ providedIn: 'root' })
export class RestApiRoleDataService {
  constructor(private http: HttpClient) {}

  /***
   * Get All RolePermission
   */
  getAllRolePermissions(): Observable<any> {
    var headerToken = {
      Authorization: `Bearer ` + localStorage.getItem('token'),
    };
    return this.http.get(GlobalComponent.API_DEV + GlobalComponent.role, {
      headers: headerToken,
      responseType: 'json',
    });
  }

  // Single
  getSingleRolePermission(id: any): Observable<any> {
    var headerToken = {
      Authorization: `Bearer ` + localStorage.getItem('token'),
    };
    return this.http.get(GlobalComponent.API_DEV + GlobalComponent.role + id, {
      headers: headerToken,
      responseType: 'text',
    });
  }

  postRolePermission(role: RolePermission): Observable<any> {
    return this.http.post(
      GlobalComponent.API_DEV + GlobalComponent.role,
      JSON.stringify(role),
      httpOptions
    );
  }

  putRolePermission(role: RolePermission): Observable<any> {
    return this.http.put(
      GlobalComponent.API_DEV + GlobalComponent.role + role.role_id,
      JSON.stringify(role),
      httpOptions
    );
  }

  deleteRolePermission(id: any): Observable<any> {
    var headerToken = {
      Authorization: `Bearer ` + localStorage.getItem('token'),
    };
    return this.http.delete(
      GlobalComponent.API_DEV + GlobalComponent.role + id,
      {
        headers: headerToken,
        responseType: 'text',
      }
    );
  }

  /***
   * Get All Permissions
   */
  getAllPermissions(): Observable<any> {
    var headerToken = {
      Authorization: `Bearer ` + localStorage.getItem('token'),
    };
    return this.http.get(
      GlobalComponent.API_DEV + GlobalComponent.permissions,
      {
        headers: headerToken,
        responseType: 'json',
      }
    );
  }

  /***
   * Get All Roles
   */
  getAllRoles(): Observable<any> {
    var headerToken = {
      Authorization: `Bearer ` + localStorage.getItem('token'),
    };
    return this.http.get(GlobalComponent.API_DEV + GlobalComponent.roles, {
      headers: headerToken,
      responseType: 'json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
