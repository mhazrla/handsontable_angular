import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-f02',
  templateUrl: './create-f02.component.html',
  styleUrls: ['./create-f02.component.scss'],
})
export class CreateF02Component implements OnInit {
  Companies = [{ code: 1000 }, { code: 2000 }, { code: 9999 }];
  Default = [{ name: 'Choice 1' }, { name: 'Choice 2' }, { name: 'Choice 3' }];
  userLogged: any;

  // Data
  f02s: any[] = [];
  f02sToShow: any[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  // Form
  f02Form!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;

  initialDocumentTypeValue = 'SA';
  columns = [
    'GL Account',
    'Short Text',
    'D/C',
    'Pkey',
    'Special G/L',
    'Vendor',
    'Assets',
    'Sub. Asset',
    'ATT',
    'Amount In Doc. Curr.',
    'Amount In Loc. Curr.',
    'Tax Code',
    'Assignment',
    'Text',
    'Cost Center',
    'Order',
    'Profit Center',
    'Product',
    'Bline date',
    'Payt Terms',
    'WHT Type',
    'WHT Code',
    'WHT Base Amount',
    'WHT Tax Amount',
    'Part. Bank',
  ];

  // Table
  @ViewChild('content', { static: true }) content!: ElementRef;
  @ViewChild('hotContainer', { static: true }) container!: ElementRef;
  hotInstance: any;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    const userLogin = localStorage.getItem('currentUser') ?? '{}';
    this.userLogged = JSON.parse(userLogin);

    this.f02Form = this.formBuilder.group({
      companyCode: [null, [Validators.required]],
      documentDate: ['', [Validators.required]],
      postingDate: ['', [Validators.required]],
      headerText: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      documentType: [{ value: this.initialDocumentTypeValue, disabled: true }],
      period: [{ value: '', disabled: true }],
      year: ['', [Validators.required]],
      currency: [null, [Validators.required]],
      busPlace: ['', [Validators.required]],
      userCreate: [this.userLogged.name],
      status: [''],
    });

    this.initializeHandsontable();
  }

  ngOnDestroy() {
    if (this.hotInstance) {
      this.hotInstance.destroy();
    }
  }

