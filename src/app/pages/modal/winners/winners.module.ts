import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WinnersPage } from './winners.page';
import {PipesModule} from '../../../pipes/pipes.module';
import {EmptyRecordsModule} from "../../../components/shared/empty-records/empty-records.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EmptyRecordsModule
  ],
  declarations: [WinnersPage],
  entryComponents: [WinnersPage]
})
export class WinnersPageModule {}
