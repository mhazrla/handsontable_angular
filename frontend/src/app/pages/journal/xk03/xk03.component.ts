import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-xk03',
  templateUrl: './xk03.component.html',
  styleUrls: ['./xk03.component.scss'],
  providers: [PaginationService],
})
export class Xk03Component {
  Default = [{ name: 'Choice 1' }, { name: 'Choice 2' }, { name: 'Choice 3' }];
  userLogged: any;

  // Form
  xk03Form!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;

  constructor(
    public paginationService: PaginationService,
    private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const userLogin = localStorage.getItem('currentUser') ?? '{}';
    this.userLogged = JSON.parse(userLogin);

    this.xk03Form = this.formBuilder.group({
      vendor: [null, [Validators.required]],
      companyCode: [null, [Validators.required]],
    });
  }
}
