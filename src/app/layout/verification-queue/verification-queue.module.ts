import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationQueueRoutingModule } from './verification-queue-routing.module';

import { VerificationQueueComponent } from './verification-queue.component';

import { HttpClient } from './../../shared/utils/HttpClient';
import { UserService } from './../../shared/core/user.service';


@NgModule({
  imports: [
    CommonModule,
    VerificationQueueRoutingModule
  ],
  declarations: [VerificationQueueComponent],
  providers: [UserService, HttpClient]
})
export class VerificationQueueModule { }
