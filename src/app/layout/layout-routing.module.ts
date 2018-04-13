import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { UserComponent } from './verification-queue/user/user.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'verification-queue', loadChildren: './verification-queue/verification-queue.module#VerificationQueueModule' },
            { path: 'statistic', loadChildren: './statistic/statistic.module#StatisticModule' },
            { path: 'verification-queue/user/:id', component: UserComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
