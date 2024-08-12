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
  selector: 'app-as03',
  templateUrl: './as03.component.html',
  styleUrls: ['./as03.component.scss'],
  providers: [PaginationService],
})
export class As03Component implements OnInit {
  userLogged: any;

  // Data
  as03s: any[] = [];
  as03sToShow: any[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  // Form
  as03Form!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;
  isProcessed: boolean = false;

  // Filter
  public displayedData: any = {
    documentNumber: null,
    documentDate: null,
    reference: null,
    currency: null,
    companyCode: null,
    postingDate: null,
    year: null,
    period: null,
  };

  initialDocumentTypeValue = 'SA - G/L Account Document';
  columns = [
    'Assignment',
    'Document No',
    'Reference Key 3',
    'Document Type',
    'Document Date',
    'Posting Date',
    'Clearing Date',
    'Special G/L Indicator',
    'Net Due Date Symbol',
    'Amount In Loc. Curr.',
    'Local Currency',
    'Clearing Document',
    'Text',
    'Amount In Document Currency',
    'Document Currency',
  ];

  // Table
  @ViewChild('content', { static: true }) content!: ElementRef;
  @ViewChild('hotContainer', { static: false }) container!: ElementRef;
  hotInstance: any;
  hiddenColumns: number[] = [];
  isDropdownOpen = false;

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

    this.as03Form = this.formBuilder.group({
      companyCode: [null, [Validators.required]],
      asset: [null, [Validators.required]],
      subnumber: [null, [Validators.required]],
    });
  }

  ngOnDestroy() {
    if (this.hotInstance) {
      this.hotInstance.destroy();
    }
  }

  fetchFb30() {
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then((response) => response.json())
      .then((json) => {
        this.as03s = json;
        this.cdr.detectChanges();
      });
    // this.apiService.getAll('journal/as03/').subscribe(
    //   (res) => {
    //     this.as03s = res.data;
    //     this.paginationService.calculateTotalPages(this.as03s.length);
    //     this.paginateData();
    //     this.initializeHandsontable();
    //   },
    //   (error) => {
    //     console.log('Error on fetchin FB60 Journal', error);
    //   }
    // );
  }

  onProcessing() {
    this.isProcessed = true;
    this.cdr.detectChanges();
    this.fetchFb30();
  }

  onBackProcessing() {
    this.isProcessed = false;
    this.cdr.detectChanges();
  }
}
