import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationQueueRoutingModule } from './verification-queue-routing.module';

import { VerificationQueueComponent } from './verification-queue.component';

import { HttpClient } from './../../shared/utils/HttpClient';
import { UserService } from './../../shared/core/user.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    VerificationQueueRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [VerificationQueueComponent],
  providers: [UserService, HttpClient, ReactiveFormsModule ]
})
export class VerificationQueueModule { }
