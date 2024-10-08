/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

// Date Format
import { Permission } from 'src/app/core/models/master-admin.model';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './permission-sortable.directive';
import { ApiService } from 'src/app/core/services/api.service';

interface SearchResult {
  countries: Permission[];
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
  countries: Permission[],
  column: SortColumn,
  direction: string
): Permission[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(permission: Permission, term: string, pipe: PipeTransform) {
  if (!permission) {
    return false;
  }

  const code = permission.code ? permission.code.toLowerCase() : '';
  const detail = permission.detail
    ? permission.detail.toLowerCase()
    : '';

  return (
    code.includes(term.toLowerCase()) ||
    detail.includes(term.toLowerCase())
  );
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<Permission[]>([]);
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

  constructor(private pipe: DecimalPipe, public apiService: ApiService) {
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
    this.apiService.getAll('master/permissions/').subscribe((permission) => {
      this.datas = permission.data;
    });
  }

  get countries$() {
    return this._countries$.asObservable();
  }
  get permission() {
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
    const datas = this.permission ?? [];
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let countries = sort(datas, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter((permission) =>
      matches(permission, searchTerm, this.pipe)
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
