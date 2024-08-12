import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { RolePermission } from 'src/app/core/models/master-admin.model';
export type SortColumn = keyof RolePermission | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface rolepermissionSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[rolepermissionsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdRolePermissionsSortableHeader {
  @Input() rolepermissionsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() rolepermissionssort = new EventEmitter<rolepermissionSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.rolepermissionssort.emit({
      column: this.rolepermissionsortable,
      direction: this.direction,
    });
  }
}
