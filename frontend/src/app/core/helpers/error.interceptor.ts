import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { ToastService } from 'src/app/account/login/toast-service';
import { AlertService } from '../services/alert.service';
import { Location } from '@angular/common';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private alertService: AlertService,
    private location: Location
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err) {
          let errorMessage = '';
          switch (err.status) {
            case 400:
              errorMessage = err.error?.data?.message || 'Bad Request';
              this.alertService.error(errorMessage);
              break;
            case 401:
              errorMessage = err.error?.data?.message || 'Unauthorized';
              this.alertService.error(errorMessage);
              localStorage.removeItem('toast');
              this.authenticationService.logout();
              location.reload();
              break;
            case 403:
              errorMessage = err.error?.data?.message || 'Forbidden';
              this.alertService.error(errorMessage);
              this.location.back();
              break;
            case 500:
              errorMessage = err.error?.data?.message || 'Internal Server Error';
              this.alertService.error(errorMessage);
              this.location.back();
              break;
            default:
              break;
          }
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
