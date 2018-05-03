import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { VerificationQueueRoutingModule } from './verification-queue-routing.module';

import { VerificationQueueComponent } from './verification-queue.component';

import { HttpClient } from './../../shared/utils/HttpClient';
import { UserService } from './../../shared/core/user.service';



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
