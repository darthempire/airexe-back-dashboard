import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AuthGuard } from './shared/guard/auth.guard';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { LoaderService } from './shared/core/loader.service';
import { NotificationService } from './shared/core/notification.service';
import { AuthService } from './shared/core/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuard, LoaderService, NotificationService, AuthService, ReactiveFormsModule],
  exports: [ReactiveFormsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
