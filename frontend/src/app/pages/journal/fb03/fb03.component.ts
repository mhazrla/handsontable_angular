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
  selector: 'app-fb03',
  templateUrl: './fb03.component.html',
  styleUrls: ['./fb03.component.scss'],
  providers: [PaginationService],
})
export class Fb03Component implements OnInit, AfterViewInit {
  Default = [{ name: 'Choice 1' }, { name: 'Choice 2' }, { name: 'Choice 3' }];
  userLogged: any;

  // Data
  fb03s: any[] = [];
  fb03sToShow: any[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  // Form
  fb03Form!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;
  isProcessed: boolean = false;

  // Filter
  public filterObj: any = {
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
    'Company Code',
    'Item',
    'Posting Key',
    'Special G/L Account',
    'Account',
    'Description',
    'Amount',
    'Currency',
    'Amount In Loc. Curr.',
    'Tax Code',
    'Text',
    'Profit Center',
    'Clearing Doc.',
    'Cost Center',
    'Order',
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
    const userLogin = localStorage.getItem('currentUser') ?? '{}';
    this.userLogged = JSON.parse(userLogin);

    this.fb03Form = this.formBuilder.group({
      documentNumber: [null, [Validators.required]],
      companyCode: [null, [Validators.required]],
      year: [null, [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    if (this.isProcessed) {
      this.initializeHandsontable();
    }
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
        this.fb03s = json;
        this.paginationService.calculateTotalPages(this.fb03s.length);
        this.paginateData();
        this.cdr.detectChanges();
        if (this.isProcessed) {
          this.initializeHandsontable();
        }
      });
    // this.apiService.getAll('journal/fb03/').subscribe(
    //   (res) => {
    //     this.fb03s = res.data;
    //     this.paginationService.calculateTotalPages(this.fb03s.length);
    //     this.paginateData();
    //     this.initializeHandsontable();
    //   },
    //   (error) => {
    //     console.log('Error on fetchin FB60 Journal', error);
    //   }
    // );
  }

  initializeHandsontable() {
    if (!this.isProcessed) return;

    if (!this.container) {
      console.error('Container element is not initialized.');
      return;
    }

    if (this.hotInstance) {
      this.hotInstance.destroy();
    }
    let data = this.fb03sToShow.map((journal) => [
      journal.userId,
      journal.id,
      journal.title,
      journal.completed,
      journal.document_date,
      journal.posting_date,
      journal.reference,
      journal.user_create,
      journal.status,
      '',
      journal.id_fb60_header,
      journal.id_fb60_header,
      journal.id_fb60_header,
      journal.id_fb60_header,
      journal.id_fb60_header,
      journal.id_fb60_header,
    ]);

    let mergeCellsConfig: any[] = [];
    if (data.length === 0) {
      data = [
        ['No Data', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ];
      mergeCellsConfig = [{ row: 0, col: 0, rowspan: 1, colspan: 10 }];
    }

    this.hotInstance = new window.Handsontable(this.container.nativeElement, {
      data: data,
      width: '100%',
      height: 'auto',
      rowHeaders: true,
      rowHeights: 30,
      manualRowResize: true,
      colHeaders: this.columns,
      manualColumnResize: true,
      stretchH: 'all',
      contextMenu: true,
      autoWrapRow: true,
      mergeCells: mergeCellsConfig,
      hiddenColumns: {
        columns: this.hiddenColumns,
        indicators: true,
      },
      cells: (row: any, col: any) => {
        const cellProperties: any = {};
        if (data.length === 1 && data[0][0] === 'No Data') {
          cellProperties.className = 'htCenter htMiddle';
        }
        if (col === 10) {
          cellProperties.renderer = () => {};
        }
        return cellProperties;
      },
      autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation',
      columns: this.columns.map((_, index) => ({ readOnly: true })),
    });
  }

  toggleColumnVisibility(colIndex: number) {
    const colPos = this.hiddenColumns.indexOf(colIndex);
    if (colPos > -1) {
      this.hiddenColumns.splice(colPos, 1);
    } else {
      this.hiddenColumns.push(colIndex);
    }

    this.hotInstance.updateSettings({
      hiddenColumns: {
        columns: this.hiddenColumns,
        indicators: true,
      },
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  paginateData() {
    this.fb03sToShow = this.paginationService.paginateData(
      this.fb03s,
      this.paginationService.currentPage,
      this.paginationService.itemsPerPage
    );
  }

  setPageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value, 10);
    if (!isNaN(size)) {
      this.paginationService.setPageSize(size);
      this.paginationService.calculateTotalPages(this.fb03s.length);
      this.paginateData();
      this.initializeHandsontable();
    }
  }

  onNextPage() {
    this.paginationService.nextPage();
    this.paginateData();
    this.initializeHandsontable();
  }

  onPreviousPage() {
    this.paginationService.previousPage();
    this.paginateData();
    this.initializeHandsontable();
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
