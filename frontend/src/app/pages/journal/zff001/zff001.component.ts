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
  selector: 'app-zff001',
  templateUrl: './zff001.component.html',
  styleUrls: ['./zff001.component.scss'],
})
export class Zff001Component implements OnInit {
  userLogged: any;

  // Data
  zff001s: any[] = [];
  zff001sToShow: any[] = [];

  // Form
  zff001Form!: FormGroup;
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
    const currentDate = moment().format('YYYY-MM-DD');
    const userLogin = localStorage.getItem('currentUser') ?? '{}';
    this.userLogged = JSON.parse(userLogin);

    this.zff001Form = this.formBuilder.group({
      vendor: [null, [Validators.required]],
      companyCode: [null, [Validators.required]],
      openKeyDate: [currentDate, [Validators.required]],
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