  initializeHandsontable() {
    if (this.hotInstance) {
      this.hotInstance.destroy();
    }

    const data = Array(6)
      .fill(null)
      .map(() => [
        null, // GL Account
        null, // Short Text
        null, // D/C
        null, // PKey
        null, // Special G/L
        null, // Vendor
        null, // Assets
        null, // Sub. Asset
        null, // ATT
        null, // Amount In Doc .Curr.
        null, // Amount In Loc .Curr.
        null, // Tax Code
        null, // Assignment
        null, // Text
        null, // Cost Center
        null, // Order
        null, // Profit Center
        null, // Product
        null, // Bline date
        null, // Payt Terms
        null, // WHT Type
        null, // WHT Code
        null, // WHT Base Amount
        null, // WHT Tax Amount
        null, // Part Bank
      ]);

    const dropdownSourceDc = ['DEBIT', 'CREDIT'];
    const dropdownSourceTaxCode = ['V0', 'V1'];
    const dropdownSourceCostCenter = ['12022170', '12022171'];

    const validateDropdown =
      (sourceArray: any[]) => (value: any, callback: any) => {
        if (sourceArray.includes(value) || value === null) {
          callback(true);
        } else {
          callback(false);
        }
      };

    this.hotInstance = new window.Handsontable(this.container.nativeElement, {
      data: data,
      rowHeaders: true,
      colHeaders: this.columns,
      manualColumnResize: true,
      stretchH: 'all',
      contextMenu: true,
      autoWrapRow: true,
      autoWrapCol: true,
      height: 'auto',
      licenseKey: 'non-commercial-and-evaluation',
      beforeChange: (changes: any[], source: string) => {
        if (source === 'edit') {
          for (const change of changes) {
            const [row, col, oldValue, newValue] = change;
            if (col === 2 && !dropdownSourceDc.includes(newValue)) {
              Swal.fire({
                title: 'Invalid input',
                text: 'The value must be either "DEBIT" or "CREDIT"',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            } else if (
              col === 11 &&
              !dropdownSourceTaxCode.includes(newValue)
            ) {
              Swal.fire({
                title: 'Invalid input',
                text: 'Tax Code not valid',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            } else if (
              col === 14 &&
              !dropdownSourceCostCenter.includes(newValue)
            ) {
              Swal.fire({
                title: 'Invalid input',
                text: 'Cost Center not valid',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            }
          }
        }
        return true;
      },
      afterChange: (changes: any, source: any) => {
        if (source === 'edit') {
          this.checkCell();
        }
      },
      columns: [
        {},
        {},
        {
          type: 'dropdown',
          source: dropdownSourceDc,
          validator: validateDropdown(dropdownSourceDc),
          allowInvalid: false,
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          type: 'dropdown',
          source: dropdownSourceTaxCode,
          validator: validateDropdown(dropdownSourceTaxCode),
          allowInvalid: false,
        },
        {},
        {},
        {
          type: 'dropdown',
          source: dropdownSourceCostCenter,
          validator: validateDropdown(dropdownSourceCostCenter),
          allowInvalid: false,
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
      ],
    });

    this.container.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          if (this.hotInstance) {
            const selected = this.hotInstance.getSelected();
            if (selected && selected.length > 0) {
              const [row] = selected[0];
              const totalRows = this.hotInstance.countRows();

              if (row === totalRows - 1) {
                this.hotInstance.alter('insert_row_below', row + 1);
                event.preventDefault();
              }
            }
          }
        }
      }
    );
  }

  checkCell(): boolean {
    const data = this.hotInstance.getData();
    for (const row of data) {
      if (row.some((cell: any) => cell !== null && cell !== '')) {
        return true;
      }
    }
    return false;
  }

  onPostingDateSelected(date: string) {
    let dateToString = moment(date);
    const period = dateToString.month() + 1;
    const year = dateToString.year();

    this.f02Form.patchValue({
      period,
      year,
    });
  }

  submitHeader(status: string): Observable<number> {
    this.f02Form.get('documentType')?.enable();
    this.f02Form.get('period')?.enable();

    this.f02Form.patchValue({
      status,
    });

    this.submitted = true;

    if (!this.checkCell()) {
      Swal.fire({
        title: 'Incomplete Data',
        text: 'Please fill all cells in the table before submitting.',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return new Observable((observer) => {
        observer.error('Not all cells are filled');
      });
    }

    return new Observable((observer) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to post this document?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.f02Form.valid) {
            this.apiService
              .post('journal/f02/', this.f02Form.value)
              .subscribe((res: any) => {
                const idHeader = res.data[0].id;
                this.f02Form.reset({
                  documentType: {
                    value: this.initialDocumentTypeValue,
                    disabled: true,
                  },
                  period: { value: '', disabled: true },
                });

                observer.next(idHeader);
                observer.complete();
              });
          } else {
            Swal.fire({
              title: 'Form Invalid',
              text: 'Please check the form for errors before submitting.',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
            observer.error('Form not valid');
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your changes have not been saved', 'error');
          observer.error('Cancelled');
        }
      });
    });
  }

  submitDetail(idHeader: number, status: string) {
    const data = this.hotInstance.getData();

    const filteredData = data.filter((row: any) => {
      return row.some((cell: any) => cell !== null && cell !== '');
    });

    const journalDetail = filteredData
      .filter((row: any) =>
        row.some((cell: any) => cell !== null && cell !== '')
      )
      .map((row: any) => {
        const rowObject: any = {};
        this.columns.forEach((colName, index) => {
          rowObject[colName] = row[index];
        });
        return { ...rowObject, idHeader };
      });

    let documentStatus = '';
    switch (status) {
      case 'Draft':
        documentStatus = 'drafted';
        break;
      default:
        documentStatus = 'submitted';
        break;
    }

    this.apiService
      .post('journal/f02/detail', journalDetail)
      .subscribe((response) => {
        this.modalService.dismissAll();
        this.alertService.success('User has been added');

        Swal.fire(
          `The document has been ${documentStatus}`,
          `Document No: ${idHeader}`,
          'success'
        );
        this.router.navigate(['/journal/f02']);
      });
  }

  postJournal(status: string) {
    this.submitHeader(status).subscribe({
      next: (idHeader) => {
        this.submitDetail(idHeader, status);
      },
      error: (err) => {
        console.error('Error occurred:', err);
      },
    });
  }
}
