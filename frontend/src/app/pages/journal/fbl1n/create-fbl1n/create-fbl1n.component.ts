import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-fbl1n',
  templateUrl: './create-fbl1n.component.html',
  styleUrls: ['./create-fbl1n.component.scss'],
})
export class CreateFbl1nComponent implements OnInit {
  Default = [{ name: 'Choice 1' }, { name: 'Choice 2' }, { name: 'Choice 3' }];
  userLogged: any;

  // Form
  fbl1nForm!: FormGroup;
  profitSegmentForm!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;

  initialDocumentTypeValue = 'KR - Vendor Invoice';
  columns = [
    'GL Account',
    'Short Text',
    'D/C',
    'Amount In Doc .Curr.',
    'Assignment',
    'Text',
    'Cost Center',
    'Order',
    'Profit Center',
    'Profit Segment',
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

    this.fbl1nForm = this.formBuilder.group({
      companyCode: [null, [Validators.required]],
      vendor: [null, [Validators.required]],
      invoiceDate: ['', [Validators.required]],
      postingDate: ['', [Validators.required]],
      period: [{ value: '', disabled: true }, Validators.required],
      year: ['', [Validators.required]],
      currency: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      busPlace: ['', [Validators.required]],
      text: ['', [Validators.required]],
      documentType: [
        { value: this.initialDocumentTypeValue, disabled: true },
        Validators.required,
      ],
      reference: ['', [Validators.required]],
      headerText: ['', [Validators.required]],
      baselineDate: ['', [Validators.required]],
      payterm: [null, [Validators.required]],
      partBank: [null, [Validators.required]],
      taxVATCode: [null, [Validators.required]],
      taxVATAmount: ['', [Validators.required]],
      whtType: [null, [Validators.required]],
      whtBaseAmount: ['', [Validators.required]],
      whtCode: [null, [Validators.required]],
      whtAmount: ['', [Validators.required]],
      userCreate: [this.userLogged.name],
      status: [''],
    });

    this.profitSegmentForm = this.formBuilder.group({
      profitSegment: [null, [Validators.required]],
      companyCode: [{ value: null, disabled: true }],
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
        null, // Amount In Doc .Curr.
        null, // Assignment
        null, // Text
        null, // Cost Center
        null, // Order
        null, // Profit Center
        null, // Profit Segment
      ]);

    const dropdownSourceDc = ['DEBIT', 'CREDIT'];
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
                text: 'The value must be either "DEBIT" or "CREDIT".',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            } else if (
              col === 6 &&
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
          this.checkCell(); // Update button status
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
        {
          type: 'dropdown',
          source: dropdownSourceCostCenter,
          validator: validateDropdown(dropdownSourceCostCenter),
          allowInvalid: false,
        },
        {},
        {},
        {
          readOnly: true,
          renderer: (
            instance: any,
            td: HTMLElement,
            row: number,
            col: number,
            prop: any,
            value: any,
            cellProperties: any
          ) => {
            const profitSegment = instance.getDataAtRowProp(row, 9);
            const svgNamespace = 'http://www.w3.org/2000/svg';

            td.innerHTML = '';

            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';

            const tr = document.createElement('tr');
            const tdIcon = document.createElement('td');
            tdIcon.style.border = 'none';
            tdIcon.style.textAlign = 'center';

            const createSVG = (
              pathData: string,
              width: string = '20px',
              height: string = '20px',
              viewBox: string = '0 0 24 24',
              fill: string = ''
            ) => {
              const svg = document.createElementNS(svgNamespace, 'svg');
              svg.setAttribute('width', width);
              svg.setAttribute('height', height);
              svg.setAttribute('viewBox', viewBox);
              svg.setAttribute('fill', fill);
              svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

              const path = document.createElementNS(svgNamespace, 'path');
              path.setAttribute('d', pathData);

              svg.appendChild(path);
              return svg;
            };

            const handleIconClick = (row: number) => (event: MouseEvent) => {
              this.openModal(this.content, row);
            };

            let svgIcon: SVGElement;
            if (profitSegment !== null) {
              const checkIcon =
                'm 573.78125,71.326172 c -11.14983,0.0041 -21.84136,4.437288 -29.72266,12.324219 L 269.17773,358.69727 201.88007,226.17417 c -16.41326,-16.42281 -43.03211,-16.43069 -59.45508,-0.0176 -16.42281,16.41326 -16.43068,43.03211 -0.0176,59.45508 l 97.034,162.277 c 16.42109,16.42734 43.05156,16.42734 59.47265,0 L 603.53125,143.08789 c 16.41439,-16.4232 16.40651,-43.04355 -0.0176,-59.457031 -7.88689,-7.88216 -18.58202,-12.308309 -29.73242,-12.304687 z M 297.41602,-12.826172 C 216.90703,-11.965911 137.45719,19.625316 77.640625,79.496094 -23.103069,180.33109 -43.683279,336.82447 27.546875,460.31055 98.777031,583.79662 244.53398,644.23617 382.17383,607.32227 519.81368,570.40835 615.82422,445.15088 615.82422,302.57422 c -1.6e-4,-23.21855 -18.82247,-42.04086 -42.04102,-42.04102 -23.21931,-9.2e-4 -42.04281,18.82171 -42.04297,42.04102 0,104.9608 -70.10118,196.38166 -171.34765,223.53515 C 259.14611,553.26287 152.80736,509.18649 100.38086,418.29883 47.954364,327.41117 62.989814,213.1262 137.12305,138.92578 211.25628,64.725365 325.35936,49.693075 416.14258,102.1543 c 20.1039,11.61703 45.81879,4.73687 57.43554,-15.367191 C 485.19415,66.68416 478.31507,40.97088 458.21289,29.353516 408.08311,0.38483622 352.50111,-13.414771 297.41602,-12.826172 Z';
              svgIcon = createSVG(
                checkIcon,
                '20px',
                '20px',
                '0 0 600 600',
                '#00bd1f'
              );
              svgIcon.addEventListener('click', handleIconClick(row));
              svgIcon.style.cursor = 'pointer';
            } else {
              const plusIcon =
                'M13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9V11H9C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H11V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H13V9ZM7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782Z';
              svgIcon = createSVG(
                plusIcon,
                '20px',
                '20px',
                '0 -0.5 21 21',
                '#307fb7'
              );
              svgIcon.addEventListener('click', handleIconClick(row));
              svgIcon.style.cursor = 'pointer';
            }

            tdIcon.appendChild(svgIcon);
            tr.appendChild(tdIcon);
            table.appendChild(tr);
            td.appendChild(table);

            td.style.height = 'auto';

            return td;
          },
        },
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

  openModal(content: any, row: number) {
    this.selectedRow = row;

    const rowData = this.hotInstance.getDataAtRow(row);

    this.profitSegmentForm.patchValue({
      profitSegment: rowData[9],
      companyCode: this.fbl1nForm.value.companyCode,
    });

    this.modalService.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  get form() {
    return this.profitSegmentForm.controls;
  }

  cancelEdit() {
    this.profitSegmentForm.reset();
    this.submitted = false;
    this.modalService.dismissAll();
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

    this.fbl1nForm.patchValue({
      period,
      year,
    });
  }

  onSubmitProfitSegment() {
    const profitSegmentValue =
      this.profitSegmentForm.get('profitSegment')?.value;

    if (profitSegmentValue) {
      this.hotInstance.setDataAtCell(this.selectedRow, 9, profitSegmentValue);

      this.cancelEdit();
    } else {
      Swal.fire({
        title: 'No Product Selected',
        text: 'Please select a product before saving.',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
    }
  }

  submitHeader(status: string): Observable<number> {
    this.fbl1nForm.get('documentType')?.enable();
    this.fbl1nForm.get('period')?.enable();

    this.fbl1nForm.patchValue({
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
          if (this.fbl1nForm.valid) {
            this.apiService
              .post('journal/fbl1n/', this.fbl1nForm.value)
              .subscribe((res: any) => {
                const idHeader = res.data[0].id;
                this.fbl1nForm.reset({
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
      .post('journal/fbl1n/detail', journalDetail)
      .subscribe((response) => {
        this.modalService.dismissAll();
        this.alertService.success('User has been added');

        Swal.fire(
          `The document has been ${documentStatus}`,
          `Document No: ${idHeader}`,
          'success'
        );
        this.router.navigate(['/journal/fbl1n']);
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
