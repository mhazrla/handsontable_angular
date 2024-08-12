import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbNavModule,
  NgbAccordionModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';

// Swiper Slider
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

// Counter
import { CountToModule } from 'angular-count-to';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ScrollspyDirective } from './scrollspy.directive';

@NgModule({
  declarations: [ScrollspyDirective, BreadcrumbsComponent],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgxUsefulSwiperModule,
    CountToModule,
  ],
})
export class SharedModule {}
