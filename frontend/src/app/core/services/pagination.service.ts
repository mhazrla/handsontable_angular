import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor() {}

  calculateTotalPages(totalItems: number) {
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  paginateData(data: any[], currentPage: number, itemsPerPage: number): any[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  setPageSize(size: number) {
    this.itemsPerPage = size;
    this.currentPage = 1;
  }

  setPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
