import * as shared from '@shared/index';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from './components/card/card.module';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { NameInitialsPipe } from './pipes/name-initials.pipe copy';

@NgModule({
  declarations: [...shared.components, ...shared.directives, ...shared.pipes, DateAgoPipe, NameInitialsPipe],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CardModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ...shared.components,
    ...shared.directives,
    ...shared.pipes,
    DateAgoPipe,
    NameInitialsPipe,
  ],
})
export class SharedModule {}
