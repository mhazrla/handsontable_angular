import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-fb60',
  templateUrl: './edit-fb60.component.html',
  styleUrls: ['./edit-fb60.component.scss'],
})
export class EditFb60Component implements OnInit {
  Companies = [{ code: 1000 }, { code: 2000 }, { code: 9999 }];
  Default = [{ name: 'Choice 1' }, { name: 'Choice 2' }, { name: 'Choice 3' }];
  userLogged: any;

  // Form
  fb60Form!: FormGroup;
  profitSegmentForm!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;
  idHeader: any;
  fb60Details: any[] = [];
  fb60Status: string = '';

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
  dataLoaded = false;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const userLogin = localStorage.getItem('currentUser') ?? '{}';
    this.userLogged = JSON.parse(userLogin);
    const isReadOnly = !this.hasPermission('MSTR-CRUD');

    this.fb60Form = this.formBuilder.group({
      companyCode: [
        { value: null, disabled: isReadOnly },
        [Validators.required],
      ],
      vendor: [{ value: null, disabled: isReadOnly }, [Validators.required]],
      documentDate: [
        { value: '', disabled: isReadOnly },
        [Validators.required],
      ],
      postingDate: [{ value: '', disabled: isReadOnly }, [Validators.required]],
      period: [{ value: '', disabled: true }, Validators.required],
      currency: [{ value: null, disabled: isReadOnly }, [Validators.required]],
      amount: [{ value: '', disabled: isReadOnly }, [Validators.required]],
      busPlace: [{ value: '', disabled: isReadOnly }, [Validators.required]],
      text: [{ value: '', disabled: isReadOnly }, [Validators.required]],
      documentType: [
        { value: this.initialDocumentTypeValue, disabled: true },
        Validators.required,
      ],
      reference: [{ value: '', disabled: isReadOnly }, [Validators.required]],
      headerText: [{ value: '', disabled: isReadOnly }, [Validators.required]],
      baselineDate: [{ value: '', disabled: isReadOnly }],
      payterm: [{ value: null, disabled: isReadOnly }],
      partBank: [{ value: null, disabled: isReadOnly }, [Validators.required]],
      taxVATCode: [{ value: null, disabled: isReadOnly }, ,],
      taxVATAmount: [{ value: '', disabled: isReadOnly }, ,],
      whtType: [{ value: null, disabled: isReadOnly }],
      whtBaseAmount: [{ value: '', disabled: isReadOnly }, ,],
      whtCode: [{ value: null, disabled: isReadOnly }],
      whtAmount: [{ value: '', disabled: isReadOnly }],
      userCreate: [{ value: this.userLogged.name }],
      status: [{ value: '' }],
    });

    this.profitSegmentForm = this.formBuilder.group({
      profitSegment: [null, [Validators.required]],
      companyCode: [{ value: null, disabled: true }],
    });

