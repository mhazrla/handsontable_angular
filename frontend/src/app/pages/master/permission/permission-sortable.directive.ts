import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Permission } from 'src/app/core/models/master-admin.model';
export type SortColumn = keyof Permission | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface permissionSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[permissionsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdPermissionSortableHeader {
  @Input() permissionsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() permissionsort = new EventEmitter<permissionSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.permissionsort.emit({
      column: this.permissionsortable,
      direction: this.direction,
    });
  }
}
