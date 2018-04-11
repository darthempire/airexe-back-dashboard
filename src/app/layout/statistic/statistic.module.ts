import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticRoutingModule } from './statistic-routing.module';

import { StatisticComponent } from './statistic.component';

@NgModule({
    imports: [CommonModule, StatisticRoutingModule],
    declarations: [StatisticComponent]
})
export class StatisticModule {}
