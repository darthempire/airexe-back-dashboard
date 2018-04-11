import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationQueueComponent } from './verification-queue.component';

const routes: Routes = [
    { path: '', component: VerificationQueueComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationQueueRoutingModule { }
