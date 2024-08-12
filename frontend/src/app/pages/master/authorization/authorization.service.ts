/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

// Date Format
import { DatePipe } from '@angular/common';

import { Authorization } from 'src/app/core/models/master-admin.model';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './authorization-sortable.directive';
import { ApiService } from 'src/app/core/services/api.service';

interface SearchResult {
  countries: Authorization[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  countries: Authorization[],
  column: SortColumn,
  direction: string
): Authorization[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(
  authorization: Authorization,
  term: string,
  pipe: PipeTransform
) {
  if (!authorization) {
    return false;
  }

  const nik = authorization.nik ? authorization.nik.toLowerCase() : '';
  const role_name = authorization.role_name
    ? authorization.role_name.toLowerCase()
    : '';
  const name = authorization.name
    ? authorization.name.toLowerCase()
    : '';
  const user_type = authorization.user_type
    ? authorization.user_type.toLowerCase()
    : '';
  const account_sap = authorization.account_sap
    ? authorization.account_sap.toLowerCase()
    : '';

  return (
    nik.includes(term.toLowerCase()) ||
    name.includes(term.toLowerCase()) ||
    role_name.includes(term.toLowerCase()) ||
    user_type.includes(term.toLowerCase()) ||
    account_sap.includes(term.toLowerCase())
  );
}

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<Authorization[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  content?: any;
  datas?: any;

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    status: '',
    payment: '',
    date: '',
  };

  constructor(
    private pipe: DecimalPipe,
    public apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._countries$.next(result.countries);
        this._total$.next(result.total);
      });

    this._search$.next();

    // Api Data
    this.apiService.getAll('master/authorizations').subscribe((res) => {
      this.datas = res.data;
    });
  }

  get countries$() {
    return this._countries$.asObservable();
  }
  get authorization() {
    return this.datas;
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }
  get startIndex() {
    return this._state.startIndex;
  }
  get endIndex() {
    return this._state.endIndex;
  }
  get totalRecords() {
    return this._state.totalRecords;
  }
  get status() {
    return this._state.status;
  }
  get payment() {
    return this._state.payment;
  }
  get date() {
    return this._state.date;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }
  set startIndex(startIndex: number) {
    this._set({ startIndex });
  }
  set endIndex(endIndex: number) {
    this._set({ endIndex });
  }
  set totalRecords(totalRecords: number) {
    this._set({ totalRecords });
  }
  set status(status: any) {
    this._set({ status });
  }
  set payment(payment: any) {
    this._set({ payment });
  }
  set date(date: any) {
    this._set({ date });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const datas = this.authorization ?? [];
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let countries = sort(datas, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter((authorization) =>
      matches(authorization, searchTerm, this.pipe)
    );

    const total = countries.length;

    // 3. paginate
    this.totalRecords = countries.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    countries = countries.slice(
      this._state.startIndex - 1,
      this._state.endIndex
    );
    return of({ countries, total });
  }
}
