import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Authorization } from 'src/app/core/models/master-admin.model';
export type SortColumn = keyof Authorization | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface authorizationSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[authorizationsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdAuthorizationsSortableHeader {
  @Input() authorizationsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() authorizationssort = new EventEmitter<authorizationSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.authorizationssort.emit({
      column: this.authorizationsortable,
      direction: this.direction,
    });
  }
}
