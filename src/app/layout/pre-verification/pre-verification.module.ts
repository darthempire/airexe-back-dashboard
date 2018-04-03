import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PreVerificationComponent } from './pre-verification.component';

import { PreVerificationRoutingModule } from './pre-verification-routing.module';

import { HttpClient } from './../../shared/utils/HttpClient';
import { AuthService } from './../../shared/core/auth.service';
import { UserService } from './../../shared/core/user.service';

@NgModule({
  imports: [
    CommonModule,
    PreVerificationRoutingModule,
    FormsModule
  ],
  declarations: [PreVerificationComponent],
  providers: [UserService, HttpClient, AuthService]
})

export class PreVerificationModule { }
