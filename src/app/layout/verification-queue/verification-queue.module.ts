import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationQueueComponent } from './verification-queue.component';
import { VerificationQueueRoutingModule } from './verification-queue-routing.module';

@NgModule({
  imports: [
    CommonModule,
    VerificationQueueRoutingModule
  ],
  declarations: [VerificationQueueComponent]
})
export class VerificationQueueModule { }