    this.route.paramMap.subscribe((params) => {
      this.idHeader = params.get('id');

      if (!this.idHeader) {
        this.router.navigate(['/journal/fb60']);
      } else {
        this.loadData();
      }
    });
  }

  loadData() {
    if (this.idHeader) {
      this.apiService.getSingle(`journal/fb60/`, this.idHeader).subscribe(
        (res: any) => {
          this.fb60Details = res.data.details;
          this.fb60Status = res.data.fb60.status;
          const documentDate = moment(res.data.fb60.invoice_date, 'DD.MM.YYYY');
          const formattedInvoiceDate = documentDate.format('YYYY-MM-DD');
          const postingDate = moment(res.data.fb60.posting_date, 'DD.MM.YYYY');
          const formattedPostingDate = postingDate.format('YYYY-MM-DD');
          const baselineDate = moment(
            res.data.fb60.baseline_date,
            'DD.MM.YYYY'
          );
          const formattedBaselineDate = baselineDate.format('YYYY-MM-DD');

          this.fb60Form.patchValue({
            companyCode: res.data.fb60.company_code,
            vendor: res.data.fb60.vendor,
            documentDate: formattedInvoiceDate,
            postingDate: formattedPostingDate,
            period: res.data.fb60.period,
            currency: res.data.fb60.currency,
            amount: res.data.fb60.amount,
            busPlace: res.data.fb60.bus_place,
            text: res.data.fb60.text,
            documentType: res.data.fb60.document_type,
            reference: res.data.fb60.reference,
            headerText: res.data.fb60.header_text,
            baselineDate: formattedBaselineDate,
            payterm: res.data.fb60.payterm,
            partBank: res.data.fb60.part_bank,
            taxVATCode: res.data.fb60.tax_vat_code,
            taxVATAmount: res.data.fb60.tax_vat_amount,
            whtType: res.data.fb60.wht_type,
            whtBaseAmount: res.data.fb60.wht_base_amount,
            whtCode: res.data.fb60.wht_code,
            whtAmount: res.data.fb60.wht_amount,
            status: res.data.fb60.status,
          });

          this.initializeHandsontable();
        },
        (error) => {
          Swal.fire({
            text: error,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
          this.router.navigate(['/journal/fb60']);
        }
      );
    } else {
      this.router.navigate(['journal/fb60/']);
    }
  }

  initializeHandsontable() {
    if (this.hotInstance) {
      this.hotInstance.destroy();
    }

    const createEmptyRow = () => [
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
    ];

    const data =
      this.fb60Details.length > 0
        ? [
            ...this.fb60Details.map((detail) => [
              detail.gl_account,
              detail.short_text,
              detail.d_c,
              detail.amount_in_document_currency,
              detail.assignment,
              detail.text,
              detail.cost_center,
              detail.order,
              detail.profit_center,
              detail.profit_segment,
            ]),
            ...Array(4).fill(null).map(createEmptyRow),
          ]
        : Array(6).fill(null).map(createEmptyRow);

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

    const isReadOnly = !this.hasPermission('MSTR-CRUD');

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
      readOnly: isReadOnly,
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
            } else if (
              col === 0 &&
              newValue.length > 10 // GL Account max length
            ) {
              Swal.fire({
                title: 'Invalid input',
                text: `Maximum length is 10 characters`,
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            } else if (
              col === 1 &&
              newValue.length > 20 // Short Text max length
            ) {
              Swal.fire({
                title: 'Invalid input',
                text: `Maximum length is 20 characters`,
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            } else if (
              col === 3 &&
              newValue.length > 15 // Amount
            ) {
              Swal.fire({
                title: 'Invalid input',
                text: `Maximum length is 15 characters`,
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            } else if (
              col === 4 &&
              newValue.length > 18 // Assignment max length
            ) {
              Swal.fire({
                title: 'Invalid input',
                text: `Maximum length is 18 characters`,
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              change[3] = oldValue;
            } else if (
              col === 5 &&
              newValue.length > 50 // Text max length
            ) {
              Swal.fire({
                title: 'Invalid input',
                text: `Maximum length is 50 characters`,
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
        if (this.dataLoaded && source === 'edit') {
          this.checkCell();
        }
      },
      columns: [
        { readOnly: isReadOnly },
        { readOnly: isReadOnly },
        {
          type: 'dropdown',
          source: dropdownSourceDc,
          validator: validateDropdown(dropdownSourceDc),
          allowInvalid: false,
          readOnly: isReadOnly,
        },
        { readOnly: isReadOnly },
        { readOnly: isReadOnly },
        { readOnly: isReadOnly },
        {
          type: 'dropdown',
          source: dropdownSourceCostCenter,
          validator: validateDropdown(dropdownSourceCostCenter),
          allowInvalid: false,
          readOnly: isReadOnly,
        },
        { readOnly: isReadOnly },
        { readOnly: isReadOnly },
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
              if (!isReadOnly) {
                this.openModal(this.content, row);
              }
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

  hasPermission(permission: string): boolean {
    return (
      this.userLogged.permissions &&
      this.userLogged.permissions.includes(permission)
    );
  }

  openModal(content: any, row: number) {
    this.selectedRow = row;
    const formValues = this.fb60Form.getRawValue();

    const rowData = this.hotInstance.getDataAtRow(row);

    this.profitSegmentForm.patchValue({
      profitSegment: rowData[9],
      companyCode: formValues.companyCode,
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
    if (this.hotInstance) {
      const data = this.hotInstance.getData();
      for (const row of data) {
        if (row.some((cell: any) => cell !== null && cell !== '')) {
          return true;
        }
      }
    }
    return false;
  }

  onPostingDateSelected(date: string) {
    let dateToString = moment(date);
    const period = dateToString.month() + 1;

    this.fb60Form.patchValue({
      period,
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
    const formValues = this.fb60Form.getRawValue();

    this.fb60Form.patchValue({
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
          if (this.fb60Form.valid) {
            this.apiService
              .put('journal/fb60/', this.idHeader, formValues)
              .subscribe((res: any) => {
                this.fb60Form.reset({
                  documentType: {
                    value: this.initialDocumentTypeValue,
                    disabled: true,
                  },
                  period: { value: '', disabled: true },
                });

                observer.next(this.idHeader);
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
      case 'Posted':
        documentStatus = 'posted';
        break;
      default:
        documentStatus = 'submitted';
        break;
    }

    this.apiService
      .post('journal/fb60/detail', journalDetail)
      .subscribe((response) => {
        this.modalService.dismissAll();
        this.alertService.success('User has been added');

        Swal.fire(
          `The document has been ${documentStatus}`,
          `Document No: ${idHeader}`,
          'success'
        );
        this.router.navigate(['/journal/fb60']);
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
