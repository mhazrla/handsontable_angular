import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  selector: 'app-yaioff003',
  templateUrl: './yaioff003.component.html',
  styleUrls: ['./yaioff003.component.scss'],
})
export class Yaioff003Component implements OnInit {
  userLogged: any;

  // Data
  yaioff003s: any[] = [];
  yaioff003sToShow: any[] = [];

  // Form
  yaioff003Form!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;
  isProcessed: boolean = false;

  constructor(
    public paginationService: PaginationService,
    private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const userLogin = localStorage.getItem('currentUser') ?? '{}';
    this.userLogged = JSON.parse(userLogin);

    this.yaioff003Form = this.formBuilder.group({
      vendor: [null, [Validators.required]],
      companyCode: [null, [Validators.required]],
      openKeyDate: [null, [Validators.required]],
      normalItems: [null, [Validators.required]],
      specialGLTransaction: [null, [Validators.required]],
      notedItems: [null, [Validators.required]],
      parkedItems: [null, [Validators.required]],
      customerItems: [null, [Validators.required]],
    });
  }

  onProcessing() {
    this.isProcessed = true;
    this.cdr.detectChanges();
  }

  onBackProcessing() {
    this.isProcessed = false;
    this.cdr.detectChanges();
  }
}
