import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { UserComponent } from './verification-queue/user/user.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LayoutComponent, NavbarComponent, SidebarComponent, UserComponent]
})
export class LayoutModule { }
