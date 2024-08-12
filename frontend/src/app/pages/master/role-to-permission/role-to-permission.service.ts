/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

// Date Format
import { DatePipe } from '@angular/common';

import { RolePermission } from 'src/app/core/models/master-admin.model';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import {
  SortColumn,
  SortDirection,
} from './role-to-permission-sortable.directive';
import { ApiService } from 'src/app/core/services/api.service';

interface SearchResult {
  countries: RolePermission[];
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
  countries: RolePermission[],
  column: SortColumn,
  direction: string
): RolePermission[] {
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
  rolePermission: RolePermission,
  term: string,
  pipe: PipeTransform
) {
  if (!rolePermission) {
    return false;
  }

  const role_name = rolePermission.role_name
    ? rolePermission.role_name.toLowerCase()
    : '';
  const permission_code = rolePermission.permission_code
    ? rolePermission.permission_code.toLowerCase()
    : '';
  const role_detail = rolePermission.role_detail
    ? rolePermission.role_detail.toLowerCase()
    : '';

  return (
    role_name.includes(term.toLowerCase()) ||
    permission_code.includes(term.toLowerCase()) ||
    role_detail.includes(term.toLowerCase())
  );
}

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<RolePermission[]>([]);
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
    this.apiService.getAll('master/role-permissions').subscribe((res) => {
      this.datas = res.data;
    });
  }

  get countries$() {
    return this._countries$.asObservable();
  }
  get rolePermission() {
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
    const datas = this.rolePermission ?? [];
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let countries = sort(datas, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter((rolePermission) =>
      matches(rolePermission, searchTerm, this.pipe)
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
