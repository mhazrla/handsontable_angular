import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-xk03',
  templateUrl: './detail-xk03.component.html',
  styleUrls: ['./detail-xk03.component.scss'],
})
export class DetailXk03Component implements OnInit {
  userLogged: any;

  // Form
  xk03Form!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;
  isProcessed: boolean = false;

  // Data
  xk03s: any[] = [];
  tablesConfig: { [key: string]: any } = {
    table1: {
      container: null,
      dataToShow: [],
      currentPage: 1,
      itemsPerPage: 5,
      totalPages: 0,
      columns: [
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
      ],
      hiddenColumns: [] as number[],
      isDropdownOpen: false,
    },
    table2: {
      container: null,
      dataToShow: [],
      currentPage: 1,
      itemsPerPage: 5,
      totalPages: 0,
      columns: [
        'Bank Country',
        'Bank Key',
        'Bank Account',
        'Bank Control Key',
        'Partner Bank Type',
        'Reference Details',
        'Account Holder',
        'Bank Name',
      ],
      hiddenColumns: [] as number[],
      isDropdownOpen: false,
    },
  };

  // Table Instances
  @ViewChild('hotContainer1', { static: true }) set hotContainer1(
    element: ElementRef
  ) {
    this.tablesConfig['table1'].container = element.nativeElement;
  }
  @ViewChild('hotContainer2', { static: true }) set hotContainer2(
    element: ElementRef
  ) {
    this.tablesConfig['table2'].container = element.nativeElement;
  }
  hotInstances: { [key: string]: any } = {};

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
    this.xk03Form = this.formBuilder.group({
      vendor: [null, [Validators.required]],
      name: [null, [Validators.required]],
      createdOn: [null, [Validators.required]],
      createdBy: [null, [Validators.required]],
      street: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
      region: [null, [Validators.required]],
      city: [null, [Validators.required]],
      accountGroup: [null, [Validators.required]],
      reconAccount: [null, [Validators.required]],
      taxNumber1: [null, [Validators.required]],
      taxNumber2: [null, [Validators.required]],
      telephone1: [null, [Validators.required]],
      telephone2: [null, [Validators.required]],
      vatRegistrationNo: [null, [Validators.required]],
      sortKey: [null, [Validators.required]],
      url: [null, [Validators.required]],
      typeOfBusiness: [null, [Validators.required]],
      paymentTerm: [null, [Validators.required]],
    });

    this.fetchXk03();
  }

  ngOnDestroy() {
    for (let tableKey in this.hotInstances) {
      if (this.hotInstances[tableKey]) {
        this.hotInstances[tableKey].destroy();
      }
    }
  }

  fetchXk03() {
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then((response) => response.json())
      .then((json) => {
        this.xk03s = json;
        this.cdr.detectChanges();
        if (this.isProcessed) {
        }
        this.setupTable('table1');
        this.setupTable('table2');
      });
  }

  setupTable(tableKey: string) {
    const tableConfig = this.tablesConfig[tableKey];

    tableConfig.totalPages = Math.ceil(
      this.xk03s.length / tableConfig.itemsPerPage
    );
    tableConfig.dataToShow = this.paginateData(tableConfig);

    this.initializeHandsontable(tableKey);
  }

  paginateData(tableConfig: any) {
    const startIndex = (tableConfig.currentPage - 1) * tableConfig.itemsPerPage;
    return this.xk03s.slice(startIndex, startIndex + tableConfig.itemsPerPage);
  }

  initializeHandsontable(tableKey: string) {
    const tableConfig = this.tablesConfig[tableKey];
    const container = tableConfig.container;

    if (this.hotInstances[tableKey]) {
      this.hotInstances[tableKey].destroy();
    }

    const data = tableConfig.dataToShow.map((journal: any) =>
      tableConfig.columns.map(
        (col: any) => journal[col.toLowerCase().replace(/ /g, '_')]
      )
    );

    const mergeCellsConfig: any[] =
      data.length === 0
        ? [{ row: 0, col: 0, rowspan: 1, colspan: tableConfig.columns.length }]
        : [];

    this.hotInstances[tableKey] = new window.Handsontable(container, {
      data:
        data.length > 0
          ? data
          : [
              [
                'No Data',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
              ],
            ],
      width: '100%',
      height: 'auto',
      rowHeaders: true,
      rowHeights: 30,
      manualRowResize: true,
      colHeaders: tableConfig.columns,
      manualColumnResize: true,
      stretchH: 'all',
      contextMenu: true,
      autoWrapRow: true,
      mergeCells: mergeCellsConfig,
      hiddenColumns: {
        columns: tableConfig.hiddenColumns,
        indicators: true,
      },
      cells: (row: any, col: any) => {
        const cellProperties: any = {};
        if (data.length === 1 && data[0][0] === 'No Data') {
          cellProperties.className = 'htCenter htMiddle';
        }
        return cellProperties;
      },
      autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation',
      columns: tableConfig.columns.map(() => ({ readOnly: true })),
    });
  }

  toggleColumnVisibility(tableKey: string, colIndex: number) {
    const tableConfig = this.tablesConfig[tableKey];
    const colPos = tableConfig.hiddenColumns.indexOf(colIndex);
    if (colPos > -1) {
      tableConfig.hiddenColumns.splice(colPos, 1);
    } else {
      tableConfig.hiddenColumns.push(colIndex);
    }

    this.hotInstances[tableKey].updateSettings({
      hiddenColumns: {
        columns: tableConfig.hiddenColumns,
        indicators: true,
      },
    });
  }

  toggleDropdown(tableKey: string) {
    this.tablesConfig[tableKey].isDropdownOpen =
      !this.tablesConfig[tableKey].isDropdownOpen;
  }

  onNextPage(tableKey: string) {
    const tableConfig = this.tablesConfig[tableKey];
    if (tableConfig.currentPage < tableConfig.totalPages) {
      tableConfig.currentPage++;
      tableConfig.dataToShow = this.paginateData(tableConfig);
      this.initializeHandsontable(tableKey);
    }
  }

  onPreviousPage(tableKey: string) {
    const tableConfig = this.tablesConfig[tableKey];
    if (tableConfig.currentPage > 1) {
      tableConfig.currentPage--;
      tableConfig.dataToShow = this.paginateData(tableConfig);
      this.initializeHandsontable(tableKey);
    }
  }

  setPageSize(tableKey: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value, 10);
    if (!isNaN(size)) {
      const tableConfig = this.tablesConfig[tableKey];
      tableConfig.itemsPerPage = size;
      tableConfig.totalPages = Math.ceil(this.xk03s.length / size);
      tableConfig.dataToShow = this.paginateData(tableConfig);
      this.initializeHandsontable(tableKey);
    }
  }

  onBackProcessing() {
    this.isProcessed = false;
    this.cdr.detectChanges();
  }
}
