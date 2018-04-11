import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificationQueueComponent } from './verification-queue.component';
// import { UserComponent } from './user/user.component';

const routes: Routes = [
    {
        path: '',
        component: VerificationQueueComponent,
        // children: [
        //     {
        //         path: 'user',
        //         component: UserComponent
        //     }
        // ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VerificationQueueRoutingModule {}
