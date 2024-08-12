import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiService } from 'src/app/core/services/api.service';

import { PaginationService } from 'src/app/core/services/pagination.service'; // Sesuaikan dengan path yang benar
import Swal from 'sweetalert2';

declare global {
  interface Window {
    Handsontable: any;
  }
}

@Component({
  selector: 'app-fb60',
  templateUrl: './fb60.component.html',
  styleUrls: ['./fb60.component.scss'],
  providers: [PaginationService],
})
export class Fb60Component implements OnInit, OnDestroy {
  breadCrumbItems!: Array<{}>;

  fb60s: any[] = [];
  fb60sToShow: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  // Form
  reverseForm!: FormGroup;
  submitted: boolean = false;
  selectedRow: number | null = null;

  @ViewChild('content', { static: true }) content!: ElementRef;
  @ViewChild('hotContainer', { static: true }) container!: ElementRef;
  hotInstance: any;

  constructor(
    public paginationService: PaginationService,
    private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.reverseForm = this.formBuilder.group({
      idHeader: [null, [Validators.required]],
      documentNumber: [{ value: '', disabled: true }, Validators.required],
      companyCode: [{ value: '', disabled: true }, Validators.required],
      year: [{ value: '', disabled: true }, Validators.required],
      reversalReason: [null, [Validators.required]],
      postingDate: [null, [Validators.required]],
    });

    this.fetchFb60();
  }

  ngOnDestroy() {
    if (this.hotInstance) {
      this.hotInstance.destroy();
    }
  }

  fetchFb60() {
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then((response) => response.json())
      .then((json) => {
        this.fb60s = json;
        this.paginationService.calculateTotalPages(this.fb60s.length);
        this.paginateData();
        this.initializeHandsontable();
      });
    // this.apiService.getAll('journal/fb60/').subscribe(
    //   (res) => {
    //     this.fb60s = res.data;
    //     this.paginationService.calculateTotalPages(this.fb60s.length);
    //     this.paginateData();
    //     this.initializeHandsontable();
    //   },
    //   (error) => {
    //     console.log('Error on fetchin FB60 Journal', error);
    //   }
    // );
  }

  initializeHandsontable() {
    if (this.hotInstance) {
      this.hotInstance.destroy();
    }
    let data = this.fb60sToShow.map((journal) => [
      journal.document_number,
      journal.company_code,
      journal.year,
      journal.vendor,
      journal.document_date,
      journal.posting_date,
      journal.reference,
      journal.user_create,
      journal.status,
      '',
      journal.id_fb60_header,
    ]);

    let mergeCellsConfig: any[] = [];
    if (data.length === 0) {
      data = [['No Data', '', '', '', '', '', '', '', '', '']];
      mergeCellsConfig = [{ row: 0, col: 0, rowspan: 1, colspan: 10 }];
    }

    this.hotInstance = new window.Handsontable(this.container.nativeElement, {
      data: data,
      width: '100%',
      height: 'auto',
      rowHeaders: true,
      rowHeights: 30,
      manualRowResize: true,
      colHeaders: [
        'Doc Number',
        'Com. Code',
        'Year',
        'Vendor',
        'Doc. date',
        'Posting Date',
        'Reference',
        'User Create',
        'Status',
        '',
        '',
      ],
      manualColumnResize: true,
      stretchH: 'all',
      contextMenu: true,
      autoWrapRow: true,
      mergeCells: mergeCellsConfig,
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
      columns: [
        { readOnly: true },
        { readOnly: true },
        { readOnly: true },
        { readOnly: true },
        { readOnly: true },
        { readOnly: true },
        { readOnly: true },
        { readOnly: true },
        { readOnly: true },
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
            const status = instance.getDataAtRowProp(row, 8);
            const idHeader = instance.getDataAtRowProp(row, 10);

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
              viewBox: string = '0 0 24 24'
            ) => {
              const svg = document.createElementNS(svgNamespace, 'svg');
              svg.setAttribute('width', width);
              svg.setAttribute('height', height);
              svg.setAttribute('viewBox', viewBox);
              svg.setAttribute('fill', 'none');
              svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

              const path = document.createElementNS(svgNamespace, 'path');
              path.setAttribute('d', pathData);
              path.setAttribute('fill', '#000000');

              svg.appendChild(path);
              return svg;
            };

            const handleEditOrShow = (event: MouseEvent) => {
              this.router.navigate(['journal/fb60/edit/', idHeader]);
            };

            const handleReverse = (event: MouseEvent) => {
              this.openModal(this.content, row, idHeader);
            };

            let svgIcon: SVGElement;
            if (status === 'Draft') {
              const editIcon =
                'M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM22.1213 10.7071C20.9497 9.53553 19.0503 9.53553 17.8787 10.7071L16.1989 12.3869L11.2929 17.2929C11.1647 17.4211 11.0738 17.5816 11.0299 17.7575L10.0299 21.7575C9.94466 22.0982 10.0445 22.4587 10.2929 22.7071C10.5413 22.9555 10.9018 23.0553 11.2425 22.9701L15.2425 21.9701C15.4184 21.9262 15.5789 21.8353 15.7071 21.7071L20.5556 16.8586L22.2929 15.1213C23.4645 13.9497 23.4645 12.0503 22.2929 10.8787L22.1213 10.7071ZM18.3068 13.1074L19.2929 12.1213C19.6834 11.7308 20.3166 11.7308 20.7071 12.1213L20.8787 12.2929C21.2692 12.6834 21.2692 13.3166 20.8787 13.7071L19.8622 14.7236L18.3068 13.1074ZM16.8923 14.5219L18.4477 16.1381L14.4888 20.097L12.3744 20.6256L12.903 18.5112L16.8923 14.5219Z';
              svgIcon = createSVG(editIcon);
              svgIcon.addEventListener('click', handleEditOrShow);
              svgIcon.style.cursor = 'pointer';
              svgIcon.style.marginRight = '10px';
            } else if (status === 'Posted') {
              const detailIcon =
                'M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V8C21 8.55228 20.5523 9 20 9C19.4477 9 19 8.55228 19 8V4C19 3.44772 18.5523 3 18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H10C10.5523 21 11 21.4477 11 22C11 22.5523 10.5523 23 10 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM6.41421 7H9V4.41421L6.41421 7ZM20.1716 18.7574C20.6951 17.967 21 17.0191 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C17.0191 21 17.967 20.6951 18.7574 20.1716L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L20.1716 18.7574ZM13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16Z';
              const reverseIcon =
                'M146.681,293.367c80.884,0,146.692-65.807,146.692-146.686S227.565,0.005,146.681,0.005 C65.802,0.005,0,65.807,0,146.686S65.802,293.367,146.681,293.367z M146.681,21.473c65.454,0,119.257,50.502,124.68,114.574 H151.734l7.267-7.267c4.536-4.531,4.536-11.879,0-16.41c-2.263-2.268-5.238-3.399-8.202-3.399c-2.975,0-5.939,1.131-8.208,3.399 l-27.065,27.07c0,0-0.011,0.011-0.022,0.011l-8.191,8.197l8.191,8.197c0.011,0,0.016,0.011,0.022,0.016l28.996,29.001 c4.531,4.531,11.879,4.531,16.41,0c4.536-4.531,4.536-11.879,0-16.41l-9.197-9.197h119.534 c-6.326,63.158-59.775,112.654-124.582,112.654c-69.043,0-125.213-56.18-125.213-125.224S77.637,21.473,146.681,21.473z';
              svgIcon = createSVG(detailIcon, '18px', '18px');
              const reverseSvg = createSVG(
                reverseIcon,
                '18px',
                '18px',
                '0 0 293.367 293.367'
              );
              svgIcon.addEventListener('click', handleEditOrShow);
              reverseSvg.addEventListener('click', handleReverse);
              svgIcon.style.cursor = 'pointer';
              svgIcon.style.marginRight = '10px';
              reverseSvg.style.cursor = 'pointer';
              reverseSvg.style.marginRight = '10px';

              tdIcon.appendChild(svgIcon);
              tdIcon.appendChild(reverseSvg);
            } else {
              const detailIcon =
                'M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V8C21 8.55228 20.5523 9 20 9C19.4477 9 19 8.55228 19 8V4C19 3.44772 18.5523 3 18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H10C10.5523 21 11 21.4477 11 22C11 22.5523 10.5523 23 10 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM6.41421 7H9V4.41421L6.41421 7ZM20.1716 18.7574C20.6951 17.967 21 17.0191 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C17.0191 21 17.967 20.6951 18.7574 20.1716L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L20.1716 18.7574ZM13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16Z';
              svgIcon = createSVG(detailIcon);
              svgIcon.addEventListener('click', handleEditOrShow);
              svgIcon.style.cursor = 'pointer';
              svgIcon.style.marginRight = '10px';
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
  }

  openModal(content: any, row: number, idHeader: string) {
    this.selectedRow = row;

    const rowData = this.hotInstance.getDataAtRow(row);

    this.reverseForm.patchValue({
      documentNumber: rowData[0],
      companyCode: rowData[1],
      year: rowData[2],
      idHeader: idHeader,
    });

    this.modalService.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  get form() {
    return this.reverseForm.controls;
  }

  cancelEdit() {
    this.reverseForm.reset();
    this.submitted = false;
    this.modalService.dismissAll();
  }

  paginateData() {
    this.fb60sToShow = this.paginationService.paginateData(
      this.fb60s,
      this.paginationService.currentPage,
      this.paginationService.itemsPerPage
    );
  }

  setPageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value, 10);
    if (!isNaN(size)) {
      this.paginationService.setPageSize(size);
      this.paginationService.calculateTotalPages(this.fb60s.length);
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

  onSubmitReverseDocument() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to reverse this document?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.reverseForm.valid) {
          const formValues = this.reverseForm.getRawValue();
          this.apiService
            .put('journal/fb60/reverse/', formValues.idHeader, formValues)
            .subscribe((response) => {
              this.modalService.dismissAll();
              Swal.fire(
                `The document has been processed for reversal`,
                `Document No: ${formValues.documentNumber}`,
                'success'
              );
              this.fetchFb60();
            });
        } else {
          Swal.fire({
            title: 'Form Invalid',
            text: 'Please check the form for errors before submitting.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your changes have not been saved', 'error');
      }
    });
  }
}
