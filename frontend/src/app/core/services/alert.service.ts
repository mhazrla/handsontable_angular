import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  error(message: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: true,
    });
  }

  success(title: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1500,
    });
  }

  confirm(text: string): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  }
}
