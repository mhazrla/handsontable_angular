import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { RolePermission } from 'src/app/core/models/master-admin.model';
export type SortColumn = keyof RolePermission | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface roleSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[rolesortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdRoleSortableHeader {
  @Input() rolesortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() rolessort = new EventEmitter<roleSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.rolessort.emit({
      column: this.rolesortable,
      direction: this.direction,
    });
  }
}
